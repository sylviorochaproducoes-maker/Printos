import { useState } from "react";

export default function Colaboradores({ usuario, usuarios = [], onAddUser }) {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvo, setSalvo] = useState(false);

  // Filtrar colaboradores da empresa atual
  const colaboradores = usuarios.filter(
    (u) => u.companyId === usuario.companyId && u.papel === "colaborador"
  );

  const cadastrarColaborador = () => {
    if (!nome.trim() || !login.trim() || !senha.trim()) return;

    // Gerar novo ID de usuário
    const proximoId = usuarios.reduce((max, u) => Math.max(max, typeof u.id === "number" ? u.id : 0), 0) + 1;
    const novoColaborador = {
      id: proximoId,
      login: login.trim().toLowerCase(),
      senha: senha.trim(),
      papel: "colaborador",
      nome: nome.trim(),
      companyId: usuario.companyId
    };

    onAddUser(novoColaborador);

    setSalvo(true);
    setTimeout(() => {
      setSalvo(false);
      setMostrarForm(false);
      setNome("");
      setLogin("");
      setSenha("");
    }, 1500);
  };

  const formValido = nome.trim() && login.trim() && senha.trim();

  return (
    <div>
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-gray-900">Colaboradores</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestão de equipe da confecção</p>
        </div>
        {!mostrarForm && (
          <button
            onClick={() => setMostrarForm(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all"
          >
            👷 Adicionar Colaborador
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Form para Adicionar */}
        {mostrarForm && (
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6 space-y-5 max-w-xl animate-in slide-in-from-top duration-300">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-base">👷 Novo Colaborador</h3>
              <button
                onClick={() => setMostrarForm(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                Cancelar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-xs text-gray-500 block mb-1.5">Nome Completo *</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Pedro Santos"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">Usuário/Login *</label>
                <input
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Ex: pedro.santos"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">Senha de Acesso *</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={() => setMostrarForm(false)}
                className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
              >
                Fechar
              </button>
              <button
                onClick={cadastrarColaborador}
                disabled={!formValido || salvo}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md ${
                  salvo
                    ? "bg-emerald-500 shadow-emerald-100"
                    : "bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 shadow-indigo-200"
                }`}
              >
                {salvo ? "✓ Adicionado!" : "Adicionar Membro"}
              </button>
            </div>
          </div>
        )}

        {/* Lista de Colaboradores */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Sua Equipe ({colaboradores.length})
          </p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-3xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <tr>
                  <th className="text-left px-5 py-3">#</th>
                  <th className="text-left px-5 py-3">Nome</th>
                  <th className="text-left px-5 py-3">Usuário/Login</th>
                  <th className="text-left px-5 py-3">Senha (Acesso Rápido)</th>
                  <th className="text-left px-5 py-3">Papel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {colaboradores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400">
                      Nenhum colaborador cadastrado.
                    </td>
                  </tr>
                ) : (
                  colaboradores.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-gray-400">#{c.id}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-800">{c.nome}</td>
                      <td className="px-5 py-3.5 text-gray-500 font-semibold">{c.login}</td>
                      <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{c.senha}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-700">
                          Colaborador
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
