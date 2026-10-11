import type { ReactNode } from "react";

/**
 * Camadas de fundo decorativas com o vocabulário do esporte (campo, pista, quadra, troféu,
 * rastros de luz). Ficam atrás do conteúdo, fora da árvore de acessibilidade.
 * Os traços usam vector-effect para manter 1–2px em qualquer escala/perspectiva.
 */
export type TipoFundo = "campo" | "pista" | "raias" | "area" | "rastro" | "quadra" | "trofeu";

const traco = { vectorEffect: "non-scaling-stroke" } as const;

/** Campo de futebol completo, em proporção oficial (105 × 68 m → 1050 × 680). */
function Campo() {
  // Meia-lua: raio 91.5 a partir da marca do pênalti (110), cortada na linha da área (165)
  const meiaLua = Math.sqrt(91.5 ** 2 - 55 ** 2);
  return (
    <svg className="fundo__campo" viewBox="-10 -10 1070 700" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="0" y="0" width="1050" height="680" style={traco} />
      <line x1="525" y1="0" x2="525" y2="680" style={traco} />
      <circle cx="525" cy="340" r="91.5" style={traco} />
      {[0, 1].map((lado) => (
        <g key={lado} transform={lado ? "translate(1050 0) scale(-1 1)" : undefined}>
          <rect x="0" y="138.5" width="165" height="403" style={traco} />
          <rect x="0" y="248.5" width="55" height="183" style={traco} />
          <path d={`M165 ${340 - meiaLua} A91.5 91.5 0 0 1 165 ${340 + meiaLua}`} style={traco} />
          <circle cx="110" cy="340" r="3" fill="currentColor" stroke="none" />
          <path d="M0 10 A10 10 0 0 0 10 0 M0 670 A10 10 0 0 1 10 680" style={traco} />
        </g>
      ))}
      <circle className="fundo__marca" cx="525" cy="340" r="5" stroke="none" />
    </svg>
  );
}

/** Raias de uma pista de atletismo (estádio com curvas), vistas em perspectiva. */
function Pista() {
  const raias = 7;
  return (
    <svg className="fundo__pista" viewBox="0 0 1200 600" fill="none" stroke="currentColor" strokeWidth="1.5">
      {Array.from({ length: raias }, (_, i) => {
        const d = i * 34;
        const h = 600 - 2 * d;
        return <rect key={i} x={d} y={d} width={1200 - 2 * d} height={h} rx={h / 2} style={traco} />;
      })}
    </svg>
  );
}

/**
 * Reta de atletismo atravessando a seção: raias paralelas, marcas de largada escalonadas
 * à esquerda e a chegada à direita — os passos do processo lidos como uma prova.
 */
function Raias() {
  const raias = 7;
  const alt = 60;
  const fim = raias * alt;
  return (
    <svg className="fundo__raias" viewBox="0 0 1600 420" fill="none" stroke="currentColor" strokeWidth="1.5">
      {Array.from({ length: raias + 1 }, (_, i) => (
        <line key={i} x1="0" y1={i * alt} x2="1600" y2={i * alt} style={traco} />
      ))}
      {/* Largada escalonada: cada raia sai um pouco à frente da de dentro */}
      {Array.from({ length: raias }, (_, i) => (
        <line key={`l${i}`} x1={150 + i * 26} y1={i * alt} x2={150 + i * 26} y2={(i + 1) * alt} style={traco} />
      ))}
      <line x1="1450" y1="0" x2="1450" y2={fim} style={traco} />
      <line x1="1462" y1="0" x2="1462" y2={fim} style={traco} />
    </svg>
  );
}

/** Quadra de basquete completa (28 × 15 m → 2800 × 1500), vista em perspectiva. */
function Quadra() {
  return (
    <svg className="fundo__quadra" viewBox="-20 -20 2840 1540" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="0" y="0" width="2800" height="1500" style={traco} />
      <line x1="1400" y1="0" x2="1400" y2="1500" style={traco} />
      <circle cx="1400" cy="750" r="180" style={traco} />
      {[0, 1].map((lado) => (
        <g key={lado} transform={lado ? "translate(2800 0) scale(-1 1)" : undefined}>
          {/* Garrafão, lance livre e linha de três pontos (arco de 6,75 m a partir da cesta) */}
          <rect x="0" y="505" width="580" height="490" style={traco} />
          <circle cx="580" cy="750" r="180" style={traco} />
          <path d="M0 90 H299 A675 675 0 0 1 299 1410 H0" style={traco} />
          <line x1="120" y1="660" x2="120" y2="840" style={traco} />
          <circle cx="157.5" cy="750" r="22.5" style={traco} />
          <path d="M157.5 625 A125 125 0 0 1 157.5 875" style={traco} />
        </g>
      ))}
    </svg>
  );
}

/** Grande área vista da marca do pênalti, com a linha de fundo embaixo. */
function Area() {
  const meiaLua = Math.sqrt(91.5 ** 2 - 55 ** 2);
  return (
    <svg className="fundo__area" viewBox="0 0 680 270" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="0" y1="265" x2="680" y2="265" style={traco} />
      <rect x="138.5" y="100" width="403" height="165" style={traco} />
      <rect x="248.5" y="210" width="183" height="55" style={traco} />
      <path d={`M${340 - meiaLua} 100 A91.5 91.5 0 0 1 ${340 + meiaLua} 100`} style={traco} />
      <circle cx="340" cy="155" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Rastros de luz na diagonal da fratura da Hero; cada um percorre a linha devagar. */
function Rastro() {
  const linhas = [
    { y: 520, o: 0.55, w: 1.5, dur: 9, delay: 0 },
    { y: 600, o: 0.3, w: 1, dur: 12, delay: -4 },
    { y: 690, o: 0.7, w: 2, dur: 8, delay: -2 },
    { y: 780, o: 0.25, w: 1, dur: 14, delay: -7 },
    { y: 860, o: 0.45, w: 1.5, dur: 10, delay: -5 },
  ];
  return (
    <svg className="fundo__rastro" viewBox="0 0 1400 900" fill="none" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="rastro-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--laranja)" stopOpacity="0" />
          <stop offset=".5" stopColor="var(--laranja-2)" />
          <stop offset="1" stopColor="var(--laranja)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {linhas.map((l, i) => (
        <g key={i} opacity={l.o}>
          {/* Trilho fixo, quase invisível, e o cometa que corre por ele */}
          <line x1="-100" y1={l.y + 300} x2="1500" y2={l.y - 700} stroke="url(#rastro-grad)" strokeWidth={l.w} opacity=".6" />
          <line
            className="fundo__cometa"
            x1="-100"
            y1={l.y + 300}
            x2="1500"
            y2={l.y - 700}
            pathLength={100}
            stroke="var(--laranja-2)"
            strokeWidth={l.w + 1}
            strokeLinecap="round"
            style={{ animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s` }}
          />
        </g>
      ))}
    </svg>
  );
}

/** Troféu em traço fino: taça com alças duplas, haste, base em dois níveis e placa. */
function Trofeu() {
  // Estrela de 5 pontas centrada na taça
  const estrela = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? 15 : 36;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${(300 + r * Math.cos(a)).toFixed(1)},${(205 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg className="fundo__trofeu" viewBox="0 0 600 760" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      {/* Taça */}
      <ellipse cx="300" cy="80" rx="170" ry="22" style={traco} />
      <path d="M130 80 C130 260 190 370 300 400 C410 370 470 260 470 80" style={traco} />
      <path d="M178 112 C180 220 210 300 252 342" style={traco} />
      <polygon points={estrela} style={traco} />
      {/* Alças (traço externo e interno), espelhadas */}
      {[0, 1].map((lado) => (
        <g key={lado} transform={lado ? "translate(600 0) scale(-1 1)" : undefined}>
          <path d="M134 118 C62 106 38 168 58 220 C78 272 138 294 182 304" style={traco} />
          <path d="M138 150 C96 146 84 184 97 214 C111 246 150 262 178 270" style={traco} />
        </g>
      ))}
      {/* Haste */}
      <path d="M282 400 V428 M318 400 V428" style={traco} />
      <ellipse cx="300" cy="442" rx="34" ry="14" style={traco} />
      <path d="M286 456 C286 512 262 536 248 560 M314 456 C314 512 338 536 352 560" style={traco} />
      {/* Base */}
      <rect x="226" y="560" width="148" height="20" rx="4" style={traco} />
      <path d="M208 580 H392 L410 682 H190 Z" style={traco} />
      <rect x="256" y="608" width="88" height="42" rx="3" style={traco} />
      <rect x="168" y="682" width="264" height="40" rx="4" style={traco} />
    </svg>
  );
}

const desenhos: Record<TipoFundo, () => ReactNode> = {
  campo: Campo,
  pista: Pista,
  raias: Raias,
  area: Area,
  rastro: Rastro,
  quadra: Quadra,
  trofeu: Trofeu,
};

export function FundoEsportivo({ tipo }: { tipo: TipoFundo }) {
  const Desenho = desenhos[tipo];
  return (
    <div className={`fundo fundo--${tipo}`} aria-hidden="true">
      <Desenho />
    </div>
  );
}
