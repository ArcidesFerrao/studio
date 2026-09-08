import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verifica a assinatura X-Hub-Signature-256 que o GitHub envia em cada
 * webhook, calculada como HMAC-SHA256 do corpo bruto (raw) da requisição
 * usando o secret configurado no GitHub. Tem de ser comparada com o corpo
 * RAW, não com o JSON re-serializado (a ordem de chaves/whitespace pode
 * diferir e quebrar a assinatura).
 */
export function verifyGithubSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;
  if (!signatureHeader.startsWith("sha256=")) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(`sha256=${expected}`);
  const receivedBuffer = Buffer.from(signatureHeader);

  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, receivedBuffer);
}
