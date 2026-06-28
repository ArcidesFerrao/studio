"use client";

import { trackCustom } from "../lib/pixel";

const WA_NUMBER = "258852740554";
const WA_TEXT =
  "Olá%2C+Vi+o+vosso+anúncio+sobre+a+landing+page+de+7.500+MZN.+Tenho+um+[negocio]+em+[bairro].+Como+funciona?";

export default function WAFab() {
  const handleClick = () => {
    trackCustom("ClickFAB", {
      content_name: "FAB WhatsApp",
      content_category: "CTA",
    });
    window.open(`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Contactar pelo WhatsApp"
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: "2.5rem",
        right: "1.5rem",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "#1d9e75",
        color: "#0B0F1C",
        fontWeight: 700,
        fontSize: "0.75rem",
        padding: "0.5rem 0.75rem",
        borderRadius: 9999,
        boxShadow: "0 4px 20px rgba(29,158,117,0.4)",
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(-2px)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 8px 28px rgba(29,158,117,0.55)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(0)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 4px 20px rgba(29,158,117,0.4)";
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.25rem"
        height="1.25rem"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" />
      </svg>
      WhatsApp · Resposta em &lt;24h
    </button>
  );
}
