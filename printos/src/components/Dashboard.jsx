import { somarTam, fmtData } from "../utils/helpers";
import Badge from "./Badge";

export default function Dashboard({ oss }) {
  const stats = [
    { l: "Total de OSs",    v: oss.length,                                      icon: "📋", g: "from-indigo-500 to-indigo-700"  },
    { l: "Aguardando Arte", v: oss.filter(o => o.status === "Aguardando Arte").length, icon: "⏳", g: "from-amber-500 to-amber-700"   },
    { l: "Em Produção",     v: oss.filter(o => o.status === "Em Produção").length,     icon: "🔄", g: "from-orange-500 to-orange-700" },
    { l: "Finalizado",      v: oss.filter(o => o.status === "Finalizado").length,      icon: "✅", g: "from-emerald-500 to-emerald-700"},
    { l: "Entregue",        v: oss.filter(o => o.status === "Entregue").length,        icon: "🚚", g: "from-slate-600 to-slate-800"   },
    { l: "Total de Peças",  v: oss.reduce((s, o) => s + somarTam(o.tamanhos), 0),     icon: "👕", g: "from-violet-500 to-violet-700" },
  ];

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-black text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Visão geral da produção</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.map(c => (
            <div key={c.l} className={`bg-gradient-to-br ${c.g} rounded-2xl p-5 text-white shadow-md`}>
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="text-4xl font-black">{c.v}</div>
              <div className="text-sm opacity-80 mt-1">{c.l}</div>
            </div>
          ))}
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ordens Recentes</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
            {oss.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div>
                  <span className="text-sm font-bold text-indigo-700">{o.id}</span>
                  <span className="mx-2 text-gray-200 text-xs">•</span>
                  <span className="text-sm text-gray-700 font-medium">{o.clienteNome}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{o.descricao}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">{fmtData(o.criado)}</span>
                  <Badge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
