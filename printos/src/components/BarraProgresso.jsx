import { STATUS_FLUXO } from "../utils/helpers";

export default function BarraProgresso({ status }) {
  const idx = STATUS_FLUXO.indexOf(status);
  return (
    <div>
      <div className="flex justify-between mb-1.5 gap-1">
        {STATUS_FLUXO.map((s, i) => (
          <span key={s} className={`text-[9px] font-semibold leading-tight text-center flex-1 ${i <= idx ? "text-indigo-600" : "text-gray-300"}`}>
            {s.replace("Aguardando", "Ag.").replace("Aprovada", "Aprov.")}
          </span>
        ))}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${((idx + 1) / STATUS_FLUXO.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
