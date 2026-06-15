import { useState, useEffect } from "react";
import { STATUS_FLUXO, somarTam, fmtData } from "../utils/helpers";
import Badge from "./Badge";
import BarraProgresso from "./BarraProgresso";

export default function ModalOS({ os, usuario, fechar, atualizar, usuarios = [] }) {
  const [status, setStatus] = useState(os.status);
  const [colaboradorId, setColaboradorId] = useState(os.colaboradorId || "");
  const [salvo, setSalvo] = useState(false);

  const podeEditar = usuario.papel !== "cliente";
  const eConfeccao = usuario.papel === "confeccao";

  // Sincroniza o estado local quando a OS muda
  useEffect(() => {
    setStatus(os.status);
    setColaboradorId(os.colaboradorId || "");
  }, [os]);

  // Filtrar colaboradores da mesma confecção
  const colaboradoresEmpresa = usuarios.filter(
    u => u.papel === "colaborador" && (u.companyIds && u.companyIds.includes(usuario.companyId))
  );

  const salvar = () => {
    let colabNome = os.colaboradorNome || "";
    if (colaboradorId) {
      const colabObj = colaboradoresEmpresa.find(c => c.id === +colaboradorId);
      if (colabObj) colabNome = colabObj.nome;
    } else {
      colabNome = "";
    }

    const upd = {
      ...os,
      status,
      colaboradorId: colaboradorId ? +colaboradorId : "",
      colaboradorNome: colabNome
    };

    atualizar(upd);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 1800);
  };

  const statusAlterado = status !== os.status;
  const colabAlterado = eConfeccao && (+colaboradorId !== +(os.colaboradorId || 0));

  const pares = Object.entries(os.tamanhos || {}).filter(([, v]) => +v > 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-lg font-black text-indigo-700">{os.id}</span>
              <Badge status={os.status} />
            </div>
            <p className="text-sm text-gray-500">{os.descricao}</p>
          </div>
          <button onClick={fechar} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition font-medium text-sm">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {podeEditar && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">Atualizar Status</p>
                  <select value={status} onChange={e => setStatus(e.target.value)}
                    className="w-full border border-indigo-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 font-medium">
                    {STATUS_FLUXO.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {eConfeccao && (
                  <div>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">Colaborador Responsável</p>
                    <select value={colaboradorId} onChange={e => setColaboradorId(e.target.value)}
                      className="w-full border border-indigo-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 font-medium">
                      <option value="">Não atribuído</option>
                      {colaboradoresEmpresa.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-1">
                <button onClick={salvar} disabled={!statusAlterado && !colabAlterado && !salvo}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${salvo ? "bg-emerald-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-md shadow-indigo-200"}`}>
                  {salvo ? "✓ Salvo com sucesso!" : "Salvar Alterações"}
                </button>
              </div>
            </div>
          )}

          <BarraProgresso status={os.status} />

          <div className="grid grid-cols-2 gap-4">
            {[
              usuario.papel !== "cliente" && ["Cliente", os.clienteNome],
              ["Data do Pedido", fmtData(os.criado)],
              ["Modelo", os.modelo],
              ["Gola", os.gola],
              ["Manga", os.manga],
              ["Estampa", os.estampa],
              ["Responsável", os.colaboradorNome || "Não atribuído"]
            ].filter(Boolean).map(([k, v]) => (
              <div key={k} className="space-y-0.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{k}</p>
                <p className="text-sm font-semibold text-gray-800">{v}</p>
              </div>
            ))}
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cor Base</p>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border-2 border-white shadow-md" style={{ background: os.cor }} />
                <span className="text-sm font-mono font-semibold text-gray-700">{os.cor}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Tamanhos / Quantidades</p>
            <div className="flex flex-wrap gap-2">
              {pares.map(([t, q]) => (
                <div key={t} className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-center min-w-[52px]">
                  <p className="text-[9px] font-bold text-indigo-400 uppercase">{t}</p>
                  <p className="text-xl font-black text-indigo-800">{q}</p>
                </div>
              ))}
              <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-center min-w-[52px]">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Total</p>
                <p className="text-xl font-black text-slate-700">{somarTam(os.tamanhos)}</p>
              </div>
            </div>
          </div>

          {os.obs && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Observações</p>
              <p className="text-sm text-gray-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">{os.obs}</p>
            </div>
          )}

          {os.imgs?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Artes / Logos ({os.imgs.length})</p>
              <div className="grid grid-cols-3 gap-2">
                {os.imgs.map((img, i) => (
                  <div key={i} className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <img src={img.url} alt={img.nome} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
