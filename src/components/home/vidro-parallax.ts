/**
 * Movimento do vidro com o mouse: a imagem atrás do vidro desliza (a refração dos cacos
 * muda junto), os estilhaços soltos se movem em profundidades diferentes e uma luz
 * acompanha o cursor, acendendo as trincas por perto. Sem dependências.
 */

type Estilo = { style: { transform: string } };

export type AlvosParallax = {
  /** Imagem de fundo (vista através do vidro). */
  fundo: Estilo;
  /** Placa de vidro (cacos + trincas). */
  placa: Estilo;
  /** Estilhaços soltos e sua profundidade. */
  estilhacos: { el: Estilo; prof: number }[];
  /** Círculo da máscara de luz (atributos cx/cy). */
  luz: { setAttribute(nome: string, valor: string): void };
};

const MOLA = 0.09;
const DESLOCA_FUNDO = 14; // px
const DESLOCA_PLACA = 4;
const DESLOCA_ESTILHACO = 9;

export function criarParallax(alvos: AlvosParallax, W: number, H: number) {
  let alvoX = 0;
  let alvoY = 0;
  let x = 0;
  let y = 0;
  let luzAlvo = { x: W / 2, y: H / 2 };
  const luz = { x: W / 2, y: H / 2 };
  let raf = 0;

  const t = (dx: number, dy: number) => `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;

  function quadro() {
    x += (alvoX - x) * MOLA;
    y += (alvoY - y) * MOLA;
    luz.x += (luzAlvo.x - luz.x) * 0.2;
    luz.y += (luzAlvo.y - luz.y) * 0.2;

    alvos.fundo.style.transform = t(-x * DESLOCA_FUNDO, -y * DESLOCA_FUNDO);
    alvos.placa.style.transform = t(x * DESLOCA_PLACA, y * DESLOCA_PLACA);
    for (const e of alvos.estilhacos) e.el.style.transform = t(x * e.prof * DESLOCA_ESTILHACO, y * e.prof * DESLOCA_ESTILHACO);
    alvos.luz.setAttribute("cx", luz.x.toFixed(1));
    alvos.luz.setAttribute("cy", luz.y.toFixed(1));

    const parado =
      Math.abs(alvoX - x) < 0.002 && Math.abs(alvoY - y) < 0.002 &&
      Math.abs(luzAlvo.x - luz.x) < 0.5 && Math.abs(luzAlvo.y - luz.y) < 0.5;
    raf = parado ? 0 : requestAnimationFrame(quadro);
  }
  const acordar = () => {
    if (!raf) raf = requestAnimationFrame(quadro);
  };

  return {
    /** Posição do mouse relativa ao canto da Hero (px). */
    mover(px: number, py: number) {
      alvoX = (px / W - 0.5) * 2;
      alvoY = (py / H - 0.5) * 2;
      luzAlvo = { x: px, y: py };
      acordar();
    },
    sair() {
      alvoX = alvoY = 0;
      acordar();
    },
    destruir() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      alvos.fundo.style.transform = "";
      alvos.placa.style.transform = "";
      for (const e of alvos.estilhacos) e.el.style.transform = "";
    },
  };
}
