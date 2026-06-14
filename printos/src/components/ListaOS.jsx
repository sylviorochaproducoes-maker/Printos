import { useState } from "react";
import { STATUS_FLUXO, somarTam, fmtData } from "../utils/helpers";
import Badge from "./Badge";

export default function ListaOS({ usuario, oss, onSelect }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  const vis = oss.filter(o => {
    const fs = filtro === "Todos" || o.status === filtro;
    const fq = !busca || [o.id, o.clienteNome, o.descricao].some(v => v.toLowerCase().includes(busca.toLowerCase()));
    return fs && fq;
  });

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-black text-gray-900">
          {usuario.papel === "colaborador" ? "Ordens de Serviço" : "Todas as OSs"}
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">{vis.length} resultado{vis.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <input value={busca} onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por OS, cliente, descrição…"
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <div className="flex gap-1 flex-wrap">
            {["Todos", ...STATUS_FLUXO].map(s => (
              <button key={s} onClick={() => setFiltro(s)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filtro === s ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
              <tr>
                <th className="text-left px-4 py-3">OS</th>
                {usuario.papel !== "cliente" && <th className="text-left px-4 py-3">Cliente</th>}
                <th className="text-left px-4 py-3">Descrição</th>
                <th className="text-left px-4 py-3">Modelo</th>
                <th className="text-left px-4 py-3">Peças</th>
                <th className="text-left px-4 py-3">Data</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vis.length === 0
                ? <tr><td colSpan={8} className="text-center py-14 text-gray-400">Nenhuma OS encontrada</td></tr>
                : vis.map(o => (
                  <tr key={o.id} onClick={() => onSelect(o)}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer">
                    <td className="px-4 py-3.5 font-bold text-indigo-700">{o.id}</td>
                    {usuario.papel !== "cliente" && <td className="px-4 py-3.5 text-gray-700 font-medium">{o.clienteNome}</td>}
                    <td className="px-4 py-3.5 text-gray-500 max-w-[180px] truncate">{o.descricao}</td>
                    <td className="px-4 py-3.5 text-gray-600">{o.modelo}</td>
                    <td className="px-4 py-3.5 text-gray-600 font-semibold">{somarTam(o.tamanhos)}</td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs">{fmtData(o.criado)}</td>
                    <td className="px-4 py-3.5"><Badge status={o.status} /></td>
                    <td className="px-4 py-3.5 text-right text-xs font-semibold text-indigo-500 hover:text-indigo-700">Ver →</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
