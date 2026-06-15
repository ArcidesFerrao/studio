"use client";
import { useState } from "react";
import { useReveal } from "./useReveal";

const SERVICES = [
  {
    num: "01",
    title: "Landing Pages",
    tagline: "Alta conversão. Primeiro impacto.",
    desc: "Páginas únicas com copy persuasivo, animações subtis e velocidade optimizada. Construídas para converter visitas em contactos.",
    price: "A partir de 10 000 MZN",
    accent: "#1D9E75",
    glow: "rgba(29,158,117,0.08)",
    tags: ["Next.js", "SEO", "Animações", "Responsivo"],
  },
  {
    num: "02",
    title: "Sites Completos",
    tagline: "Presença digital séria.",
    desc: "Sites multi-página com CMS, blog, formulário de contacto e SEO técnico. A sua marca representada com autoridade.",
    price: "A partir de 15 000 MZN",
    accent: "#4a8fd4",
    glow: "rgba(74,143,212,0.08)",
    tags: ["Multi-página", "CMS", "Blog", "Analytics"],
  },
  {
    num: "03",
    title: "E-Commerce",
    tagline: "Venda online, 24h por dia.",
    desc: "Lojas completas com catálogo, carrinho, pagamentos e painel de admin. Construídas para escalar e gerar receita real.",
    price: "A partir de 20 000 MZN",
    accent: "#e89c35",
    glow: "rgba(232,156,53,0.08)",
    tags: ["Loja Online", "Pagamentos", "Admin", "Stock"],
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

export function Services() {
  const ref = useReveal();

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
          {SERVICES.map((s, i) => (
            <Card key={i} s={s} delay={(i % 2) * 100} />
          ))}
        </div>
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
