import { somarTam, fmtData } from "../utils/helpers";
import Badge from "./Badge";
import BarraProgresso from "./BarraProgresso";

export default function MeusPedidos({ usuario, oss, onSelect }) {
  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-black text-gray-900">Meus Pedidos</h1>
        <p className="text-sm text-gray-400 mt-0.5">Acompanhe o andamento em tempo real</p>
      </div>
      <div className="p-6 space-y-4">
        {oss.length === 0
          ? <div className="text-center py-20 text-gray-400"><div className="text-5xl mb-3">📭</div><p className="text-sm">Nenhum pedido encontrado.</p></div>
          : oss.map(o => (
            <div key={o.id} onClick={() => onSelect(o)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-indigo-700 text-base">{o.id}</span>
                    <Badge status={o.status} />
                  </div>
                  <h3 className="font-bold text-gray-800">{o.descricao}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{o.modelo} · {o.gola} · {o.manga}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{fmtData(o.criado)}</p>
                  <p className="text-2xl font-black text-gray-700 mt-1">{somarTam(o.tamanhos)}<span className="text-xs font-normal text-gray-400 ml-1">pçs</span></p>
                </div>
              </div>
              <BarraProgresso status={o.status} />
            </div>
          ))
        }
      </div>
    </div>
  );
}
