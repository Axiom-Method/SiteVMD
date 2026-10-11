/**
 * Geometria do vidro estilhaçado da Hero.
 *
 * Simula uma fratura de impacto ("teia de aranha"): trincas radiais saindo de um ponto,
 * trincas concêntricas ligando as radiais, e os cacos que ficam entre elas. Cada caco
 * desloca um pouco a imagem que está atrás (refração), que é o que faz o vidro parecer
 * quebrado de verdade. Alguns cacos internos caíram (buracos por onde vaza a luz laranja)
 * e alguns estilhaços soltos flutuam à frente.
 */

export type Retangulo = { x0: number; y0: number; x1: number; y1: number };
type Ponto = [number, number];

export type Caco = {
  d: string;
  cx: number;
  cy: number;
  /** Buraco: o caco caiu e a luz passa direto. */
  buraco: boolean;
  /** Tinta do vidro: índice do gradiente e opacidade. */
  tinta: "g0" | "g1" | "g2" | "g3" | "escuro" | "laranja";
  alpha: number;
  /** Transformação aplicada à imagem de fundo dentro do caco (refração). Nula = sem refração. */
  refracao: string | null;
  delay: number;
  brilho?: { pontos: string; atraso: number };
};

export type Trinca = { d: string; w: number; o: number; delay: number };

export type Estilhaco = {
  d: string;
  x: number;
  y: number;
  /** Profundidade para o parallax (maior = mais perto, mexe mais). */
  prof: number;
  /** Entrada: parte do ponto de impacto. */
  sx: number;
  sy: number;
  delay: number;
  fd: number;
  fx: number;
  fy: number;
  fr: number;
  laranja: boolean;
};

/** Trecho da fratura principal (o "corte" de luz). `w` escala a espessura; `pulso` = braço principal. */
export type Corte = { d: string; w: number; delay: number; pulso: boolean };

/** Faísca que se solta do corte e sobe devagar. */
export type Faisca = { x: number; y: number; r: number; fx: number; fy: number; fd: number; delay: number };

export type Cena = {
  W: number;
  H: number;
  ix: number;
  iy: number;
  alcance: number;
  esc: number;
  /** Direção da fratura principal (graus, sentido SVG). */
  angulo: number;
  cacos: Caco[];
  trincas: Trinca[];
  micro: string;
  corte: Corte[];
  faiscas: Faisca[];
  estilhacos: Estilhaco[];
};

type Opcoes = { mobile: boolean; semente?: number };

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f1 = (n: number) => n.toFixed(1);
const f2 = (n: number) => Math.round(n * 100) / 100;
const DOIS_PI = Math.PI * 2;
const caminho = (pts: Ponto[]) => "M" + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L") + "Z";

function area(p: Ponto[]) {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[(i + 1) % p.length];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}

export function gerarVidro(W: number, H: number, rects: Retangulo[], { mobile, semente = 2026 }: Opcoes): Cena {
  const rnd = mulberry32(semente);
  const esc = Math.min(Math.max(Math.min(W, H) / 800, 0.6), 1.3);

  // Ponto de impacto: à direita do texto no desktop; no celular, no alto, acima do texto.
  const topoTexto = rects.length ? Math.min(...rects.map((r) => r.y0)) : H * 0.4;
  const ix = mobile ? W * 0.72 : W * 0.71;
  const iy = mobile ? Math.max(56, topoTexto * 0.45) : H * 0.44;
  // Fratura principal: diagonal de baixo-esquerda para cima-direita (o atleta rompendo o vidro).
  const ang = mobile ? -0.82 : -0.98;
  const maxR = Math.max(Math.hypot(ix, iy), Math.hypot(W - ix, iy), Math.hypot(ix, H - iy), Math.hypot(W - ix, H - iy)) + 40;
  const alcance = mobile ? Math.max(W, H) * 0.62 : Math.max(W * 0.5, H * 0.75);

  // Trincas radiais
  const N = mobile ? 13 : 18;
  const passo = DOIS_PI / N;
  const giro = rnd() * passo;
  const th: number[] = [];
  for (let i = 0; i < N; i++) th.push(giro + (i + (rnd() - 0.5) * 0.55) * passo);

  // Anéis (raios crescem em progressão geométrica, como numa fratura real)
  const raios: number[] = [];
  for (let r = 9 * esc; r < maxR; r *= 1.4 + rnd() * 0.14) raios.push(r);
  raios.push(maxR * 1.05);
  const K = raios.length;

  const V: Ponto[][] = raios.map((r, k) =>
    th.map((t) => {
      const rr = k === 0 ? r : r * (1 + (rnd() - 0.5) * 0.2);
      const a = t + (rnd() - 0.5) * passo * (k === 0 ? 0.05 : 0.14);
      return [ix + rr * Math.cos(a), iy + rr * Math.sin(a)] as Ponto;
    }),
  );
  const P = (k: number, i: number) => V[k][((i % N) + N) % N];

  // Quais trechos dos anéis existem (entre a radial i e a i+1)
  const anel: boolean[][] = raios.map((_, k) =>
    th.map(() => k === 0 || k === K - 1 || rnd() < (k < 3 ? 0.92 : k < 6 ? 0.72 : 0.5)),
  );

  const cacos: Caco[] = [];
  const trincas: Trinca[] = [];
  const t01 = (x: number, y: number) => Math.min(Math.hypot(x - ix, y - iy) / alcance, 1.4);

  const addCaco = (pts: Ponto[], ka: number) => {
    const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
    const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    const t = t01(cx, cy);
    const buraco = ka >= 1 && ka <= 3 && rnd() < 0.17;

    let refracao: string | null = null;
    if (!buraco && t < 1.1) {
      const ang = rnd() * DOIS_PI;
      const mag = ((1 - Math.min(t, 1)) * 9 + 1.5 + rnd() * 3) * esc;
      const s = 1 + rnd() * 0.04;
      refracao =
        `translate(${f1(Math.cos(ang) * mag)} ${f1(Math.sin(ang) * mag)}) ` +
        `translate(${f1(cx)} ${f1(cy)}) scale(${s.toFixed(3)}) translate(${f1(-cx)} ${f1(-cy)})`;
    }

    const sorteio = rnd();
    const tinta: Caco["tinta"] =
      sorteio < (ka < 4 ? 0.05 : 0.015) ? "laranja" : sorteio < 0.36 ? "escuro" : (["g0", "g1", "g2", "g3"] as const)[Math.floor(rnd() * 4)];

    let brilho: Caco["brilho"];
    if (!buraco && rnd() < 0.14) {
      let melhor = 0;
      let idx = 0;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        const l = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (l > melhor) {
          melhor = l;
          idx = i;
        }
      }
      const a = pts[idx];
      const b = pts[(idx + 1) % pts.length];
      brilho = { pontos: `${f1(a[0])},${f1(a[1])} ${f1(b[0])},${f1(b[1])}`, atraso: f2(1.5 + rnd() * 9) };
    }

    cacos.push({
      d: caminho(pts),
      cx: f2(cx),
      cy: f2(cy),
      buraco,
      tinta,
      alpha: f2(0.3 + rnd() * 0.7),
      refracao,
      delay: f2(0.35 + Math.min(t, 1) * 0.55 + rnd() * 0.08),
      brilho,
    });
  };

  // Cacos: entre duas radiais vizinhas e dois anéis existentes
  for (let i = 0; i < N; i++) {
    let ka = 0;
    for (let k = 1; k < K; k++) {
      if (!anel[k][i]) continue;
      const lado1: Ponto[] = [];
      const lado0: Ponto[] = [];
      for (let m = ka; m <= k; m++) lado1.push(P(m, i + 1));
      for (let m = k; m > ka; m--) lado0.push(P(m, i));
      const pts: Ponto[] = [P(ka, i), ...lado1, ...lado0];

      // Cacos grandes às vezes racham na diagonal
      if (ka > 0 && rnd() < 0.38 && area(pts) > 1800 * esc * esc) {
        if (rnd() < 0.5) {
          addCaco([P(ka, i), ...lado1], ka);
          addCaco([P(ka, i), P(k, i + 1), ...lado0], ka);
          trincas.push(diag(P(ka, i), P(k, i + 1), k));
        } else {
          addCaco([P(ka, i), P(ka, i + 1), ...lado0], ka);
          addCaco([P(ka, i + 1), ...lado1.slice(1), P(k, i)], ka);
          trincas.push(diag(P(ka, i + 1), P(k, i), k));
        }
      } else {
        addCaco(pts, ka);
      }
      ka = k;
    }
  }

  function diag(a: Ponto, b: Ponto, k: number): Trinca {
    return { d: `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`, w: 0.7, o: 0.3, delay: f2(0.3 + k * 0.06) };
  }

  // Trincas radiais: mais grossas perto do impacto, afinando para fora
  const faixas: [number, number, number, number][] = [
    [0, 3, 2.1, 0.95],
    [3, 6, 1.3, 0.7],
    [6, K - 1, 0.8, 0.42],
  ];
  for (let i = 0; i < N; i++) {
    faixas.forEach(([de, ate, w, o], b) => {
      if (de >= ate) return;
      let d = `M${f1(P(de, i)[0])} ${f1(P(de, i)[1])}`;
      for (let k = de + 1; k <= ate; k++) d += `L${f1(P(k, i)[0])} ${f1(P(k, i)[1])}`;
      trincas.push({ d, w: w * (0.8 + rnd() * 0.4), o, delay: f2(0.04 + b * 0.16 + rnd() * 0.05) });
    });
  }

  // Trincas concêntricas (levemente curvas)
  for (let k = 1; k < K - 1; k++) {
    for (let i = 0; i < N; i++) {
      if (!anel[k][i]) continue;
      const a = P(k, i);
      const b = P(k, i + 1);
      const mx = (a[0] + b[0]) / 2;
      const my = (a[1] + b[1]) / 2;
      const bojo = 1 + (rnd() - 0.3) * 0.06;
      const qx = ix + (mx - ix) * bojo;
      const qy = iy + (my - iy) * bojo;
      trincas.push({
        d: `M${f1(a[0])} ${f1(a[1])}Q${f1(qx)} ${f1(qy)} ${f1(b[0])} ${f1(b[1])}`,
        w: Math.max(0.6, 1.6 - k * 0.11),
        o: Math.max(0.26, 0.75 - k * 0.05),
        delay: f2(0.16 + k * 0.055 + rnd() * 0.04),
      });
    }
  }

  // Microtrincas na zona de esmagamento
  let micro = "";
  const rMicro = (raios[2] ?? 30) * 1.1;
  for (let j = 0; j < (mobile ? 22 : 34); j++) {
    const a = rnd() * DOIS_PI;
    const r0 = rnd() * rMicro * 0.5;
    const l = (4 + rnd() * 14) * esc;
    const a2 = a + (rnd() - 0.5) * 1.2;
    const x0 = ix + r0 * Math.cos(a);
    const y0 = iy + r0 * Math.sin(a);
    micro += `M${f1(x0)} ${f1(y0)}L${f1(x0 + l * Math.cos(a2))} ${f1(y0 + l * Math.sin(a2))}`;
  }

  const folga = 28;
  const livre = (x: number, y: number, r: number) =>
    x > r && x < W - r && y > r && y < H - r &&
    rects.every((q) => x + r < q.x0 - folga || x - r > q.x1 + folga || y + r < q.y0 - folga || y - r > q.y1 + folga);
  const sobreTexto = (x: number, y: number) =>
    rects.some((q) => x > q.x0 - folga && x < q.x1 + folga && y > q.y0 - folga && y < q.y1 + folga);

  // Corte: dois braços serrilhados saindo do impacto, com ramificações curtas
  const corte: Corte[] = [];
  const bracos: Ponto[][] = [];
  const serrilhar = (x0: number, y0: number, dir: number, max: number, desvio: number) => {
    const pts: Ponto[] = [[x0, y0]];
    let x = x0;
    let y = y0;
    let lateral = 0;
    for (let l = 0; l < max; ) {
      const passoC = (22 + rnd() * 38) * esc;
      lateral = Math.max(-desvio, Math.min(desvio, lateral + (rnd() - 0.5) * desvio));
      const a = dir + (rnd() - 0.5) * 0.18;
      x += Math.cos(a) * passoC - Math.sin(dir) * lateral * 0.3;
      y += Math.sin(a) * passoC + Math.cos(dir) * lateral * 0.3;
      l += passoC;
      if (sobreTexto(x, y)) break;
      pts.push([x, y]);
      if (x < -30 || x > W + 30 || y < -30 || y > H + 30) break;
    }
    return pts;
  };
  const tracar = (pts: Ponto[]) => "M" + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L");
  [ang, ang + Math.PI].forEach((dir, b) => {
    const pts = serrilhar(ix, iy, dir, maxR * 1.2, 10 * esc);
    if (pts.length < 2) return;
    bracos.push(pts);
    corte.push({ d: tracar(pts), w: b === 0 ? 1 : 0.85, delay: 0.02, pulso: true });
    // Ramificações: saem do braço e afinam
    for (let r = 0; r < (mobile ? 2 : 3); r++) {
      const idx = 1 + Math.floor(rnd() * Math.max(1, pts.length - 2));
      const [rx, ry] = pts[idx];
      const lado = rnd() < 0.5 ? -1 : 1;
      const ramo = serrilhar(rx, ry, dir + lado * (0.45 + rnd() * 0.45), (50 + rnd() * 110) * esc, 5 * esc);
      if (ramo.length > 1) corte.push({ d: tracar(ramo), w: f2(0.4 + rnd() * 0.2), delay: f2(0.2 + idx * 0.04), pulso: false });
    }
  });

  // Faíscas: nascem ao longo do corte e sobem devagar
  const faiscas: Faisca[] = [];
  const pontosCorte = bracos.flat();
  for (let n = 0, tent = 0; pontosCorte.length && n < (mobile ? 6 : 14) && tent < 200; tent++) {
    const [px, py] = pontosCorte[Math.floor(rnd() * pontosCorte.length)];
    const x = px + (rnd() - 0.5) * 24 * esc;
    const y = py + (rnd() - 0.5) * 24 * esc;
    if (!livre(x, y, 6)) continue;
    faiscas.push({
      x: f2(x),
      y: f2(y),
      r: f2((0.8 + rnd() * 1.6) * esc),
      fx: f2((rnd() - 0.3) * 50 * esc),
      fy: f2(-(30 + rnd() * 70) * esc),
      fd: f2(3.5 + rnd() * 3.5),
      delay: f2(1.4 + rnd() * 6),
    });
    n++;
  }

  // Estilhaços soltos: lascas finas e pontudas, fora da área do texto, lançadas na direção da fratura

  const estilhacos: Estilhaco[] = [];
  const total = mobile ? 7 : 14;
  for (let n = 0, tent = 0; n < total && tent < 400; tent++) {
    const tam = (12 + rnd() * 44) * esc * (n < 3 ? 1.3 : 1);
    const a = rnd() < 0.7 ? (rnd() < 0.6 ? ang : ang + Math.PI) + (rnd() - 0.5) * 1.3 : rnd() * DOIS_PI;
    const r = alcance * (0.18 + rnd() * 0.9);
    const x = ix + r * Math.cos(a);
    const y = iy + r * Math.sin(a);
    if (!livre(x, y, tam)) continue;

    // Eixo longo alinhado com a trajetória: a lasca parece ter sido arremessada
    const rot = a + (rnd() - 0.5) * 0.7;
    const pts: Ponto[] = [
      [tam, 0],
      [tam * (0.25 + rnd() * 0.3), tam * (0.2 + rnd() * 0.25)],
      [-tam * (0.4 + rnd() * 0.4), tam * (0.05 + rnd() * 0.25)],
      [-tam * (0.2 + rnd() * 0.3), -tam * (0.15 + rnd() * 0.2)],
    ].map(([px, py]) => [px * Math.cos(rot) - py * Math.sin(rot), px * Math.sin(rot) + py * Math.cos(rot)] as Ponto);

    estilhacos.push({
      d: caminho(pts),
      x: f2(x),
      y: f2(y),
      prof: f2(0.6 + (tam / (56 * esc)) * 2.2),
      sx: f2(ix - x),
      sy: f2(iy - y),
      delay: f2(0.05 + rnd() * 0.18),
      fd: f2(4.5 + rnd() * 4),
      fx: f2((rnd() - 0.5) * 8),
      fy: f2((rnd() - 0.5) * 10),
      fr: f2((rnd() - 0.5) * 10),
      laranja: rnd() < 0.3,
    });
    n++;
  }

  return {
    W, H, ix: f2(ix), iy: f2(iy), alcance: f2(alcance), esc,
    angulo: f2((ang * 180) / Math.PI),
    cacos, trincas, micro, corte, faiscas, estilhacos,
  };
}
