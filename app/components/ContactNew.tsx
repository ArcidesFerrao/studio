"use client";
import { useState } from "react";
import { useReveal } from "./useReveal";
declare global {
  interface Window {
    fbq?: (event: string, action: string) => void;
  }
}
type Status = "idle" | "loading" | "success" | "error";

const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WaIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Constrói mensagem WhatsApp enriquecida a partir do formulário
function buildWaMessage(form: {
  name: string;
  phone: string;
  email?: string;
  service: string;
  message: string;
}) {
  return encodeURIComponent(
    `Olá WebStudio! 👋\n\nVim através do site e quero falar sobre um projecto.\n\n` +
      `👤 Nome: ${form.name}\n` +
      `📱 Telefone: ${form.phone}\n` +
      `✉️ Email: ${form.email || "Não especificado"}\n` +
      `🛠️ Serviço: ${form.service || "Não especificado"}\n\n` +
      `📝 Mensagem:\n${form.message}\n\n` +
      `Aguardo resposta. Obrigado!`,
  );
}

const WA_NUMBER = "258852740554";

export function ContactNew() {
  const ref = useReveal();
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const update =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Contact");
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      await fetch("/api/meta-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: "Lead",
          eventSourceUrl: window.location.href,
        }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const handleWhatsApp = async () => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Contact");
    }
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${buildWaMessage(form)}`,
      "_blank",
    );
    await fetch("/api/meta-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "Lead",
        eventSourceUrl: window.location.href,
      }),
    });
  };

  return (
    <section
      id="contact"
      className="ws-mob-pad"
      style={{ padding: "7rem 3.5rem", position: "relative", zIndex: 1 }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* ── Top CTA banner ── */}
        <div
          ref={ref}
          className="ws-reveal"
          style={{
            background: "rgba(22,20,30,0.9)",
            border: "1px solid rgba(29,158,117,0.3)",
            borderRadius: 16,
            // padding: "3.5rem",
            padding: "clamp(1.5rem, 5vw, 3.5rem)",

            marginBottom: "3.5rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center bottom, rgba(29,158,117,0.08) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <span className="ws-label">Pronto para começar?</span>
          <h2
            className="ws-section-title"
            style={{ maxWidth: 560, margin: "0 auto .75rem" }}
          >
            Vamos criar a presença online que o teu negócio merece.
          </h2>
          <p
            style={{
              color: "rgba(238,234,255,0.42)",
              maxWidth: 440,
              margin: "0 auto 2rem",
              fontSize: ".95rem",
              fontWeight: 300,
              lineHeight: 1.78,
            }}
          >
            Descreva o seu projecto e receba uma proposta em menos de 24 horas.
          </p>

          {/* ── CTA Diagnóstico ── */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(29,158,117,0.08)",
              border: "1px solid rgba(29,158,117,0.25)",
              borderRadius: 12,
              padding: "1rem 1.5rem",
              maxWidth: 480,
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              transition: "border-color .2s, background .2s",
            }}
            onClick={() => {
              document
                .getElementById("quiz")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(29,158,117,0.5)";
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(29,158,117,0.13)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(29,158,117,0.25)";
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(29,158,117,0.08)";
            }}
          >
            {/* <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>🎯</span> */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: ".72rem",
                  color: "var(--ws-green-hi, #22c48d)",
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  marginBottom: ".2rem",
                }}
              >
                Ainda não sabe por onde começar?
              </div>
              <div
                style={{
                  fontSize: ".88rem",
                  color: "rgba(238,234,255,0.75)",
                  lineHeight: 1.5,
                }}
              >
                Faça o{" "}
                <strong style={{ color: "#eeeaff" }}>
                  Diagnóstico Digital Gratuito
                </strong>{" "}
                — 8 perguntas, 2 minutos, resultado personalizado.
              </div>
            </div>
            <Arrow />
          </div>
        </div>

        {/* ── Form + info ── */}
        <div
          className="ws-mob-col1 ws-mob-gap"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "3.5rem",
            alignItems: "start",
          }}
        >
          {/* ── Left ── */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display,'Syne',sans-serif)",
                fontSize: "1.5rem",
                fontWeight: 800,
                marginBottom: "1rem",
              }}
            >
              Fale connosco
            </h3>
            <p
              style={{
                color: "rgba(238,234,255,0.44)",
                fontSize: ".93rem",
                lineHeight: 1.8,
                fontWeight: 300,
                marginBottom: "2rem",
              }}
            >
              Atendemos projectos de qualquer tamanho. Seja uma landing page
              simples ou um sistema complexo.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".85rem",
                marginBottom: "2.5rem",
              }}
            >
              {[
                {
                  className: "material-symbols-light--mail",
                  label: "Email",
                  val: "contacto@evolurelabs.com",
                  href: "mailto:contacto@evolurelabs.com",
                },
                {
                  className: "ic--round-whatsapp",
                  label: "WhatsApp",
                  val: "+258 85 27 40 554",
                  href: `https://wa.me/${WA_NUMBER}`,
                },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    textDecoration: "none",
                    padding: ".9rem 1.1rem",
                    background: "rgba(22,20,30,0.9)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10,
                    transition: "border-color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(29,158,117,0.4)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)")
                  }
                >
                  <span
                    style={{ fontSize: "1.3rem" }}
                    className={c.className}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: ".65rem",
                        color: "rgba(238,234,255,0.3)",
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        marginBottom: ".18rem",
                      }}
                    >
                      {c.label}
                    </div>
                    <div
                      style={{
                        fontSize: ".88rem",
                        color: "#eeeaff",
                        fontWeight: 500,
                      }}
                    >
                      {c.val}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Trust points */}
            {[
              "Resposta em menos de 24 horas",
              "Proposta sem compromisso",
              "Suporte pós-lançamento incluído",
              "Pagamento em MZN",
            ].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".55rem",
                  color: "rgba(238,234,255,0.45)",
                  fontSize: ".85rem",
                  marginBottom: ".5rem",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#1D9E75",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {t}
              </div>
            ))}
          </div>

          {/* ── Right — form ── */}
          <div
            style={{
              background: "rgba(22,20,30,0.9)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              // padding: "2.25rem",
              padding: "clamp(1.5rem, 5vw, 2.5rem)",
            }}
          >
            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
                  ✅
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display,'Syne',sans-serif)",
                    fontWeight: 800,
                    fontSize: "1.3rem",
                    marginBottom: ".5rem",
                  }}
                >
                  Mensagem enviada!
                </h3>
                <p
                  style={{
                    color: "rgba(238,234,255,0.44)",
                    fontSize: ".9rem",
                    lineHeight: 1.7,
                  }}
                >
                  Recebi a sua mensagem e responderei em menos de 24 horas.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".95rem",
                }}
              >
                {/* Nome + Telefone */}
                <div
                  className="ws-mob-col2sm"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: ".95rem",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Nome</label>
                    <input
                      className="ws-input"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="O seu nome"
                      required
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Telefone</label>
                    <input
                      className="ws-input"
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="85 274 0554"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    className="ws-input"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                </div>

                {/* Serviço */}
                <div>
                  <label style={labelStyle}>Serviço</label>
                  <select
                    className="ws-input"
                    value={form.service}
                    onChange={update("service")}
                  >
                    <option value="">Seleccione um serviço</option>
                    <option>Landing Page</option>
                    <option>Site Completo</option>
                    <option>E-Commerce</option>
                    <option>Sistema de Gestão</option>
                    <option>Solução Personalizada</option>
                  </select>
                </div>

                {/* Mensagem */}
                <div>
                  <label style={labelStyle}>Mensagem</label>
                  <textarea
                    className="ws-input"
                    rows={4}
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Descreva o seu projecto..."
                    style={{ resize: "vertical" }}
                    required
                  />
                </div>

                {/* Botões */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".6rem",
                    marginTop: ".2rem",
                  }}
                >
                  {/* Enviar por email/API */}
                  <button
                    type="submit"
                    className="ws-btn"
                    disabled={status === "loading"}
                    style={{
                      justifyContent: "center",
                      fontSize: ".95rem",
                      padding: ".9rem",
                    }}
                  >
                    {status === "loading" ? "A enviar..." : "Enviar Pedido"}
                    {status !== "loading" && <Arrow />}
                  </button>

                  {/* ── WhatsApp enriquecido ── */}
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                      padding: ".85rem",
                      background: "rgba(29,158,117,0.1)",
                      border: "1px solid rgba(29,158,117,0.3)",
                      borderRadius: 10,
                      color: "var(--ws-green-hi, #22c48d)",
                      fontSize: ".88rem",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      transition: "background .2s, border-color .2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(29,158,117,0.18)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(29,158,117,0.55)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(29,158,117,0.1)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(29,158,117,0.3)";
                    }}
                  >
                    <WaIcon />
                    Continuar pelo WhatsApp
                  </button>
                </div>

                {/* Error state */}
                {status === "error" && (
                  <p
                    style={{
                      fontSize: ".8rem",
                      color: "#f87171",
                      textAlign: "center",
                    }}
                  >
                    Algo correu mal. Tente pelo WhatsApp abaixo.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Shared label style ────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: ".66rem",
  color: "rgba(238,234,255,0.35)",
  letterSpacing: ".1em",
  textTransform: "uppercase",
  marginBottom: ".38rem",
};
