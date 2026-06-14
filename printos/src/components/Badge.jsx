import { STATUS_COR } from "../utils/helpers";

export default function Badge({ status }) {
  const c = STATUS_COR[status] || { pil: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.pil}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
