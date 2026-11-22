import { salvarDadosAtleta } from "@/app/(admin)/admin/atletas/acoes";
import type { DadosAtleta } from "@/services/atleta.service";
import { MODALIDADES } from "@/validations/atleta.schema";

/**
 * Dados do atleta no painel. Todo campo pode ficar em branco: no perfil público ele aparece
 * como "não compartilhado". Posição e categoria aceitam texto livre, com sugestões
 * (as sugeridas já têm tradução e sigla no site).
 */

const POSICOES = ["Goleiro", "Fixo", "Ala", "Pivô", "Zagueiro", "Lateral", "Volante", "Meio-campo", "Atacante"];
const CATEGORIAS = ["Profissional", "Sub-20", "Sub-17", "Sub-15", "Sub-13"];

export function FormEditarAtleta({ atleta }: { atleta: DadosAtleta }) {
  const texto = (v?: string | number) => (v === undefined ? "" : String(v));

  return (
    <form action={salvarDadosAtleta} className="admin-form">
      <input type="hidden" name="slug" value={atleta.slug} />
      <fieldset>
        <legend>Dados do atleta</legend>
        <div className="admin-grade">
          <div className="campo">
            <label htmlFor="nome">Nome</label>
            <input id="nome" name="nome" required maxLength={80} defaultValue={atleta.nome} />
          </div>
          <div className="campo">
            <label htmlFor="clube">Clube</label>
            <input id="clube" name="clube" required maxLength={80} defaultValue={atleta.clube} />
          </div>
          <div className="campo">
            <label htmlFor="esporte">Esporte</label>
            <select id="esporte" name="esporte" defaultValue={texto(atleta.esporte)}>
              <option value="">Não compartilhado</option>
              {MODALIDADES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="posicao">Posição</label>
            <input id="posicao" name="posicao" list="posicoes" maxLength={60} defaultValue={texto(atleta.posicao)} placeholder="Ex.: Ala" />
            <datalist id="posicoes">
              {POSICOES.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>
          <div className="campo">
            <label htmlFor="categoria">Categoria</label>
            <input id="categoria" name="categoria" list="categorias" maxLength={40} defaultValue={texto(atleta.categoria)} placeholder="Ex.: Profissional" />
            <datalist id="categorias">
              {CATEGORIAS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="campo">
            <label htmlFor="numero">Camisa</label>
            <input id="numero" name="numero" type="number" inputMode="numeric" min={0} max={999} defaultValue={texto(atleta.numero)} />
          </div>
          <div className="campo">
            <label htmlFor="alturaCm">Altura (cm)</label>
            <input id="alturaCm" name="alturaCm" type="number" inputMode="numeric" min={100} max={250} defaultValue={texto(atleta.alturaCm)} placeholder="Ex.: 178" />
          </div>
          <div className="campo">
            <label htmlFor="pesoKg">Peso (kg)</label>
            <input id="pesoKg" name="pesoKg" type="number" inputMode="numeric" min={30} max={200} defaultValue={texto(atleta.pesoKg)} />
          </div>
          <div className="campo">
            <label htmlFor="pe">Pé dominante</label>
            <select id="pe" name="pe" defaultValue={texto(atleta.pe)}>
              <option value="">Não compartilhado</option>
              <option value="Direito">Direito</option>
              <option value="Esquerdo">Esquerdo</option>
              <option value="Ambidestro">Ambidestro</option>
            </select>
          </div>
          <div className="campo">
            <label htmlFor="nacionalidade">Nacionalidade</label>
            <input id="nacionalidade" name="nacionalidade" list="nacionalidades" maxLength={40} defaultValue={texto(atleta.nacionalidade)} placeholder="Ex.: Brasileira" />
            <datalist id="nacionalidades">
              <option value="Brasileira" />
            </datalist>
          </div>
          <div className="campo">
            <label htmlFor="pais">País no card (sigla)</label>
            <input id="pais" name="pais" maxLength={3} pattern="[A-Za-z]{3}" defaultValue={texto(atleta.pais)} placeholder="BRA" autoCapitalize="characters" />
          </div>
        </div>
        <div className="campo admin-form__largo">
          <label htmlFor="bio">Apresentação</label>
          <textarea id="bio" name="bio" rows={4} maxLength={600} defaultValue={texto(atleta.bio)} placeholder="Estilo de jogo, trajetória, conquistas..." />
        </div>
        <label className="admin-check">
          <input type="checkbox" name="publicado" defaultChecked={atleta.publicado} />
          Publicado no site (desmarque para esconder o atleta das páginas públicas)
        </label>
        <p className="campo__dica">Campos em branco aparecem no perfil público como “Não compartilhado”.</p>
      </fieldset>
      <button type="submit" className="btn btn--primario">
        Salvar dados
      </button>
    </form>
  );
}
