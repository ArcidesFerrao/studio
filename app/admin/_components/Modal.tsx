"use client";

import { type ReactNode, useEffect } from "react";

export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="ws-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ws-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="ws-modal-head">
          <h2 className="ws-modal-title">{title}</h2>
          <button className="ws-close-btn" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>
        <div className="ws-modal-body">{children}</div>
        {footer && <div className="ws-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
