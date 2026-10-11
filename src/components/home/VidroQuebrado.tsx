"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gerarVidro, type Cena, type Retangulo } from "./vidro-geometria";
import { criarParallax } from "./vidro-parallax";

/** Mede a Hero e as linhas de texto (os estilhaços soltos não ficam sobre o texto). */
function medir(hero: HTMLElement) {
  const hb = hero.getBoundingClientRect();
  const rects: Retangulo[] = [];
  const add = (r: DOMRect) => {
    if (r.width > 1 && r.height > 1) {
      rects.push({ x0: r.left - hb.left, y0: r.top - hb.top, x1: r.right - hb.left, y1: r.bottom - hb.top });
    }
  };
  // As linhas do título entram animadas: mede o contêiner (fixo), não o texto em movimento.
  hero.querySelectorAll<HTMLElement>(".hero__linha").forEach((el) => add(el.getBoundingClientRect()));
  hero.querySelectorAll<HTMLElement>(".lead").forEach((el) => {
    const faixa = document.createRange();
    faixa.selectNodeContents(el);
    Array.from(faixa.getClientRects()).forEach(add);
  });
  hero.querySelectorAll<HTMLElement>(".acoes .btn").forEach((el) => add(el.getBoundingClientRect()));
  return { W: Math.round(hb.width), H: Math.round(hb.height), rects };
}

type Estado = { cena: Cena; animar: boolean };

const RAIO_LUZ = 230;

export function VidroQuebrado() {
  const raiz = useRef<HTMLDivElement>(null);
  const fundo = useRef<SVGGElement>(null);
  const placa = useRef<SVGGElement>(null);
  const luz = useRef<SVGCircleElement>(null);
  const [estado, setEstado] = useState<Estado | null>(null);

  // Gera o vidro depois que as fontes carregam e de novo quando a Hero muda de tamanho.
  useEffect(() => {
    const hero = raiz.current?.parentElement;
    if (!hero) return;
    let cancelado = false;
    let primeira = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let ultimo = "";

    const gerar = () => {
      const { W, H, rects } = medir(hero);
      if (W < 10 || H < 10 || `${W}x${H}` === ultimo) return;
      ultimo = `${W}x${H}`;
      setEstado({ cena: gerarVidro(W, H, rects, { mobile: W < 820 }), animar: primeira });
      primeira = false;
    };

    const fontes = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fontes, new Promise((ok) => setTimeout(ok, 700))]).then(() => {
      if (!cancelado) gerar();
    });

    const obs = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!primeira && !cancelado) gerar();
      }, 180);
    });
    obs.observe(hero);

    return () => {
      cancelado = true;
      clearTimeout(timer);
      obs.disconnect();
    };
  }, []);

  // Parallax e luz no cursor (só com mouse de verdade e sem "reduzir movimento").
  useEffect(() => {
    const hero = raiz.current?.parentElement;
    if (!estado || !hero || !raiz.current || !fundo.current || !placa.current || !luz.current) return;
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mouse || reduzir) return;

    const els = raiz.current.querySelectorAll<SVGGElement>(".estilhaco__mov");
    const par = criarParallax(
      {
        fundo: fundo.current,
        placa: placa.current,
        luz: luz.current,
        estilhacos: estado.cena.estilhacos.map((e, i) => ({ el: els[i], prof: e.prof })).filter((e) => e.el),
      },
      estado.cena.W,
      estado.cena.H,
    );
    const mover = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = hero.getBoundingClientRect();
      par.mover(e.clientX - r.left, e.clientY - r.top);
    };
    const sair = () => par.sair();
    hero.addEventListener("pointermove", mover);
    hero.addEventListener("pointerleave", sair);
    return () => {
      hero.removeEventListener("pointermove", mover);
      hero.removeEventListener("pointerleave", sair);
      par.destruir();
    };
  }, [estado]);

  const cena = estado?.cena;

  return (
    <div ref={raiz} className="hero__vidro" aria-hidden="true">
      {estado && cena && (
        <svg
          className={`vidro__svg${estado.animar ? "" : " vidro--parado"}`}
          width={cena.W}
          height={cena.H}
          viewBox={`0 0 ${cena.W} ${cena.H}`}
          style={{ "--ix": `${cena.ix}px`, "--iy": `${cena.iy}px` } as CSSProperties}
        >
          <defs>
            {/* Imagem "atrás do vidro": brilho laranja, linhas de velocidade e a marca VMD */}
            <radialGradient id="vq-glow" gradientUnits="userSpaceOnUse" cx={cena.ix} cy={cena.iy} r={cena.alcance * 0.9}>
              <stop offset="0" stopColor="#E8550F" stopOpacity="0.34" />
              <stop offset="0.3" stopColor="#E8550F" stopOpacity="0.08" />
              <stop offset="1" stopColor="#E8550F" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="vq-veloc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#EA8326" stopOpacity="0" />
              <stop offset="0.6" stopColor="#EA8326" stopOpacity="0.5" />
              <stop offset="1" stopColor="#F2F0EF" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="vq-marca" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#E8550F" stopOpacity="0.1" />
              <stop offset="1" stopColor="#E8550F" stopOpacity="0.02" />
            </linearGradient>
            <g id="vq-cena">
              <g ref={fundo} className="vidro__fundo">
                <rect x={-40} y={-40} width={cena.W + 80} height={cena.H + 80} fill="url(#vq-glow)" />
                <text
                  x={cena.ix}
                  y={cena.iy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={Math.min(cena.H * 0.62, cena.W * 0.36)}
                  className="vidro__marca"
                  fill="url(#vq-marca)"
                >
                  VMD
                </text>
                {/* Linhas de velocidade no sentido da fratura */}
                <g transform={`rotate(${cena.angulo} ${cena.ix} ${cena.iy})`}>
                  {[-0.42, -0.2, 0.06, 0.24, 0.4].map((o, i) => (
                    <rect
                      key={i}
                      x={cena.ix - cena.alcance * (1.1 - i * 0.08)}
                      y={cena.iy + o * cena.alcance}
                      width={cena.alcance * (0.9 + (i % 2) * 0.5)}
                      height={i % 2 ? 2 : 5}
                      rx={2}
                      fill="url(#vq-veloc)"
                      opacity={0.14 + (i % 3) * 0.07}
                    />
                  ))}
                </g>
              </g>
            </g>

            {/* Tintas do vidro */}
            <Tinta id="vq-g0" x1={0} y1={0} x2={1} y2={1} a={0.16} b={0.01} />
            <Tinta id="vq-g1" x1={1} y1={0} x2={0} y2={1} a={0.09} b={0} />
            <Tinta id="vq-g2" x1={0} y1={1} x2={1} y2={0} a={0.02} b={0.1} />
            <Tinta id="vq-g3" x1={0.5} y1={0} x2={0.5} y2={1} a={0.06} b={0.015} />
            <linearGradient id="vq-escuro" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#181818" stopOpacity="0.45" />
              <stop offset="1" stopColor="#181818" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="vq-laranja" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#E8550F" stopOpacity="0.32" />
              <stop offset="1" stopColor="#EA8326" stopOpacity="0.04" />
            </linearGradient>
            <radialGradient id="vq-buraco" gradientUnits="userSpaceOnUse" cx={cena.ix} cy={cena.iy} r={cena.alcance * 0.5}>
              <stop offset="0" stopColor="#EA8326" stopOpacity="0.4" />
              <stop offset="1" stopColor="#E8550F" stopOpacity="0.06" />
            </radialGradient>
            <radialGradient id="vq-impacto" gradientUnits="userSpaceOnUse" cx={cena.ix} cy={cena.iy} r={60 * cena.esc}>
              <stop offset="0" stopColor="#F2F0EF" stopOpacity="0.85" />
              <stop offset="0.25" stopColor="#F2F0EF" stopOpacity="0.35" />
              <stop offset="1" stopColor="#EA8326" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="vq-estilhaco" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F2F0EF" stopOpacity="0.32" />
              <stop offset="1" stopColor="#F2F0EF" stopOpacity="0.04" />
            </linearGradient>

            {/* Máscaras: o vidro some com a distância do impacto; a luz segue o cursor */}
            <radialGradient id="vq-fade" gradientUnits="userSpaceOnUse" cx={cena.ix} cy={cena.iy} r={cena.alcance * 1.25}>
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
            </radialGradient>
            <mask id="vq-m-fade" maskUnits="userSpaceOnUse" x={0} y={0} width={cena.W} height={cena.H}>
              <rect width={cena.W} height={cena.H} fill="url(#vq-fade)" />
            </mask>
            <radialGradient id="vq-luz">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="vq-m-luz" maskUnits="userSpaceOnUse" x={0} y={0} width={cena.W} height={cena.H}>
              <circle ref={luz} cx={cena.W / 2} cy={cena.H / 2} r={RAIO_LUZ} fill="url(#vq-luz)" />
            </mask>

            {cena.cacos.map((c, i) =>
              c.refracao ? (
                <clipPath key={i} id={`vq-c${i}`}>
                  <path d={c.d} />
                </clipPath>
              ) : null,
            )}
          </defs>

          {/* Fundo visto sem vidro */}
          <use href="#vq-cena" className="vidro__base" />

          <g ref={placa} className="vidro__placa">
            <g mask="url(#vq-m-fade)">
              {/* Refração: cada caco mostra o fundo um pouco deslocado */}
              <g className="vidro__refracao">
                {cena.cacos.map((c, i) =>
                  c.refracao ? (
                    <g key={i} clipPath={`url(#vq-c${i})`} className="caco__refr" style={{ "--d": `${c.delay}s` } as CSSProperties}>
                      <use href="#vq-cena" transform={c.refracao} />
                    </g>
                  ) : null,
                )}
              </g>

              {/* Tinta e reflexo de cada caco; buracos deixam a luz passar */}
              <g className="vidro__cacos">
                {cena.cacos.map((c, i) => (
                  <path
                    key={i}
                    d={c.d}
                    className={c.buraco ? "caco caco--buraco" : "caco"}
                    fill={c.buraco ? "url(#vq-buraco)" : `url(#vq-${c.tinta})`}
                    style={{ "--d": `${c.delay}s`, "--a": c.buraco ? 1 : c.alpha } as CSSProperties}
                  />
                ))}
              </g>

              {/* Trincas: sombra deslocada + aresta clara dão espessura ao vidro */}
              <g className="vidro__trincas vidro__trincas--sombra">
                {cena.trincas.map((t, i) => (
                  <path key={i} d={t.d} pathLength={1} strokeWidth={t.w + 0.6} style={{ "--d": `${t.delay}s` } as CSSProperties} />
                ))}
              </g>
              <g className="vidro__trincas">
                {cena.trincas.map((t, i) => (
                  <path
                    key={i}
                    d={t.d}
                    pathLength={1}
                    strokeWidth={t.w}
                    style={{ "--d": `${t.delay}s`, "--o": t.o } as CSSProperties}
                  />
                ))}
              </g>

              <g className="vidro__brilhos">
                {cena.cacos.map((c, i) =>
                  c.brilho ? (
                    <polyline key={i} points={c.brilho.pontos} style={{ "--gd": `${c.brilho.atraso}s` } as CSSProperties} />
                  ) : null,
                )}
              </g>

              {/* Luz do cursor acendendo as trincas */}
              <g className="vidro__luz" mask="url(#vq-m-luz)">
                {cena.trincas.map((t, i) => (
                  <path key={i} d={t.d} strokeWidth={t.w + 0.5} />
                ))}
              </g>
            </g>

            {/* Fratura principal: halo, brasa, fio e núcleo; um pulso de luz percorre os braços */}
            <g className="vidro__corte">
              {(["halo", "brasa", "fio", "nucleo"] as const).map((camada) => (
                <g key={camada} className={`corte__${camada}`}>
                  {cena.corte.map((c, i) => (
                    <path key={i} d={c.d} pathLength={1} style={{ "--w": c.w, "--d": `${c.delay}s` } as CSSProperties} />
                  ))}
                </g>
              ))}
              <g className="corte__pulso">
                {cena.corte.map((c, i) => (c.pulso ? <path key={i} d={c.d} pathLength={1} /> : null))}
              </g>
            </g>

            <g className="vidro__faiscas">
              {cena.faiscas.map((f, i) => (
                <circle
                  key={i}
                  cx={f.x}
                  cy={f.y}
                  r={f.r}
                  className="faisca"
                  style={{ "--fx": `${f.fx}px`, "--fy": `${f.fy}px`, "--fd": `${f.fd}s`, "--d": `${f.delay}s` } as CSSProperties}
                />
              ))}
            </g>

            {/* Ponto de impacto: vidro moído e microtrincas */}
            <g className="vidro__impacto">
              <circle cx={cena.ix} cy={cena.iy} r={60 * cena.esc} fill="url(#vq-impacto)" />
              <path d={cena.micro} />
            </g>
          </g>

          {/* Estilhaços soltos, à frente do vidro */}
          <g className="vidro__estilhacos">
            {cena.estilhacos.map((e, i) => (
              <g key={i} transform={`translate(${e.x} ${e.y})`}>
                <g className="estilhaco__mov">
                  <g
                    className="estilhaco__in"
                    style={{ "--sx": `${e.sx}px`, "--sy": `${e.sy}px`, "--d": `${e.delay}s` } as CSSProperties}
                  >
                    <path
                      d={e.d}
                      className={`estilhaco${e.laranja ? " estilhaco--laranja" : ""}`}
                      style={
                        { "--fd": `${e.fd}s`, "--fx": `${e.fx}px`, "--fy": `${e.fy}px`, "--fr": `${e.fr}deg` } as CSSProperties
                      }
                    />
                  </g>
                </g>
              </g>
            ))}
          </g>

          {/* Clarão do impacto (só na primeira vez) */}
          {estado.animar && <circle className="vidro__flash" cx={cena.ix} cy={cena.iy} r={cena.alcance * 0.6} fill="url(#vq-impacto)" />}
        </svg>
      )}
    </div>
  );
}

function Tinta(p: { id: string; x1: number; y1: number; x2: number; y2: number; a: number; b: number }) {
  return (
    <linearGradient id={p.id} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}>
      <stop offset="0" stopColor="#F2F0EF" stopOpacity={p.a} />
      <stop offset="1" stopColor="#F2F0EF" stopOpacity={p.b} />
    </linearGradient>
  );
}
