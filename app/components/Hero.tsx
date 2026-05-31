"use client";
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

export function Hero() {
  return (
    <header
      className="ws-grid-bg ws-noise"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "8rem 1.5rem 6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 75% 55% at 50% 42%, rgba(29,158,117,0.1) 0%, transparent 68%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Orbit rings */}
      <div
        className="ws-spin"
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          border: "1px dashed rgba(29,158,117,0.09)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-52%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        className="ws-spinr"
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          border: "1px solid rgba(29,158,117,0.06)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-52%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 880,
          width: "100%",
        }}
      >
        {/* Status badge */}
        <div
          className="ws-fi"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            background: "rgba(29,158,117,0.08)",
            border: "1px solid rgba(29,158,117,0.3)",
            color: "#1D9E75",
            fontSize: ".72rem",
            fontWeight: 700,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            padding: ".32rem .9rem",
            borderRadius: 100,
            marginBottom: "2.25rem",
          }}
        >
          <span
            className="ws-pulse"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#1D9E75",
              display: "inline-block",
            }}
          />
          Web Studio · Maputo, Moçambique 🇲🇿
        </div>

        {/* H1 */}
        <h1
          className="ws-fi-1"
          style={{
            fontFamily: "var(--font-display,'Syne',sans-serif)",
            fontSize: "clamp(3rem,7vw,5.8rem)",
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-.035em",
          }}
        >
          Sites que vendem.
          <br />
          <span style={{ color: "#1D9E75" }}>Código</span> que dura.
          <br />
          <span style={{ color: "rgba(238,234,255,0.22)" }}>
            Resultados
          </span>{" "}
          que ficam.
        </h1>

        {/* Sub */}
        <p
          className="ws-fi-2"
          style={{
            marginTop: "1.85rem",
            color: "rgba(238,234,255,0.48)",
            fontSize: "1.05rem",
            fontWeight: 300,
            lineHeight: 1.82,
            maxWidth: 520,
            margin: "1.85rem auto 0",
          }}
        >
          Arcides Ferrão — desenvolvedor full‑stack de Maputo. Construo presença
          digital séria para marcas que querem crescer de verdade.
        </p>

        {/* CTAs */}
        <div
          className="ws-fi-3"
          style={{
            marginTop: "2.8rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a href="#projects" className="ws-btn">
            Ver Projetos <Arrow />
          </a>
          <a href="#contact" className="ws-btn-ghost">
            Pedir Orçamento
          </a>
        </div>

        {/* Social proof pills */}
        <div
          className="ws-fi-4"
          style={{
            marginTop: "3.75rem",
            display: "flex",
            justifyContent: "center",
            gap: "1px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
            maxWidth: 520,
            margin: "3.75rem auto 0",
          }}
        >
          {[
            { val: "< 7 dias", label: "Entrega média" },
            { val: "< 24h", label: "Resposta" },
            { val: "10+", label: "Anos de JS" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "1.1rem .75rem",
                background: "rgba(22,20,30,0.8)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display,'Syne',sans-serif)",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  color: "#1D9E75",
                  lineHeight: 1,
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  color: "rgba(238,234,255,0.3)",
                  fontSize: ".68rem",
                  marginTop: ".28rem",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating cards */}
      {/* <div className="ws-float ws-mob-hide" style={{
        position:"absolute", left:"5%", top:"38%",
        background:"rgba(18,16,25,0.92)", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:12, padding:".9rem 1.1rem", backdropFilter:"blur(16px)", zIndex:1,
      }}>
        <div style={{ fontSize:".58rem", color:"rgba(238,234,255,0.3)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:".25rem" }}>Stack</div>
        <div style={{ fontFamily:"var(--font-display,'Syne',sans-serif)", fontWeight:800, fontSize:"1rem", color:"#eeeaff" }}>Next.js + TS</div>
      </div>
      <div className="ws-float2 ws-mob-hide" style={{
        position:"absolute", right:"5%", top:"44%",
        background:"rgba(18,16,25,0.92)", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:12, padding:".9rem 1.1rem", backdropFilter:"blur(16px)", zIndex:1,
      }}>
        <div style={{ fontSize:".58rem", color:"rgba(238,234,255,0.3)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:".25rem" }}>Desde</div>
        <div style={{ fontFamily:"var(--font-display,'Syne',sans-serif)", fontWeight:800, fontSize:"1rem", color:"#4a8fd4" }}>10 000 MZN</div>
      </div> */}

      {/* Scroll hint */}
      {/* <div
        style={{
          position: "absolute",
          bottom: "2.25rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: ".35rem",
          color: "rgba(238,234,255,0.2)",
          fontSize: ".66rem",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          zIndex: 1,
        }}
      >
        <span>Scroll</span>
        <div
          style={{
            width: 1,
            height: 28,
            background: "linear-gradient(to bottom, #1D9E75, transparent)",
          }}
        />
      </div> */}
    </header>
  );
}
