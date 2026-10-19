"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Icone } from "@/components/ui/Icone";
import { linkWhatsApp } from "@/constants/site";
import { IDIOMA_PADRAO, NOME_IDIOMA, type Idioma } from "@/i18n/config";
import { LinkIdioma, useTextos } from "@/i18n/cliente";
import type { Dicionario } from "@/i18n/dicionarios";
import { preencher } from "@/i18n/formatar";
import { traduzirValor } from "@/i18n/valores";
import { formatarData } from "@/lib/utils";
import {
  cadastroAtletaSchema,
  idadeEm,
  MODALIDADES,
  UFS,
  type CadastroAtleta,
  type CadastroAtletaEntrada,
} from "@/validations/atleta.schema";

/**
 * Cadastro "Quero ser VMD": valida no navegador e abre o WhatsApp da VMD com os dados preenchidos.
 * O site não grava nada; quem envia a mensagem é o próprio visitante, pelo WhatsApp dele.
 * A tela segue o idioma do site; a mensagem para a VMD fica sempre em português (é a equipe que lê),
 * com o idioma do visitante indicado no fim.
 */

type Campos = Omit<CadastroAtletaEntrada, "consentimento"> & { consentimento: boolean };
type Erros = Partial<Record<keyof Campos, string>>;

const INICIAL: Campos = {
  nome: "",
  dataNascimento: "",
  cidade: "",
  uf: "" as Campos["uf"],
  modalidade: "" as Campos["modalidade"],
  posicao: "",
  clube: "",
  alturaCm: "",
  instagram: "",
  linkVideo: "",
  mensagem: "",
  responsavelNome: "",
  autorizacaoResponsavel: false,
  consentimento: false,
};

/** Ordem dos campos na tela: o foco vai para o primeiro com erro. */
const ORDEM: (keyof Campos)[] = [
  "nome", "dataNascimento", "cidade", "uf", "modalidade", "posicao", "clube", "alturaCm",
  "instagram", "linkVideo", "mensagem", "responsavelNome", "autorizacaoResponsavel", "consentimento",
];

function montarMensagem(d: CadastroAtleta, idioma: Idioma): string {
  const idade = idadeEm(d.dataNascimento);
  const linhas = [
    "*Cadastro de atleta - site VMD*",
    "",
    `*Nome:* ${d.nome}`,
    `*Nascimento:* ${formatarData(d.dataNascimento)} (${idade} anos)`,
    `*Cidade:* ${d.cidade}/${d.uf}`,
    `*Modalidade:* ${d.modalidade}`,
    d.posicao && `*Posição:* ${d.posicao}`,
    d.clube && `*Clube atual:* ${d.clube}`,
    d.alturaCm && `*Altura:* ${d.alturaCm} cm`,
    d.instagram && `*Instagram:* @${d.instagram}`,
    d.linkVideo && `*Vídeo:* ${d.linkVideo}`,
    d.mensagem && `*Mensagem:* ${d.mensagem}`,
    idade < 18 && "",
    idade < 18 && `*Responsável:* ${d.responsavelNome} (autorizou o cadastro)`,
    "",
    "Li e concordo com a Política de Privacidade da VMD.",
    idioma !== IDIOMA_PADRAO && `*Idioma do site:* ${NOME_IDIOMA[idioma]}`,
  ];
  return linhas.filter((l) => l !== false && l !== undefined).join("\n");
}

/** Código de erro do schema (validations/atleta.schema.ts) → texto no idioma da página. */
function mensagemDeErro(t: Dicionario, codigo: string): string {
  return codigo in t.cadastro.erros ? t.cadastro.erros[codigo as keyof Dicionario["cadastro"]["erros"]] : codigo;
}

function Campo({
  id,
  rotulo,
  erro,
  dica,
  opcional,
  children,
  largo,
  textoOpcional,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  dica?: string;
  opcional?: boolean;
  largo?: boolean;
  children: ReactNode;
  textoOpcional: string;
}) {
  return (
    <div className={`campo${largo ? " campo--largo" : ""}${erro ? " campo--erro" : ""}`}>
      <label htmlFor={id}>
        {rotulo}
        {opcional && <span className="campo__opcional"> {textoOpcional}</span>}
      </label>
      {children}
      {dica && !erro && (
        <p id={`${id}-dica`} className="campo__dica">
          {dica}
        </p>
      )}
      {erro && (
        <p id={`${id}-erro`} className="campo__mensagem-erro">
          {erro}
        </p>
      )}
    </div>
  );
}

export function FormCadastro() {
  const { idioma, t } = useTextos();
  const [campos, setCampos] = useState<Campos>(INICIAL);
  const [erros, setErros] = useState<Erros>({});
  const [linkEnviado, setLinkEnviado] = useState<string | null>(null);
  const resumo = useRef<HTMLDivElement>(null);

  const menor = /^\d{4}-\d{2}-\d{2}$/.test(campos.dataNascimento) && idadeEm(campos.dataNascimento) < 18;

  function alterar<K extends keyof Campos>(campo: K, valor: Campos[K]) {
    setCampos((c) => ({ ...c, [campo]: valor }));
    // Apaga o erro do campo assim que ele é corrigido
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  /** Atributos de acessibilidade comuns: liga o campo à dica/erro e marca inválido. */
  const aria = (id: keyof Campos, temDica = false) => ({
    id,
    name: id,
    "aria-invalid": erros[id] ? true : undefined,
    "aria-describedby": erros[id] ? `${id}-erro` : temDica ? `${id}-dica` : undefined,
  });

  function enviar(e: FormEvent) {
    e.preventDefault();
    const r = cadastroAtletaSchema.safeParse(campos);
    if (!r.success) {
      const novos: Erros = {};
      for (const issue of r.error.issues) {
        const campo = issue.path[0] as keyof Campos;
        novos[campo] ??= mensagemDeErro(t, issue.message);
      }
      setErros(novos);
      const primeiro = ORDEM.find((c) => novos[c]);
      if (primeiro) document.getElementById(primeiro)?.focus();
      return;
    }
    setErros({});
    const url = linkWhatsApp(montarMensagem(r.data, idioma));
    window.open(url, "_blank", "noopener,noreferrer");
    setLinkEnviado(url);
    requestAnimationFrame(() => resumo.current?.focus());
  }

  const totalErros = Object.values(erros).filter(Boolean).length;

  if (linkEnviado) {
    return (
      <div ref={resumo} className="cadastro__sucesso" tabIndex={-1} role="status">
        <span className="icone-caixa">
          <Icone nome="check" />
        </span>
        <h2>{t.cadastro.sucessoTitulo}</h2>
        <p>
          {t.cadastro.sucessoA} <strong>{t.cadastro.sucessoDestaque}</strong> {t.cadastro.sucessoB}
        </p>
        <div className="acoes">
          <a href={linkEnviado} target="_blank" rel="noopener noreferrer" className="btn btn--primario btn--seta">
            {t.cadastro.abrirDeNovo}
            <Icone nome="seta" className="btn__seta" />
          </a>
          <button type="button" className="btn btn--contorno" onClick={() => setLinkEnviado(null)}>
            {t.cadastro.editar}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="cadastro__form" onSubmit={enviar} noValidate>
      {totalErros > 0 && (
        <div className="cadastro__resumo" role="alert">
          {totalErros === 1 ? t.cadastro.umErro : preencher(t.cadastro.variosErros, { n: totalErros })}
        </div>
      )}

      <fieldset>
        <legend>{t.cadastro.dadosAtleta}</legend>
        <div className="campos">
          <Campo textoOpcional={t.cadastro.opcional} id="nome" rotulo={t.cadastro.nome} erro={erros.nome} largo>
            <input {...aria("nome")} type="text" autoComplete="name" value={campos.nome} onChange={(e) => alterar("nome", e.target.value)} />
          </Campo>
          <Campo textoOpcional={t.cadastro.opcional} id="dataNascimento" rotulo={t.cadastro.nascimento} erro={erros.dataNascimento} dica={t.cadastro.nascimentoDica}>
            <input
              {...aria("dataNascimento", true)}
              type="date"
              autoComplete="bday"
              value={campos.dataNascimento}
              onChange={(e) => alterar("dataNascimento", e.target.value)}
            />
          </Campo>
          <Campo textoOpcional={t.cadastro.opcional} id="alturaCm" rotulo={t.cadastro.altura} erro={erros.alturaCm} opcional>
            <input {...aria("alturaCm")} type="number" inputMode="numeric" min={100} max={230} placeholder="178" value={campos.alturaCm ?? ""} onChange={(e) => alterar("alturaCm", e.target.value)} />
          </Campo>
          <Campo textoOpcional={t.cadastro.opcional} id="cidade" rotulo={t.cadastro.cidade} erro={erros.cidade}>
            <input {...aria("cidade")} type="text" autoComplete="address-level2" value={campos.cidade} onChange={(e) => alterar("cidade", e.target.value)} />
          </Campo>
          <Campo textoOpcional={t.cadastro.opcional} id="uf" rotulo={t.cadastro.estado} erro={erros.uf}>
            <select {...aria("uf")} value={campos.uf} onChange={(e) => alterar("uf", e.target.value as Campos["uf"])}>
              <option value="">Selecione</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </Campo>
        </div>
      </fieldset>

      <fieldset>
        <legend>{t.cadastro.esporte}</legend>
        <div className="campos">
          <Campo textoOpcional={t.cadastro.opcional} id="modalidade" rotulo={t.cadastro.modalidade} erro={erros.modalidade}>
            <select {...aria("modalidade")} value={campos.modalidade} onChange={(e) => alterar("modalidade", e.target.value as Campos["modalidade"])}>
              <option value="">Selecione</option>
              {MODALIDADES.map((m) => (
                <option key={m} value={m}>
                  {traduzirValor(t, "modalidades", m)}
                </option>
              ))}
            </select>
          </Campo>
          <Campo textoOpcional={t.cadastro.opcional} id="posicao" rotulo={t.cadastro.posicao} erro={erros.posicao} opcional>
            <input {...aria("posicao")} type="text" placeholder={t.cadastro.posicaoExemplo} value={campos.posicao ?? ""} onChange={(e) => alterar("posicao", e.target.value)} />
          </Campo>
          <Campo textoOpcional={t.cadastro.opcional} id="clube" rotulo={t.cadastro.clube} erro={erros.clube} opcional largo>
            <input {...aria("clube")} type="text" value={campos.clube ?? ""} onChange={(e) => alterar("clube", e.target.value)} />
          </Campo>
        </div>
      </fieldset>

      <fieldset>
        <legend>{t.cadastro.midia}</legend>
        <div className="campos">
          <Campo textoOpcional={t.cadastro.opcional} id="instagram" rotulo={t.cadastro.instagram} erro={erros.instagram} opcional>
            <input {...aria("instagram")} type="text" placeholder={t.cadastro.instagramExemplo} autoCapitalize="none" value={campos.instagram ?? ""} onChange={(e) => alterar("instagram", e.target.value)} />
          </Campo>
          <Campo textoOpcional={t.cadastro.opcional} id="linkVideo" rotulo={t.cadastro.video} erro={erros.linkVideo} dica={t.cadastro.videoDica} opcional>
            <input {...aria("linkVideo", true)} type="url" inputMode="url" placeholder="https://" value={campos.linkVideo ?? ""} onChange={(e) => alterar("linkVideo", e.target.value)} />
          </Campo>
          <Campo textoOpcional={t.cadastro.opcional} id="mensagem" rotulo={t.cadastro.mensagem} erro={erros.mensagem} opcional largo>
            <textarea {...aria("mensagem")} rows={4} maxLength={600} value={campos.mensagem ?? ""} onChange={(e) => alterar("mensagem", e.target.value)} />
          </Campo>
        </div>
      </fieldset>

      {menor && (
        <fieldset className="cadastro__responsavel">
          <legend>{t.cadastro.responsavel}</legend>
          <p className="cadastro__aviso">{t.cadastro.responsavelAviso}</p>
          <div className="campos">
            <Campo textoOpcional={t.cadastro.opcional} id="responsavelNome" rotulo={t.cadastro.responsavelNome} erro={erros.responsavelNome} largo>
              <input {...aria("responsavelNome")} type="text" value={campos.responsavelNome ?? ""} onChange={(e) => alterar("responsavelNome", e.target.value)} />
            </Campo>
          </div>
          <label className={`marcar${erros.autorizacaoResponsavel ? " marcar--erro" : ""}`}>
            <input
              {...aria("autorizacaoResponsavel")}
              type="checkbox"
              checked={campos.autorizacaoResponsavel}
              onChange={(e) => alterar("autorizacaoResponsavel", e.target.checked)}
            />
            <span>{t.cadastro.responsavelAutoriza}</span>
          </label>
          {erros.autorizacaoResponsavel && (
            <p id="autorizacaoResponsavel-erro" className="campo__mensagem-erro">
              {erros.autorizacaoResponsavel}
            </p>
          )}
        </fieldset>
      )}

      <label className={`marcar${erros.consentimento ? " marcar--erro" : ""}`}>
        <input {...aria("consentimento")} type="checkbox" checked={campos.consentimento} onChange={(e) => alterar("consentimento", e.target.checked)} />
        <span>
          {t.cadastro.consentimentoA}
          {t.cadastro.consentimentoA.endsWith("'") ? "" : " "}
          <LinkIdioma href="/privacidade" target="_blank">
            {t.cadastro.consentimentoLink}
          </LinkIdioma>
          {t.cadastro.consentimentoB}
        </span>
      </label>
      {erros.consentimento && (
        <p id="consentimento-erro" className="campo__mensagem-erro">
          {erros.consentimento}
        </p>
      )}

      <div className="cadastro__enviar">
        <button type="submit" className="btn btn--primario btn--seta btn--brilho">
          {t.cadastro.enviar}
          <Icone nome="conversa" className="btn__seta" />
        </button>
        <p className="campo__dica">{t.cadastro.enviarDica}</p>
      </div>
    </form>
  );
}
