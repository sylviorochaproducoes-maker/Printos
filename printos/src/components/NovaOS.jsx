import { useState, useRef } from "react";
import { MODELOS, GOLAS, MANGAS, ESTAMPAS, somarTam, novoId, getTamList } from "../utils/helpers";

function Toggle({ opcoes, valor, onChange, pequeno }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opcoes.map(o => (
        <button key={o} onClick={() => onChange(o)}
          type="button"
          className={`${pequeno ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"} rounded-lg font-medium border transition-all ${
            valor === o
              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200"
              : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50"
          }`}
        >{o}</button>
      ))}
    </div>
  );
}

function Secao({ titulo, children }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{titulo}</p>
      {children}
    </div>
  );
}

export default function NovaOS({ usuario, oss, setOss, onFim, clientes, usuarios = [] }) {
  const fileRef = useRef();
  const [salvo, setSalvo] = useState(false);
  const [form, setForm] = useState({
    companyId: usuario.companyId,
    clienteId: "",
    clienteNome: "",
    colaboradorId: "",
    colaboradorNome: "",
    descricao: "",
    modelo: "Tradicional",
    gola: "Redonda",
    manga: "Manga Curta – Tradicional",
    estampa: "Local",
    cor: "#FFFFFF",
    tamanhos: {},
    obs: "",
    status: "Aguardando Arte",
    imgs: [],
  });

  // Filtrar clientes da mesma confecção
  const clientesEmpresa = clientes.filter(c => c.companyId === usuario.companyId);

  // Filtrar colaboradores da mesma confecção
  const colaboradoresEmpresa = usuarios.filter(
    u => u.papel === "colaborador" && (u.companyIds && u.companyIds.includes(usuario.companyId))
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setModelo = m => setForm(f => ({ ...f, modelo: m, tamanhos: {} }));
  const setTam = (t, v) => setForm(f => ({ ...f, tamanhos: { ...f.tamanhos, [t]: Math.max(0, parseInt(v) || 0) } }));

  const handleFiles = e => {
    Array.from(e.target.files).forEach(file => {
      const r = new FileReader();
      r.onload = ev => setForm(f => ({ ...f, imgs: [...f.imgs, { nome: file.name, url: ev.target.result }] }));
      r.readAsDataURL(file);
    });
  };

  const remImg = i => setForm(f => ({ ...f, imgs: f.imgs.filter((_, idx) => idx !== i) }));

  const setCliente = id => {
    const c = clientesEmpresa.find(c => c.id === +id);
    if (c) setForm(f => ({ ...f, clienteId: c.id, clienteNome: c.nome }));
  };

  const setColaborador = id => {
    if (!id) {
      setForm(f => ({ ...f, colaboradorId: "", colaboradorNome: "" }));
      return;
    }
    const c = colaboradoresEmpresa.find(colab => colab.id === +id);
    if (c) setForm(f => ({ ...f, colaboradorId: c.id, colaboradorNome: c.nome }));
  };

  const criar = () => {
    if (!form.clienteId || !form.descricao.trim()) return;
    setOss(prev => [{ ...form, id: novoId(prev), criado: new Date().toISOString().split("T")[0] }, ...prev]);
    setSalvo(true);
    setTimeout(() => { setSalvo(false); onFim(); }, 1600);
  };

  const tamList = getTamList(form.modelo);
  const total   = somarTam(form.tamanhos);
  const valido  = form.clienteId && form.descricao.trim();

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-black text-gray-900">Nova Ordem de Serviço</h1>
        <p className="text-sm text-gray-400 mt-0.5">Preencha todos os dados da produção</p>
      </div>

      <div className="p-6">
        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-7">

            <Secao titulo="Identificação">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Cliente *</label>
                  <select value={form.clienteId} onChange={e => setCliente(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="">Selecionar cliente…</option>
                    {clientesEmpresa.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Colaborador Responsável</label>
                  <select value={form.colaboradorId} onChange={e => setColaborador(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="">Não atribuído</option>
                    {colaboradoresEmpresa.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Descrição do pedido *</label>
                  <input value={form.descricao} onChange={e => set("descricao", e.target.value)}
                    placeholder="Ex: Uniforme empresa XYZ"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
            </Secao>

            <Secao titulo="Modelo de Camiseta">
              <Toggle opcoes={MODELOS} valor={form.modelo} onChange={setModelo} />
            </Secao>

            <Secao titulo="Tipo de Gola">
              <Toggle opcoes={GOLAS} valor={form.gola} onChange={v => set("gola", v)} />
            </Secao>

            <Secao titulo="Tipo de Manga">
              <Toggle opcoes={MANGAS} valor={form.manga} onChange={v => set("manga", v)} pequeno />
            </Secao>

            <div className="grid grid-cols-2 gap-6">
              <Secao titulo="Tipo de Estampa">
                <Toggle opcoes={ESTAMPAS} valor={form.estampa} onChange={v => set("estampa", v)} />
              </Secao>
              <Secao titulo="Cor Base da Camiseta">
                <div className="flex items-center gap-3">
                  <input type="color" value={form.cor} onChange={e => set("cor", e.target.value)}
                    className="w-12 h-11 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-transparent" />
                  <input type="text" value={form.cor} onChange={e => set("cor", e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </Secao>
            </div>

            <Secao titulo={`Tamanhos / Quantidades${total > 0 ? ` — Total: ${total} peças` : ""}`}>
              <div className="grid grid-cols-5 gap-2">
                {tamList.map(t => (
                  <div key={t} className="text-center">
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">{t}</label>
                    <input type="number" min={0} value={form.tamanhos[t] || ""} onChange={e => setTam(t, e.target.value)}
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-xl px-1 py-2.5 text-sm text-center bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                ))}
              </div>
            </Secao>

            <Secao titulo="Observações">
              <textarea value={form.obs} onChange={e => set("obs", e.target.value)} rows={3}
                placeholder="Posicionamento da estampa, cores específicas, numeração, detalhes especiais…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
            </Secao>

            <Secao titulo="Artes / Logos (upload)">
              <div onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-7 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group">
                <div className="text-4xl mb-2.5">🖼️</div>
                <p className="text-sm font-semibold text-gray-500 group-hover:text-indigo-600">Clique para enviar imagens</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG — múltiplos arquivos permitidos</p>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              </div>

              {form.imgs.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {form.imgs.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <img src={img.url} alt={img.nome} className="w-full h-full object-cover" />
                      </div>
                      <button onClick={() => remImg(i)}
                        type="button"
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-md">✕</button>
                      <p className="text-[9px] text-gray-400 mt-1 truncate">{img.nome}</p>
                    </div>
                  ))}
                </div>
              )}
            </Secao>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button onClick={onFim}
                type="button"
                className="px-5 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button onClick={criar} disabled={!valido || salvo}
                type="button"
                className={`px-7 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
                  salvo
                    ? "bg-emerald-500 text-white shadow-emerald-200"
                    : "bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-indigo-200"
                }`}>
                {salvo ? "✓ OS Criada com Sucesso!" : "Criar Ordem de Serviço"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
