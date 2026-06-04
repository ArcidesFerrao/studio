"use client";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "2.75rem 3.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ color: "rgba(238,234,255,0.22)", fontSize: ".78rem" }}>
        © {year}{" "}
        <a
          href="https://www.evolurelabs.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "rgba(238,234,255,0.32)",
            fontSize: ".82rem",
            textDecoration: "none",
            transition: "color .2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#eeeaff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(238,234,255,0.32)")
          }
        >
          Evolure Labs
        </a>{" "}
        · Maputo, Moçambique
      </div>
      <div style={{ display: "flex", gap: "1.75rem" }}>
        {[
          { label: "GitHub", href: "https://github.com/ArcidesFerrao" },
          { label: "WhatsApp", href: "https://wa.me/258852740554" },
          { label: "Email", href: "mailto:cidesferrao@gmail.com" },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(238,234,255,0.32)",
              fontSize: ".82rem",
              textDecoration: "none",
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#eeeaff")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(238,234,255,0.32)")
            }
          >
            {l.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
