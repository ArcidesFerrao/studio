import { NextRequest, NextResponse } from "next/server";
import { verifyGithubSignature } from "@/app/lib/github-webhook";
import { developmentEventService } from "@/app/lib/services/development-event.service";
import { fail } from "@/app/lib/api-response";
import type { DevelopmentEventInput } from "@/app/lib/services/development-event.service";
import type { EventActor } from "@/app/lib/permissions";

/**
 * Recebe webhooks do GitHub (push, pull_request) e converte cada um num
 * DevelopmentEvent, através do mesmo endpoint de ingestão único que a UI e
 * outras fontes usam (developmentEventService.ingest) — nunca escreve
 * diretamente em DevelopmentLog/FocusSession.
 *
 * Autenticação: assinatura HMAC (X-Hub-Signature-256), não sessão nem
 * Bearer token — é assim que o GitHub autentica webhooks nativamente.
 *
 * Setup no GitHub: Settings -> Webhooks -> Add webhook
 *   Payload URL: https://<teu-domínio>/api/integrations/github
 *   Content type: application/json
 *   Secret: o mesmo valor de GITHUB_WEBHOOK_SECRET
 *   Events: "Pushes" e "Pull requests"
 *
 * GITHUB_WEBHOOK_USER_ID: id do User (na tabela shared.users) a quem
 * atribuir os eventos. Solução simples para uso solo — quando fizer sentido
 * mapear múltiplos committers, isto evolui para procurar por email do autor
 * do commit em vez de um valor fixo.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const defaultUserId = process.env.GITHUB_WEBHOOK_USER_ID;

  if (!secret || !defaultUserId) {
    console.error(
      "[github-webhook] GITHUB_WEBHOOK_SECRET ou GITHUB_WEBHOOK_USER_ID não configurados"
    );
    return fail("Webhook não configurado no servidor.", 500);
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifyGithubSignature(rawBody, signature, secret)) {
    return fail("Assinatura inválida.", 401);
  }

  const githubEvent = req.headers.get("x-github-event");
  const payload = JSON.parse(rawBody);

  // Evento de teste enviado pelo GitHub ao configurar o webhook.
  if (githubEvent === "ping") {
    return NextResponse.json({ pong: true });
  }

  const actor: EventActor = { kind: "api_key", userId: defaultUserId, apiKeyId: "github-webhook" };

  try {
    if (githubEvent === "push") {
      const events = mapPushEvent(payload);
      for (const input of events) {
        await developmentEventService.ingest(input, actor);
      }
      return NextResponse.json({ processed: events.length });
    }

    if (githubEvent === "pull_request") {
      const input = mapPullRequestEvent(payload);
      if (!input) return NextResponse.json({ processed: 0 });
      await developmentEventService.ingest(input, actor);
      return NextResponse.json({ processed: 1 });
    }

    // Outros eventos do GitHub (issues, stars, etc.) — ignorados por agora.
    return NextResponse.json({ processed: 0, ignored: githubEvent });
  } catch (err) {
    console.error("[github-webhook]", err);
    return fail("Erro ao processar webhook.", 500);
  }
}

function mapPushEvent(payload: any): DevelopmentEventInput[] {
  const commits: any[] = Array.isArray(payload.commits) ? payload.commits : [];
  return commits.map((commit) => ({
    source: "GITHUB" as const,
    eventType: "COMMIT" as const,
    externalId: commit.id as string,
    metadata: {
      message: commit.message,
      url: commit.url,
      author: commit.author?.email ?? commit.author?.name,
      repo: payload.repository?.full_name,
      branch: (payload.ref as string | undefined)?.replace("refs/heads/", ""),
      addedFiles: commit.added?.length ?? 0,
      removedFiles: commit.removed?.length ?? 0,
      modifiedFiles: commit.modified?.length ?? 0,
    },
    timestamp: commit.timestamp ? new Date(commit.timestamp) : undefined,
  }));
}

function mapPullRequestEvent(payload: any): DevelopmentEventInput | null {
  const action = payload.action as string;
  const pr = payload.pull_request;
  if (!pr) return null;

  let eventType: "PR_CREATED" | "PR_MERGED" | null = null;
  if (action === "opened") eventType = "PR_CREATED";
  if (action === "closed" && pr.merged) eventType = "PR_MERGED";
  if (!eventType) return null;

  return {
    source: "GITHUB",
    eventType,
    externalId: String(pr.number),
    metadata: {
      title: pr.title,
      url: pr.html_url,
      repo: payload.repository?.full_name,
      baseBranch: pr.base?.ref,
      headBranch: pr.head?.ref,
      author: pr.user?.login,
    },
  };
}
