"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "#services", label: "Serviços" },
  { href: "#projects", label: "Projetos" },
  { href: "#process", label: "Processo" },
  { href: "#about", label: "Sobre" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.1rem 1.5rem",
        background: scrolled ? "rgba(14,12,20,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid transparent",
        transition: "all .3s ease",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          fontFamily: "var(--font-display,'Syne',sans-serif)",
          fontWeight: 800,
          fontSize: "1.18rem",
          letterSpacing: "-.025em",
          color: "#eeeaff",
          textDecoration: "none",
        }}
      >
        <Image
          alt="icon"
          src="/favicon-w.png"
          width={24}
          height={24}
          style={{ marginRight: ".3rem" }}
        />
        WebStudio
      </Link>

      {/* Desktop */}
      <ul
        className="ws-mob-hide"
        style={{
          display: "flex",
          gap: "2.5rem",
          listStyle: "none",
          alignItems: "center",
        }}
      >
        {NAV.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="ws-nav-link">
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#contact"
            className="ws-btn"
            style={{ padding: ".5rem 1.2rem", fontSize: ".84rem" }}
          >
            Pedir Orçamento
          </a>
        </li>
      </ul>

      {/* Hamburger */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "none",
          background: "none",
          border: "none",
          color: "#eeeaff",
          cursor: "pointer",
          padding: ".25rem",
        }}
        className="ws-mob-hamburger"
        aria-label="menu"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          {open ? (
            <>
              <path
                d="M4 4l14 14M18 4L4 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <path
                d="M3 6h16M3 11h16M3 16h16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            background: "rgba(14,12,20,0.98)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "1.5rem 2rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                color: "rgba(238,234,255,0.65)",
                fontSize: "1rem",
                fontWeight: 500,
                textDecoration: "none",
                padding: ".5rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="ws-btn"
            style={{ marginTop: ".5rem", justifyContent: "center" }}
          >
            Pedir Orçamento
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .ws-mob-hamburger { display: flex !important; }
          .ws-mob-hide { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
