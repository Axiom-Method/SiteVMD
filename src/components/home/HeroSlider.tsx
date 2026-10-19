"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icone } from "@/components/ui/Icone";
import { useTextos } from "@/i18n/cliente";
import { preencher } from "@/i18n/formatar";

/**
 * Hero da Home como slider de tela cheia com parallax em camadas (referência: "Artistic Parallax Slider").
 *
 * - Troca de slide: roda do mouse (só com a Hero no topo da página; no último slide a página volta a rolar),
 *   setas ↑ ↓, os marcadores do contador e arrastar para o lado no celular.
 * - Transição: o slide que sai "estica" na vertical (desfoque só no eixo Y, filtro SVG #hero-esticar) e cada
 *   camada entra numa velocidade (fundo < palavra < atleta): a profundidade vem da diferença de velocidade.
 * - Mouse e rolagem também deslocam as camadas (variáveis --mx, --my, --sy, sem re-render).
 * - "Reduzir movimento": vira um fade simples e a roda do mouse não troca slide.
 *
 * Todos os slides ficam no HTML (o primeiro traz o <h1>); os inativos ficam ocultos e inertes.
 * As animações estão no globals.css (bloco "Hero em slides").
 */

/** Duração da troca; igual à das animações de saída no CSS. */
const DURACAO = 1000;

/** Faíscas que sobem atrás do atleta: posições fixas (iguais no servidor e no cliente). */
const FAISCAS = Array.from({ length: 18 }, (_, i) => ({
  x: 40 + ((i * 37) % 55),
  atraso: (i * 0.73) % 6,
  duracao: 5 + ((i * 1.3) % 4),
  tamanho: 2 + (i % 3),
}));

type Estado = "ativo" | "saindo" | "oculto";

export function HeroSlider() {
  const { t } = useTextos();
  const slides = t.hero.slides;
  const total = slides.length;

  const [atual, setAtual] = useState(0);
  const [saindo, setSaindo] = useState<number | null>(null);
  const [direcao, setDirecao] = useState<1 | -1>(1);
  const [navegou, setNavegou] = useState(false);
  const [anuncio, setAnuncio] = useState("");

  const secao = useRef<HTMLElement>(null);
  const atualRef = useRef(0);
  const travado = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const ir = useCallback(
    (novo: number) => {
      const de = atualRef.current;
      if (novo === de || novo < 0 || novo >= total || travado.current) return;
      travado.current = true;
      atualRef.current = novo;
      setDirecao(novo > de ? 1 : -1);
      setSaindo(de);
      setAtual(novo);
      setNavegou(true);
      setAnuncio(`${preencher(t.hero.slideDe, { n: novo + 1, total })}: ${slides[novo].nome}`);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        travado.current = false;
        setSaindo(null);
      }, DURACAO);
    },
    [slides, t.hero.slideDe, total],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  // Roda do mouse: troca de slide enquanto a Hero está no topo; nas pontas, deixa a página rolar
  useEffect(() => {
    const el = secao.current;
    if (!el) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)");
    const roda = (e: WheelEvent) => {
      if (reduzir.matches || e.ctrlKey || Math.abs(e.deltaY) < 6 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (el.getBoundingClientRect().top < -4) return;
      const alvo = atualRef.current + (e.deltaY > 0 ? 1 : -1);
      if (alvo < 0 || alvo >= total) return;
      // Segura a rolagem também durante a troca: a inércia do trackpad não "vaza" para a página
      e.preventDefault();
      ir(alvo);
    };
    el.addEventListener("wheel", roda, { passive: false });
    return () => el.removeEventListener("wheel", roda);
  }, [ir, total]);

  // Arrastar para o lado (celular): a rolagem vertical da página continua livre
  useEffect(() => {
    const el = secao.current;
    if (!el) return;
    let x0 = 0;
    let y0 = 0;
    const inicio = (e: TouchEvent) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    };
    const fim = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) ir(atualRef.current + (dx < 0 ? 1 : -1));
    };
    el.addEventListener("touchstart", inicio, { passive: true });
    el.addEventListener("touchend", fim, { passive: true });
    return () => {
      el.removeEventListener("touchstart", inicio);
      el.removeEventListener("touchend", fim);
    };
  }, [ir]);

  // Parallax do mouse (só desktop) e da rolagem: grava variáveis CSS uma vez por quadro
  useEffect(() => {
    const el = secao.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let quadro = 0;
    let mx = 0;
    let my = 0;
    const aplicar = () => {
      quadro = 0;
      el.style.setProperty("--mx", mx.toFixed(3));
      el.style.setProperty("--my", my.toFixed(3));
      el.style.setProperty("--sy", String(Math.max(0, Math.min(window.scrollY, el.offsetHeight))));
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(aplicar);
    };
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      agendar();
    };
    const sair = () => {
      mx = 0;
      my = 0;
      agendar();
    };
    if (mouse) {
      el.addEventListener("pointermove", mover);
      el.addEventListener("pointerleave", sair);
    }
    window.addEventListener("scroll", agendar, { passive: true });
    return () => {
      cancelAnimationFrame(quadro);
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", sair);
      window.removeEventListener("scroll", agendar);
    };
  }, []);

  const numero = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      ref={secao}
      className="hero hero--slider"
      aria-roledescription="carrossel"
      aria-label={t.hero.carrossel}
      data-navegou={navegou || undefined}
      style={{ "--dir": direcao } as CSSProperties}
    >
      {/* Filtro do "esticar": desfoque só na vertical */}
      <svg className="sr-only" aria-hidden="true" focusable="false">
        <filter id="hero-esticar" x="0" y="-20%" width="100%" height="140%">
          <feGaussianBlur stdDeviation="0 26" />
        </filter>
      </svg>

      {slides.map((s, i) => {
        const estado: Estado = i === atual ? "ativo" : i === saindo ? "saindo" : "oculto";
        const Titulo = i === 0 ? "h1" : "h2";
        const letras = { "--letras": Math.max(3, s.palavra.length) } as CSSProperties;
        const linhas = [...s.titulo.map((texto) => ({ texto, destaque: false })), ...s.destaque.map((texto) => ({ texto, destaque: true }))];
        const sobre = i === 0 ? t.hero.posterSobre : s.nome;
        const selo = i === 0 ? t.hero.posterSelo : `${numero(i + 1)} / ${numero(total)}`;

        return (
          <div
            key={i}
            className={`slide slide--${i}`}
            data-estado={estado}
            role="group"
            aria-roledescription={t.hero.slideRotulo}
            aria-label={preencher(t.hero.slideDe, { n: i + 1, total })}
            aria-hidden={estado !== "ativo" || undefined}
            inert={estado !== "ativo"}
          >
            {/* Arte em camadas, de trás para frente: palavra gigante, contraluz, atleta e os textos do pôster */}
            <div className="slide__arte" aria-hidden="true">
              <div className="slide__camada slide__camada--palavra">
                <div className="hero__poster" style={letras}>
                  <span className="hero__poster-sobre">
                    {sobre} <span className="hero__poster-selo">{selo}</span>
                  </span>
                  <span className="hero__marca">
                    {[...s.palavra].map((letra, k) => (
                      <span key={k} style={{ "--i": k } as CSSProperties}>
                        {letra}
                      </span>
                    ))}
                  </span>
                  <span className="hero__poster-sob">{i === 0 ? t.hero.posterSob : ""}</span>
                </div>
              </div>
              <div className="slide__camada slide__camada--luz">
                <span className="slide__luz" />
              </div>
              <div className="slide__camada slide__camada--atleta">
                {/* Último slide ("elenco"): silhuetas extras ao fundo sugerem o grupo */}
                {i === total - 1 && (
                  <>
                    <span className="slide__atleta slide__atleta--eco slide__atleta--eco-1">
                      <Image src="/images/hero-atleta.webp" alt="" width={1237} height={1271} sizes="40vw" priority />
                    </span>
                    <span className="slide__atleta slide__atleta--eco slide__atleta--eco-2">
                      <Image src="/images/hero-atleta.webp" alt="" width={1237} height={1271} sizes="40vw" priority />
                    </span>
                  </>
                )}
                <span className="slide__atleta">
                  <Image
                    src="/images/hero-atleta.webp"
                    alt=""
                    width={1237}
                    height={1271}
                    // Mesmo arquivo em todos os slides (um download só): todas as cópias com prioridade
                    priority
                    sizes="(max-width: 820px) 100vw, 68vw"
                  />
                </span>
              </div>
              <div className="slide__camada slide__camada--frente">
                <div className="hero__poster hero__poster--frente" style={letras}>
                  <span className="hero__poster-sobre">
                    {sobre} <span className="hero__poster-selo">{selo}</span>
                  </span>
                  {/* Mesma estrutura (uma caixa por letra) da cópia de trás, para o contorno casar com ela */}
                  <span className="hero__marca">
                    {[...s.palavra].map((letra, k) => (
                      <span key={k} style={{ "--i": k } as CSSProperties}>
                        {letra}
                      </span>
                    ))}
                  </span>
                  <span className="hero__poster-sob">{i === 0 ? t.hero.posterSob : ""}</span>
                </div>
              </div>
            </div>

            <div className="slide__conteudo hero__conteudo container">
              <p className="eyebrow">{s.eyebrow}</p>
              <Titulo className="hero__titulo">
                {/* Cada linha sobe de dentro de uma máscara, em sequência (--i) */}
                {linhas.map((l, k) => (
                  <span key={l.texto} className={l.destaque ? "hero__linha destaque" : "hero__linha"}>
                    <span className="hero__linha-texto" style={{ "--i": k } as CSSProperties}>
                      {l.texto}
                    </span>{" "}
                  </span>
                ))}
              </Titulo>
              <p className="lead">{s.lead}</p>
              <div className="acoes">
                {s.ctas.map((c, k) => (
                  <ButtonLink key={c.href} href={c.href} variant={k === 0 ? "primario" : "contorno"} className={k === 0 ? "btn--seta btn--brilho" : ""}>
                    {c.texto}
                    {k === 0 && <Icone nome="seta" className="btn__seta" />}
                  </ButtonLink>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Camadas comuns a todos os slides: rastros de velocidade e faíscas */}
      <div className="hero__fixos" aria-hidden="true">
        <div className="hero__rastros">
          <span />
          <span />
          <span />
        </div>
        <div className="hero__faiscas">
          {FAISCAS.map((f, i) => (
            <span
              key={i}
              className="faisca"
              style={{ left: `${f.x}%`, width: f.tamanho, height: f.tamanho, animationDelay: `${f.atraso}s`, animationDuration: `${f.duracao}s` }}
            />
          ))}
        </div>
      </div>

      {/* Contador vertical (01 — 04) com um marcador clicável por slide */}
      <div className="hero__contador">
        <span className="hero__contador-num" aria-hidden="true">
          {numero(atual + 1)}
        </span>
        <ol className="hero__marcadores">
          {slides.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                className="hero__marcador"
                aria-current={i === atual ? "true" : undefined}
                aria-label={preencher(t.hero.irPara, { n: i + 1, nome: s.nome })}
                onClick={() => ir(i)}
              />
            </li>
          ))}
        </ol>
        <span className="hero__contador-num hero__contador-num--total" aria-hidden="true">
          {numero(total)}
        </span>
      </div>

      <div className="hero__setas">
        <button type="button" className="hero__seta" onClick={() => ir(atual - 1)} disabled={atual === 0} aria-label={t.hero.anterior}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button type="button" className="hero__seta" onClick={() => ir(atual + 1)} disabled={atual === total - 1} aria-label={t.hero.proximo}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 9l7 7 7-7" />
          </svg>
        </button>
      </div>

      <a href="#quem-somos" className="hero__rolar" aria-label={t.hero.rolarRotulo}>
        <span className="hero__rolar-mouse" aria-hidden="true" />
        <span aria-hidden="true">{t.hero.rolar}</span>
      </a>

      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>
    </section>
  );
}
