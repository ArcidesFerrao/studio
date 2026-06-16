"use client";
import { useState } from "react";
import Image from "next/image";
import { useReveal } from "./useReveal";

const PROJECTS = [
  // {
  //   title: "Veste Ousadia",
  //   type: "E-Commerce",
  //   desc: "Loja de moda moçambicana com catálogo completo, carrinho de compras e gestão de pedidos.",
  //   tags: ["Frontend", "Backend"],
  //   url: "https://www.vesteousadia.com",
  //   img: "/assets/ousadia.png",
  //   accent: "#1D9E75",
  // },
  {
    title: "JGTS Imobiliaria",
    type: "Website",
    desc: "Soluções imobiliárias completas para compra, venda e arrendamento de imóveis em Moçambique.",
    tags: ["Design", "Frontend", "Backend"],
    url: "https://www.jgtsimobiliaria.com/",
    img: "/assets/jgts.png",
    accent: "#1D9E75",
  },
  {
    title: "MGL-Services",
    type: "Landing Page",
    desc: "Soluções completas de limpeza geral e manutenção eléctrica para residências, escritórios e estabelecimentos comerciais.",
    tags: ["Frontend", "Design"],
    url: "https://mgl-services.evolurelabs.com",
    img: "/assets/mgl.png",
    accent: "#4a8fd4",
  },
  {
    title: "EcoFinancas",
    type: "Landing Page",
    desc: "Soluções financeiras desenhadas para a realidade moçambicana, com segurança e proximidade.",
    tags: ["Design", "Frontend"],
    url: "https://ecofinancas.evolurelabs.com",
    img: "/assets/eco.png",
    accent: "#8b7fe8",
  },
  {
    title: "Djopa",
    type: "Job Seeking Platform",
    desc: "Plataforma de emprego focada no mercado moçambicano, conectando candidatos a oportunidades locais e internacionais.",
    tags: ["Frontend", "Backend"],
    url: "#",
    img: "/assets/djopa.png",
    accent: "#1D9E75",
  },
  {
    title: "Contela",
    type: "Sistema de Gestão",
    desc: "Plataforma SaaS para gestão de encomendas, stock e fornecedores — desenhada para o mercado moçambicano.",
    tags: ["Design", "Frontend", "Backend"],
    url: "https://contela.evolurelabs.com",
    img: "/assets/contela.png",
    accent: "#4a8fd4",
  },
  {
    title: "Most Starred",
    type: "Estudo de Caso",
    desc: "Visualização interactiva dos repositórios GitHub mais populares por linguagem de programação.",
    tags: ["Design", "Frontend"],
    url: "#",
    img: "/assets/repo.png",
    accent: "#8b7fe8",
  },
];

// export function Projects() {
//   const ref = useReveal();

//   return (
//     <section
//       id="projects"
//       className="ws-mob-pad"
//       style={{ padding: "7rem 3.5rem", position: "relative", zIndex: 1 }}
//     >
//       <div style={{ maxWidth: 1100, margin: "0 auto" }}>
//         <div
//           ref={ref}
//           className="ws-reveal"
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-end",
//             flexWrap: "wrap",
//             gap: "1rem",
//             marginBottom: "3.5rem",
//           }}
//         >
//           <div>
//             <span className="ws-label">Projetos</span>
//             <h2 className="ws-section-title">
//               Trabalho real,
//               <br />
//               resultados reais.
//             </h2>
//           </div>
//           <a
//             href="https://github.com/ArcidesFerrao"
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{
//               color: "rgba(238,234,255,0.4)",
//               fontSize: ".84rem",
//               textDecoration: "none",
//               display: "inline-flex",
//               alignItems: "center",
//               gap: ".4rem",
//               transition: "color .2s",
//               whiteSpace: "nowrap",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.color = "#eeeaff")}
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.color = "rgba(238,234,255,0.4)")
//             }
//           >
//             Ver no GitHub
//             <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
//               <path
//                 d="M3 8h10M9 4l4 4-4 4"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </a>
//         </div>

//         <div
//           className="ws-mob-col1"
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3,1fr)",
//             gap: "1.25rem",
//           }}
//         >
//           {PROJECTS.map((p, i) => (
//             <ProjectCard key={i} p={p} delay={i * 100} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

export function Projects() {
  const ref = useReveal();
  const [visible, setVisible] = useState(3);

  return (
    <section
      id="projects"
      className="ws-mob-pad"
      style={{ padding: "7rem 3.5rem", position: "relative", zIndex: 1 }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          ref={ref}
          className="ws-reveal"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "3.5rem",
          }}
        >
          <div>
            <span className="ws-label">Projetos</span>
            <h2 className="ws-section-title">
              Trabalho real,
              <br />
              resultados reais.
            </h2>
          </div>
          <a
            href="https://github.com/ArcidesFerrao"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(238,234,255,0.4)",
              fontSize: ".84rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: ".4rem",
              transition: "color .2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#eeeaff")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(238,234,255,0.4)")
            }
          >
            Ver no GitHub
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
        <div
          className="ws-mob-col1"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "1.25rem",
          }}
        >
          {PROJECTS.slice(0, visible).map((p, i) => (
            <ProjectCard key={i} p={p} delay={i * 100} />
          ))}
        </div>

        {visible < PROJECTS.length && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <button
              onClick={() =>
                setVisible((v) => Math.min(v + 3, PROJECTS.length))
              }
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
              Ver mais projetos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ p, delay }: { p: (typeof PROJECTS)[0]; delay: number }) {
  const ref = useReveal(delay);
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      className="ws-reveal"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "rgba(22,20,30,0.9)",
        border: `1px solid ${hov ? p.accent + "45" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color .3s, transform .25s, box-shadow .25s",
        transform: hov ? "translateY(-4px)" : "",
        boxShadow: hov ? "0 20px 50px rgba(0,0,0,0.5)" : "none",
      }}
    >
      {/* Image */}
      <div
        style={{
          // height: 120,
          overflow: "hidden",
          position: "relative",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <Image
          src={p.img}
          alt={p.title}
          width={350}
          height={200}
          style={{
            width: "100%",
            // height: "100%",
            objectFit: "cover",
            transition: "transform .5s ease",
            transform: hov ? "scale(1.05)" : "scale(1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hov
              ? `linear-gradient(to top, ${p.accent}28, transparent)`
              : "linear-gradient(to top, rgba(14,12,20,0.5), transparent)",
            transition: "background .3s",
          }}
        />
      </div>

      {/* Body */}
      <div style={{ padding: "1.6rem" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: ".3rem",
            marginBottom: ".75rem",
          }}
        >
          {p.tags.map((t) => (
            <span key={t} className="ws-tag">
              {t}
            </span>
          ))}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display,'Syne',sans-serif)",
            fontSize: "1.1rem",
            fontWeight: 800,
            marginBottom: ".25rem",
            letterSpacing: "-.01em",
          }}
        >
          {p.title}
        </h3>
        <div
          style={{
            color: p.accent,
            fontSize: ".74rem",
            fontWeight: 600,
            marginBottom: ".6rem",
            letterSpacing: ".03em",
          }}
        >
          {p.type}
        </div>
        <p
          style={{
            color: "rgba(238,234,255,0.4)",
            fontSize: ".82rem",
            lineHeight: 1.68,
            fontWeight: 300,
            marginBottom: "1.1rem",
          }}
        >
          {p.desc}
        </p>
        {p.url !== "#" && (
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: p.accent,
              fontSize: ".8rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: ".3rem",
            }}
          >
            Ver projecto
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
