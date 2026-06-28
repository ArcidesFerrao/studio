"use client";

import { useState, useEffect, useRef } from "react";
import { useReveal } from "./useReveal";
import { trackCustom, trackPixel } from "../lib/pixel";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "intro" | "quiz" | "lead" | "result";

interface Question {
  q: string;
  opts: string[];
}

interface LeadData {
  name: string;
  phone: string;
  biz: string;
}

interface Dim {
  label: string;
  val: number;
}

interface Rec {
  icon: string;
  title: string;
  desc: string;
}

interface ResultData {
  level: string;
  title: string;
  desc: string;
  opp: number;
  dims: Dim[];
  recs: Rec[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const QUESTIONS: Question[] = [
  {
    q: "Como geres os teus clientes e encomendas actualmente?",
    opts: [
      "Tudo no papel ou na cabeça",
      "WhatsApp e ficheiros soltos",
      "Excel ou Google Sheets",
      "Tenho um sistema digital",
    ],
  },
  {
    q: "Quanto tempo perdes por semana em tarefas repetitivas?",
    opts: [
      "Mais de 10 horas",
      "Entre 5 e 10 horas",
      "Entre 2 e 5 horas",
      "Menos de 2 horas",
    ],
  },
  {
    q: "O teu negócio já tem presença online?",
    opts: [
      "Não, nenhuma",
      "Só redes sociais",
      "Site simples sem funcionalidades",
      "Site funcional e actualizado",
    ],
  },
  {
    q: "Como os teus clientes fazem pedidos ou contactos?",
    opts: [
      "Aparecem pessoalmente",
      "Ligam por telefone",
      "WhatsApp ou redes sociais",
      "Formulário/sistema online",
    ],
  },
  {
    q: "Tens controlo sobre o teu stock ou serviços em tempo real?",
    opts: [
      "Não tenho nenhum controlo",
      "Faço contagens manuais",
      "Uso folhas de cálculo",
      "Sim, com sistema automático",
    ],
  },
  {
    q: "Já perdeste dinheiro por falha no registo ou comunicação?",
    opts: [
      "Sim, frequentemente",
      "Sim, algumas vezes",
      "Raramente",
      "Nunca, tenho controlo total",
    ],
  },
  {
    q: "Qual é o teu principal desafio no negócio agora?",
    opts: [
      "Organização interna",
      "Atrair mais clientes",
      "Poupar tempo nas tarefas",
      "Crescer para outras zonas",
    ],
  },
  {
    q: "Qual é o teu orçamento para digitalizar o teu negócio?",
    opts: [
      "Ainda estou a avaliar",
      "Menos de 15.000 MT",
      "Entre 15.000 e 50.000 MT",
      "Acima de 50.000 MT",
    ],
  },
];

const SCORE_MAP = [3, 2, 1, 0];

const WA_NUMBER = "258852740554";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildResult(
  scores: number[],
  answers: number[],
  name: string,
): ResultData {
  const total = scores.reduce((a, b) => a + b, 0);
  const max = QUESTIONS.length * 3;
  const opp = Math.round((total / max) * 100);

  if (opp >= 70) {
    return {
      level: "Nível 1 — Operação Manual",
      title: "Elevada Oportunidade de Automação",
      desc: `${name}, o teu negócio ainda opera maioritariamente de forma manual. Existe um potencial enorme para reduzir custos, poupar horas e multiplicar vendas com o sistema certo.`,
      opp,
      dims: [
        { label: "Gestão de clientes", val: 15 },
        { label: "Presença digital", val: 20 },
        { label: "Automação", val: 10 },
        { label: "Controlo operacional", val: 18 },
      ],
      recs: [
        {
          icon: "⚡",
          title: "Sistema de Gestão de Clientes",
          desc: "CRM simples para registo, follow-up e histórico de cada cliente.",
        },
        {
          icon: "🌐",
          title: "Website com Catálogo Digital",
          desc: "Presença profissional com formulário de pedidos online.",
        },
        {
          icon: "📊",
          title: "Painel Administrativo",
          desc: "Controlo em tempo real do teu negócio pelo telemóvel.",
        },
      ],
    };
  }

  if (opp >= 40) {
    return {
      level: "Nível 2 — Digitalização Parcial",
      title: "Grande Potencial de Crescimento",
      desc: `${name}, já tens algumas ferramentas digitais mas ainda há muito por explorar. Integrar os teus processos num só sistema pode dobrar a tua produtividade.`,
      opp,
      dims: [
        { label: "Gestão de clientes", val: 45 },
        { label: "Presença digital", val: 55 },
        { label: "Automação", val: 35 },
        { label: "Controlo operacional", val: 40 },
      ],
      recs: [
        {
          icon: "🔗",
          title: "Integração de Sistemas",
          desc: "Unificar WhatsApp, stock e encomendas numa só plataforma.",
        },
        {
          icon: "📱",
          title: "App de Gestão Mobile",
          desc: "Gere tudo pelo telemóvel sem depender de papel ou Excel.",
        },
        {
          icon: "📣",
          title: "Marketing Digital Automatizado",
          desc: "Campanhas automáticas para reactivar e atrair clientes.",
        },
      ],
    };
  }

  return {
    level: "Nível 3 — Pronto para Escalar",
    title: "Negócio Pronto para Crescer",
    desc: `${name}, o teu negócio tem uma base digital sólida. O próximo passo é escalar para mais zonas de Maputo e aumentar receita com automação avançada.`,
    opp,
    dims: [
      { label: "Gestão de clientes", val: 78 },
      { label: "Presença digital", val: 72 },
      { label: "Automação", val: 65 },
      { label: "Controlo operacional", val: 80 },
    ],
    recs: [
      {
        icon: "🚀",
        title: "Plataforma de Escala",
        desc: "Sistema multi-ponto para gerir várias lojas ou zonas de entrega.",
      },
      {
        icon: "🤖",
        title: "Automação Avançada",
        desc: "Relatórios automáticos, alertas de stock e atendimento 24h.",
      },
      {
        icon: "📈",
        title: "Business Intelligence",
        desc: "Dashboard com métricas de vendas, clientes e crescimento.",
      },
    ],
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BrandMark() {
  return (
    <div className="flex items-center justify-center gap-2 mb-7">
      <span
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "1.4rem",
          color: "var(--ws-green-hi)",
          letterSpacing: "-0.5px",
        }}
      >
        WebStudio
      </span>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "var(--ws-green-hi)",
          display: "inline-block",
          animation: "wsPulse 2s infinite",
        }}
      />
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "var(--ws-card)",
        border: "1px solid var(--ws-border2)",
        borderRadius: 20,
        padding: "26px 22px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
      }}
    >
      {children}
    </div>
  );
}

function BtnPrimary({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        background: disabled
          ? "rgba(29,158,117,0.3)"
          : "linear-gradient(135deg, var(--ws-green), var(--ws-green-hi))",
        color: "#fff",
        border: "none",
        borderRadius: 12,
        padding: "16px 24px",
        fontFamily: "'Syne', sans-serif",
        fontSize: "0.95rem",
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.3px",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxShadow: disabled ? "none" : "0 4px 20px var(--ws-green-glow)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.transform =
            "translateY(-2px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 10px 30px rgba(29,158,117,0.35)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(0)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = disabled
          ? "none"
          : "0 4px 20px var(--ws-green-glow)";
      }}
    >
      {children}
    </button>
  );
}

function WaBadge({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(29,158,117,0.1)",
        border: "1px solid var(--ws-green-border)",
        color: "var(--ws-green-hi)",
        // fontSize: "0.7rem",
        fontSize: "clamp(.58rem, 2.5vw, .7rem)",
        fontWeight: 600,
        letterSpacing: "1.5px",
        textTransform: "uppercase" as const,
        padding: "5px 12px",
        borderRadius: 100,
        marginBottom: 18,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          background: "var(--ws-green-hi)",
          borderRadius: "50%",
          display: "inline-block",
        }}
      />
      {label}
    </div>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  const ref = useReveal();
  return (
    <div style={{ animation: "wsIn 0.45s cubic-bezier(0.22,1,0.36,1) both" }}>
      <div
        ref={ref}
        className="ws-reveal ws-mob-col1 ws-mob-gap"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}
      >
        {/* <BrandMark /> */}
        <div
          style={{
            textAlign: "center",
            // marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <WaBadge label="Diagnóstico Digital Gratuito" />
          <h2 className="ws-section-title" style={{ maxWidth: 560 }}>
            Descobre quanto o teu negócio está a{" "}
            <span style={{ color: "var(--ws-green-hi)" }}>perder</span> sem
            tecnologia
          </h2>
          <p
            style={{
              color: "var(--ws-muted)",
              fontSize: "0.88rem",
              lineHeight: 1.65,
            }}
          >
            Resultado personalizado com recomendações para o teu negócio em
            Maputo.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            justifyContent: "end",
            alignSelf: "end",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              marginBottom: 24,
            }}
          >
            {[
              ["8", "Perguntas"],
              ["2min", "Duração"],
              ["100%", "Gratuito"],
            ].map(([val, lbl]) => (
              <div
                key={lbl}
                style={{
                  background: "var(--ws-card)",
                  border: "1px solid var(--ws-border)",
                  borderRadius: 14,
                  // padding: "14px 10px",
                  padding:
                    "clamp(.6rem, 2.5vw, 1.1rem) clamp(.4rem, 2vw, .75rem)",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(.9rem, 2.5vw, 1.4rem)",
                    fontWeight: 800,
                    color: "var(--ws-green-hi)",
                  }}
                >
                  {val}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.65rem",
                    color: "var(--ws-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginTop: 2,
                  }}
                >
                  {lbl}
                </span>
              </div>
            ))}
          </div>
          <div>
            <BtnPrimary
              onClick={() => {
                trackCustom("QuizStart", {
                  content_name: "Diagnóstico WebStudio",
                });
                onStart();
              }}
            >
              Iniciar Diagnóstico →
            </BtnPrimary>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.7rem",
                color: "var(--ws-muted)",
                marginTop: 14,
              }}
            >
              Mais de 50 negócios em Maputo já diagnosticados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizScreen({
  cur,
  total,
  onAnswer,
}: {
  cur: number;
  total: number;
  onAnswer: (idx: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setSelected(null);
    setAnimKey((k) => k + 1);
  }, [cur]);

  const pct = Math.round(((cur + 1) / total) * 100);
  const q = QUESTIONS[cur];

  const handlePick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => onAnswer(i), 420);
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        animation: "wsIn 0.4s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <BrandMark />
      <Card>
        {/* Progress */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: "0.73rem",
              color: "var(--ws-muted)",
              fontWeight: 500,
            }}
          >
            Pergunta {cur + 1} de {total}
          </span>
          <span
            style={{
              fontSize: "0.73rem",
              color: "var(--ws-green-hi)",
              fontWeight: 700,
            }}
          >
            {pct}%
          </span>
        </div>
        <div
          style={{
            height: 4,
            background: "var(--ws-border)",
            borderRadius: 100,
            overflow: "hidden",
            marginBottom: 26,
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, var(--ws-green), var(--ws-green-hi))",
              borderRadius: 100,
              transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>

        {/* Question */}
        <p
          key={animKey}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.2rem",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "var(--ws-fg)",
            marginBottom: 22,
            animation: "wsIn 0.35s ease both",
          }}
        >
          {q.q}
        </p>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {q.opts.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => handlePick(i)}
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(29,158,117,0.22), rgba(34,196,141,0.1))"
                    : "var(--ws-card2)",
                  border: `1px solid ${isSelected ? "var(--ws-green)" : "var(--ws-border)"}`,
                  borderRadius: 11,
                  padding: "14px 16px",
                  fontSize: "0.88rem",
                  color: "var(--ws-fg)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 0.2s ease",
                  animation: `wsIn 0.35s ease ${i * 0.06}s both`,
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (selected === null) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "var(--ws-green-border)";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateX(5px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "var(--ws-border)";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateX(0)";
                  }
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: isSelected
                      ? "var(--ws-green)"
                      : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.68rem",
                    color: isSelected ? "#fff" : "var(--ws-muted)",
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {isSelected ? "✓" : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </Card>
      {/* <p
        style={{
          textAlign: "center",
          fontSize: "0.68rem",
          color: "var(--ws-muted)",
          marginTop: 12,
        }}
      >
        WebStudio · Maputo, Moçambique
      </p> */}
    </div>
  );
}

function LeadScreen({ onSubmit }: { onSubmit: (data: LeadData) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [biz, setBiz] = useState("");
  const [errors, setErrors] = useState({ name: false, phone: false });

  const submit = () => {
    const e = { name: !name.trim(), phone: !phone.trim() };
    setErrors(e);
    if (e.name || e.phone) return;
    onSubmit({ name: name.trim(), phone: phone.trim(), biz: biz.trim() });
  };

  const fieldStyle = (err: boolean) => ({
    background: "var(--ws-card2)",
    border: `1px solid ${err ? "var(--ws-green)" : "var(--ws-border)"}`,
    borderRadius: 10,
    padding: "13px 14px",
    fontSize: "0.9rem",
    color: "var(--ws-fg)",
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
  });

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        animation: "wsIn 0.45s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <BrandMark />
      <Card>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          {/* <div
            style={{
              width: 52,
              height: 52,
              background: "var(--ws-green-glow)",
              border: "1px solid var(--ws-green-border)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              margin: "0 auto 14px",
            }}
          >
            🎯
          </div> */}
          <h3
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "var(--ws-fg)",
              marginBottom: 8,
            }}
          >
            Quase lá! O teu diagnóstico está pronto.
          </h3>
          <p
            style={{
              fontSize: "0.83rem",
              color: "var(--ws-muted)",
              lineHeight: 1.6,
            }}
          >
            Para receber o teu resultado personalizado e as recomendações
            específicas, deixa os teus dados.
          </p>
        </div>

        {/* Peek bar */}
        <div
          style={{
            background: "var(--ws-green-glow)",
            border: "1px solid var(--ws-green-border)",
            borderRadius: 10,
            padding: "11px 14px",
            marginBottom: 22,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: "0.8rem",
            color: "var(--ws-muted)",
          }}
        >
          <span>🔒</span>
          <span>
            O resultado inclui o{" "}
            <strong style={{ color: "var(--ws-green-hi)" }}>
              sistema recomendado
            </strong>{" "}
            e a{" "}
            <strong style={{ color: "var(--ws-green-hi)" }}>
              estimativa de retorno
            </strong>{" "}
            para o teu sector.
          </span>
        </div>

        {/* Fields */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "O teu nome *",
              value: name,
              setter: setName,
              ph: "Ex: João Maputo",
              err: errors.name,
              type: "text",
            },
            {
              label: "WhatsApp *",
              value: phone,
              setter: setPhone,
              ph: "Ex: 84 123 4567",
              err: errors.phone,
              type: "tel",
            },
            {
              label: "Nome do negócio",
              value: biz,
              setter: setBiz,
              ph: "Ex: Restaurante da Maria",
              err: false,
              type: "text",
            },
          ].map(({ label, value, setter, ph, err, type }) => (
            <div
              key={label}
              style={{ display: "flex", flexDirection: "column", gap: 5 }}
            >
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "var(--ws-muted)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.8px",
                }}
              >
                {label}
              </label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={ph}
                style={fieldStyle(err)}
                onFocus={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "var(--ws-green)")
                }
                onBlur={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor = err
                    ? "var(--ws-green)"
                    : "var(--ws-border)")
                }
              />
            </div>
          ))}
        </div>

        <BtnPrimary onClick={submit}>
          Ver o meu diagnóstico completo →
        </BtnPrimary>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.68rem",
            color: "var(--ws-muted)",
            marginTop: 10,
          }}
        >
          Não enviamos spam. Os teus dados são usados apenas pelo WebStudio.
        </p>
      </Card>
    </div>
  );
}

function ArcScore({ opp }: { opp: number }) {
  const fillRef = useRef<SVGPathElement>(null);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const totalLen = 207;
    const offset = totalLen - (opp / 100) * totalLen;
    setTimeout(() => {
      if (fillRef.current)
        fillRef.current.style.strokeDashoffset = String(offset);
    }, 300);

    let count = 0;
    const timer = setInterval(() => {
      count += 2;
      if (count >= opp) {
        count = opp;
        clearInterval(timer);
      }
      setDisplayed(count);
    }, 18);
    return () => clearInterval(timer);
  }, [opp]);

  return (
    <div
      style={{
        position: "relative",
        width: 160,
        height: 100,
        margin: "0 auto 18px",
      }}
    >
      <svg
        viewBox="0 0 160 90"
        width="160"
        height="90"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="wsArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1d9e75" />
            <stop offset="100%" stopColor="#22c48d" />
          </linearGradient>
        </defs>
        <path
          d="M 14 88 A 66 66 0 0 1 146 88"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          ref={fillRef}
          d="M 14 88 A 66 66 0 0 1 146 88"
          fill="none"
          stroke="url(#wsArcGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="207"
          strokeDashoffset="207"
          style={{
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.9rem",
            fontWeight: 800,
            color: "var(--ws-green-hi)",
            display: "block",
            lineHeight: 1,
          }}
        >
          {displayed}%
        </span>
        <span
          style={{
            fontSize: "0.6rem",
            color: "var(--ws-muted)",
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
          }}
        >
          oportunidade
        </span>
      </div>
    </div>
  );
}

function ResultScreen({
  result,
  answers,
  lead,
  onRestart,
}: {
  result: ResultData;
  answers: number[];
  lead: LeadData;
  onRestart: () => void;
}) {
  const [dimsVisible, setDimsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDimsVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  const openWA = () => {
    trackPixel("Contact", {
      content_name: "WhatsApp CTA - Resultado Diagnóstico",
      value: result.opp,
    });
    const challenge = QUESTIONS[6]?.opts[answers[6]] ?? "Não especificado";
    const budget = QUESTIONS[7]?.opts[answers[7]] ?? "Não especificado";
    const presence = QUESTIONS[2]?.opts[answers[2]] ?? "Não especificado";

    const msg = encodeURIComponent(
      `Olá WebStudio! 👋\n\nAcabei de fazer o diagnóstico digital.\n\n👤 Nome: ${lead.name}\n🏢 Negócio: ${lead.biz || "N/A"}\n📱 WhatsApp: ${lead.phone}\n\n📊 Resultado: ${result.opp}% de oportunidade de automação\n\n🎯 Maior desafio: ${challenge}\n💰 Orçamento: ${budget}\n🌐 Presença actual: ${presence}\n\nQuero saber qual sistema recomendam para o meu negócio em Maputo.`,
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        animation: "wsIn 0.45s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      {/* <BrandMark /> */}
      <Card>
        {/* Level badge */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <span
            style={{
              background: "var(--ws-green-glow)",
              border: "1px solid var(--ws-green-border)",
              color: "var(--ws-green-hi)",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.72rem",
              padding: "5px 14px",
              borderRadius: 100,
              textTransform: "uppercase" as const,
              letterSpacing: "1px",
            }}
          >
            {result.level}
          </span>
        </div>

        <ArcScore opp={result.opp} />

        <h3
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "var(--ws-fg)",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          {result.title}
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--ws-muted)",
            lineHeight: 1.6,
            textAlign: "center",
            marginBottom: 22,
          }}
        >
          {result.desc}
        </p>

        {/* Dimension bars */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 22,
          }}
        >
          {result.dims.map((d, i) => (
            <div
              key={d.label}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "var(--ws-muted)",
                  width: 108,
                  flexShrink: 0,
                }}
              >
                {d.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 5,
                  background: "var(--ws-border)",
                  borderRadius: 100,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: dimsVisible ? `${d.val}%` : "0%",
                    background:
                      "linear-gradient(90deg, var(--ws-green), var(--ws-green-hi))",
                    borderRadius: 100,
                    transition: `width 1.1s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "var(--ws-muted)",
                  width: 28,
                  textAlign: "right",
                }}
              >
                {d.val}%
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            height: 1,
            background: "var(--ws-border)",
            margin: "18px 0",
          }}
        />

        <p
          style={{
            fontSize: "0.68rem",
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
            color: "var(--ws-muted)",
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          Sistema Recomendado Para Ti
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 9,
            marginBottom: 22,
          }}
        >
          {result.recs.map((r, i) => (
            <div
              key={r.title}
              style={{
                background: "var(--ws-green-glow)",
                border: "1px solid var(--ws-green-border)",
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: "0.85rem",
                animation: `wsIn 0.4s ease ${0.3 + i * 0.1}s both`,
              }}
            >
              {/* <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>
                {r.icon}
              </span> */}
              <div>
                <strong
                  style={{
                    display: "block",
                    color: "var(--ws-fg)",
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  {r.title}
                </strong>
                <span style={{ color: "var(--ws-muted)", fontSize: "0.8rem" }}>
                  {r.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        <BtnPrimary onClick={openWA}>
          Quero automatizar o meu negócio →
        </BtnPrimary>

        {/* WhatsApp secondary */}
        <button
          onClick={openWA}
          style={{
            width: "100%",
            background: "#128c7e",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 24px",
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            marginTop: 10,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#25d366";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#128c7e";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(0)";
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Agendar análise gratuita agora
        </button>
      </Card>

      <button
        onClick={onRestart}
        style={{
          display: "block",
          margin: "14px auto 0",
          background: "none",
          border: "none",
          fontSize: "0.78rem",
          color: "var(--ws-muted)",
          cursor: "pointer",
          textDecoration: "underline",
          fontFamily: "inherit",
        }}
      >
        ← Refazer o diagnóstico
      </button>
      {/* <p
        style={{
          textAlign: "center",
          fontSize: "0.68rem",
          color: "var(--ws-muted)",
          marginTop: 8,
        }}
      >
        WebStudio · Maputo, Moçambique
      </p> */}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * DiagnosticQuiz
 *
 * Quiz de diagnóstico digital para a landing page do WebStudio (Evolure Labs).
 * Usa as CSS variables da paleta ws definidas globalmente no projecto.
 *
 * Uso:
 *   import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
 *   <DiagnosticQuiz />
 *
 * Requisito: as variáveis --ws-* devem estar declaradas num selector
 * acessível (ex: :root ou .ws) no CSS global do projecto.
 *
 * Fonte de display recomendada: Syne (Google Fonts)
 * Adiciona ao layout: import { Syne } from "next/font/google"
 */
export function DiagnosticQuiz() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [cur, setCur] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [lead, setLead] = useState<LeadData>({ name: "", phone: "", biz: "" });
  const [result, setResult] = useState<ResultData | null>(null);

  const handleAnswer = (idx: number) => {
    const newScores = [...scores, SCORE_MAP[idx]];
    const newAnswers = [...answers, idx];
    setScores(newScores);
    setAnswers(newAnswers);
    const next = cur + 1;
    if (next < QUESTIONS.length) {
      setCur(next);
    } else {
      // ← ADICIONA AQUI
      trackCustom("QuizComplete", {
        content_name: "Diagnóstico WebStudio",
        num_items: QUESTIONS.length,
      });
      setScreen("lead");
    }
  };

  const handleLead = (data: LeadData) => {
    setLead(data);
    const r = buildResult(scores, answers, data.name);
    setResult(r);

    // ← ADICIONA AQUI
    trackPixel(
      "Lead",
      {
        content_name: "Diagnóstico WebStudio",
        content_category: "Quiz Lead",
      },
      { phone: data.phone, name: data.name },
    );

    setScreen("result");
  };

  const restart = () => {
    setCur(0);
    setScores([]);
    setAnswers([]);
    setLead({ name: "", phone: "", biz: "" });
    setResult(null);
    setScreen("intro");
  };

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes wsIn {
          from { opacity: 0; transform: translateY(22px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wsPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>

      <section
        id="quiz"
        className="ws-mob-pad"
        style={{
          padding: "4rem 3.5rem",
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {screen === "intro" && (
          <IntroScreen onStart={() => setScreen("quiz")} />
        )}
        {screen === "quiz" && (
          <QuizScreen
            cur={cur}
            total={QUESTIONS.length}
            onAnswer={handleAnswer}
          />
        )}
        {screen === "lead" && <LeadScreen onSubmit={handleLead} />}
        {screen === "result" && result && (
          <ResultScreen
            result={result}
            answers={answers}
            lead={lead}
            onRestart={restart}
          />
        )}
      </section>
    </>
  );
}

export default DiagnosticQuiz;
