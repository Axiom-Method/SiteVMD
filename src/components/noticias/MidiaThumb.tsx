import Image from "next/image";

type Props = {
  imagem?: string;
  /** Mostra o botão de play centralizado (vídeos). */
  play?: boolean;
  duracao?: string;
  /** Texto do placeholder quando não há imagem. */
  rotulo?: string;
  grande?: boolean;
};

/** Miniatura decorativa de vídeo/notícia: imagem ou placeholder com a faceta laranja da marca. */
export function MidiaThumb({ imagem, play = false, duracao, rotulo, grande = false }: Props) {
  return (
    <div className={`midia ${grande ? "midia--grande" : ""}`.trim()} aria-hidden="true">
      {imagem ? (
        <Image src={imagem} alt="" fill sizes={grande ? "(max-width: 900px) 100vw, 640px" : "(max-width: 640px) 100vw, 380px"} className="midia__img" />
      ) : (
        rotulo && <span className="midia__rotulo">{rotulo}</span>
      )}
      {play && (
        <span className="midia__play">
          <svg viewBox="0 0 24 24">
            <path d="M8 5.5v13l10.5-6.5z" />
          </svg>
        </span>
      )}
      {duracao && <span className="midia__duracao">{duracao}</span>}
    </div>
  );
}
