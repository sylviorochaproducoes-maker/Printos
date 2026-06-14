function PapelTag({ papel }) {
  const m = {
    superadmin:  ["Super Admin", "bg-rose-950/40 text-rose-400 border-rose-900/50"],
    confeccao:   ["Confecção Admin", "bg-violet-950/40 text-violet-400 border-violet-900/50"],
    colaborador: ["Colaborador", "bg-teal-950/40 text-teal-400 border-teal-900/50"],
    cliente:     ["Cliente", "bg-sky-950/40 text-sky-400 border-sky-900/50"],
  };
  const [l, c] = m[papel] || [papel, "bg-slate-900 text-slate-400 border-slate-800"];
  return <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${c}`}>{l}</span>;
}

export default function Sidebar({ usuario, aba, setAba, sair, empresas = [] }) {
  const obterNomeEmpresa = () => {
    if (usuario.papel === "superadmin") return "Portal PrintOS";
    if (!usuario.companyId) return "Portal Confecção";
    const emp = empresas.find(e => e.id === usuario.companyId);
    return emp ? emp.nome : "Minha Confecção";
  };

  const nav = {
    superadmin:  [["empresas", "🏢", "Empresas"]],
    confeccao:   [
      ["dashboard", "📊", "Dashboard"],
      ["oss", "📋", "Todas as OSs"],
      ["nova", "➕", "Nova OS"],
      ["colaboradores", "👷", "Colaboradores"],
      ["clientes", "👥", "Clientes"]
    ],
    colaborador: [["oss", "📋", "Ordens de Serviço"]],
    cliente:     [["meus", "🛍️", "Meus Pedidos"]],
  }[usuario.papel] || [];

  return (
    <aside className="w-56 bg-slate-950 text-white flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-900 shadow-xl">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl animate-pulse">👕</span>
          <div>
            <p className="font-black text-sm tracking-tight text-white">PrintOS</p>
            <p className="text-[10px] text-slate-500 font-medium">Confecção & Estampagem</p>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="px-5 py-3.5 border-b border-white/5 bg-white/[0.01] space-y-1.5">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Conectado em</p>
        <p className="text-sm font-semibold truncate text-slate-200" title={usuario.nome}>
          {usuario.nome}
        </p>
        <p className="text-[11px] text-slate-400 font-medium truncate" title={obterNomeEmpresa()}>
          {obterNomeEmpresa()}
        </p>
        <div className="pt-0.5">
          <PapelTag papel={usuario.papel} />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(([id, icon, label]) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              aba === id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/60 font-semibold"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      {/* Sign Out Button */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={sair}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-950/40 hover:text-red-400 transition-all font-medium"
        >
          <span>🚪</span>Sair
        </button>
      </div>
    </aside>
  );
}
