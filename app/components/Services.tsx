"use client";
import { useState } from "react";
import { useReveal } from "./useReveal";

const SERVICES = [
  {
    num: "01",
    title: "Landing Pages",
    tagline: "Alta conversão. Primeiro impacto.",
    desc: "Uma página profissional, entregue em 5–7 dias. Para negócios que precisam de presença agora.",
    // desc: "Páginas únicas com copy persuasivo, animações subtis e velocidade optimizada. Construídas para converter visitas em contactos.",
    price: "A partir de 7 499 MZN",
    accent: "#1D9E75",
    glow: "rgba(29,158,117,0.08)",
    tags: ["Next.js", "SEO", "Animações", "Responsivo"],
    wpp: "https://wa.me/258843123456?text=Olá%20Evolure%20Labs,%20tenho%20interesse%20em%20uma%20landing%20page%20profissional.%20Podem%20me%20enviar%20mais%20informações?",
  },
  {
    num: "02",
    title: "Sites Completos",
    tagline: "Presença digital séria.",
    // desc: "Sites multi-página com CMS, blog, formulário de contacto e SEO técnico. A sua marca representada com autoridade.",
    desc: "Multi-página, formulário de contacto, integração WhatsApp e SEO básico. Para empresas estabelecidas.",
    price: "A partir de 11 999 MZN",
    accent: "#4a8fd4",
    glow: "rgba(74,143,212,0.08)",
    tags: ["Multi-página", "CMS", "Blog", "Analytics"],
    wpp: "https://wa.me/258843123456?text=Olá%20Evolure%20Labs,%20tenho%20interesse%20em%20um%20site%20completo.%20Podem%20me%20enviar%20mais%20informações?",
  },
  {
    num: "03",
    title: "E-Commerce",
    tagline: "Venda online, 24h por dia.",
    desc: "Lojas completas com catálogo, carrinho, pagamentos e painel de admin. Construídas para escalar e gerar receita real.",
    price: "Orçamento personalizado",
    accent: "#e89c35",
    glow: "rgba(232,156,53,0.08)",
    tags: ["Loja Online", "Pagamentos", "Admin", "Stock"],
    wpp: "https://wa.me/258843123456?text=Olá%20Evolure%20Labs,%20tenho%20interesse%20em%20um%20e-commerce.%20Podem%20me%20enviar%20mais%20informações?",
  },
  {
    num: "04",
    title: "Soluções Personalizadas",
    tagline: "Sistemas à medida do seu negócio.",
    desc: "Dashboards, APIs, automações e sistemas de gestão. Se consegue descrever o problema, construímos a solução.",
    price: "Orçamento personalizado",
    accent: "#8b7fe8",
    glow: "rgba(139,127,232,0.08)",
    tags: ["Dashboard", "API", "Automação", "Integração"],
  },
];

// export function Services() {
//   const ref = useReveal();
//   const [viewMore, setViewMore] = useState(false);

//   return (
//     <section
//       id="services"
//       className="ws-mob-pad"
//       style={{ padding: "7rem 3.5rem", position: "relative", zIndex: 1 }}
//     >
//       <div style={{ maxWidth: 1100, margin: "0 auto" }}>
//         <div ref={ref} className="ws-reveal" style={{ marginBottom: "3.5rem" }}>
//           <span className="ws-label">O que ofereço</span>
//           <h2 className="ws-section-title" style={{ maxWidth: 560 }}>
//             Soluções digitais para o seu negócio crescer
//           </h2>
//           <p className="ws-section-sub">
//             Cada projecto é construído de raiz para o contexto específico do
//             cliente.
//           </p>
//         </div>

//         <div
//           className="ws-mob-col1"
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: "1px",
//             background: "rgba(255,255,255,0.06)",
//             borderRadius: 16,
//             overflow: "hidden",
//             border: "1px solid rgba(255,255,255,0.06)",
//           }}
//         >
//           {SERVICES.map((s, i) => (
//             <Card key={i} s={s} delay={(i % 2) * 100} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

export function Services() {
  const ref = useReveal();
  const [showAll, setShowAll] = useState(false);

  const visibleServices = showAll ? SERVICES : SERVICES.slice(0, 2);

  return (
    <section
      id="services"
      className="ws-mob-pad"
      style={{ padding: "7rem 3.5rem", position: "relative", zIndex: 1 }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div ref={ref} className="ws-reveal" style={{ marginBottom: "3.5rem" }}>
          <span className="ws-label">O que ofereço</span>
          <h2 className="ws-section-title" style={{ maxWidth: 560 }}>
            Soluções digitais para o seu negócio crescer
          </h2>
          <p className="ws-section-sub">
            Cada projecto é construído de raiz para o contexto específico do
            cliente.
          </p>
        </div>

        <div
          className="ws-mob-col1"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {visibleServices.map((s, i) => (
            <Card key={i} s={s} delay={(i % 2) * 100} />
          ))}
        </div>

        {!showAll && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <button
              onClick={() => setShowAll(true)}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(238,234,255,0.7)",
                padding: ".65rem 2rem",
                borderRadius: 100,
                fontSize: ".85rem",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: ".04em",
                transition: "border-color .2s, color .2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "#1D9E75";
                (e.target as HTMLButtonElement).style.color = "#1D9E75";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.borderColor =
                  "rgba(255,255,255,0.12)";
                (e.target as HTMLButtonElement).style.color =
                  "rgba(238,234,255,0.7)";
              }}
            >
              Ver mais serviços
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Card({ s, delay }: { s: (typeof SERVICES)[0]; delay: number }) {
  const ref = useReveal(delay);
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      className="ws-reveal"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? s.glow : "rgba(22,20,30,0.9)",
        padding: "2.75rem",
        transition: "background .3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* watermark num */}
      <div
        style={{
          position: "absolute",
          right: "1.5rem",
          top: "1rem",
          fontFamily: "var(--font-display,'Syne',sans-serif)",
          fontSize: "4.5rem",
          fontWeight: 800,
          color: "rgba(255,255,255,0.03)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {s.num}
      </div>

      <div
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${s.accent}40`,
          color: s.accent,
          fontSize: ".68rem",
          fontWeight: 700,
          padding: ".28rem .75rem",
          borderRadius: 100,
          letterSpacing: ".07em",
        }}
      >
        {s.price}
      </div>
      <a
        href={s.wpp}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display,'Syne',sans-serif)",
            fontSize: "1.28rem",
            fontWeight: 800,
            marginBottom: ".28rem",
            letterSpacing: "-.01em",
          }}
        >
          {s.title}
        </h3>
      </a>
      <div
        style={{
          color: s.accent,
          fontSize: ".78rem",
          fontWeight: 600,
          marginBottom: ".8rem",
          letterSpacing: ".02em",
        }}
      >
        {s.tagline}
      </div>
      <p
        style={{
          color: "rgba(238,234,255,0.44)",
          fontSize: ".875rem",
          lineHeight: 1.78,
          fontWeight: 300,
          marginBottom: "1.4rem",
        }}
      >
        {s.desc}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: ".32rem" }}>
        {s.tags.map((t) => (
          <span key={t} className="ws-tag">
            {t}
          </span>
        ))}
      </div>

      {/* accent bottom line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${s.accent}, transparent)`,
          transformOrigin: "left",
          transform: hov ? "scaleX(1)" : "scaleX(0)",
          transition: "transform .4s ease",
        }}
      />
    </div>
  );
}
