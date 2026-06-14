import { useState } from "react";

export default function SuperAdmin({ empresas = [], usuarios = [], onAddCompany, onAddUser }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [adminNome, setAdminNome] = useState("");
  const [adminLogin, setAdminLogin] = useState("");
  const [adminSenha, setAdminSenha] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const totalEmpresas = empresas.length;
  const totalUsuarios = usuarios.length;
  const totalConfeccoes = usuarios.filter(u => u.papel === "confeccao").length;

  const cadastrarEmpresa = () => {
    if (!nome.trim() || !email.trim() || !adminNome.trim() || !adminLogin.trim() || !adminSenha.trim()) return;

    // Gerar novo ID de empresa
    const proximoEmpresaId = empresas.reduce((max, e) => Math.max(max, e.id), 0) + 1;
    const novaEmpresa = {
      id: proximoEmpresaId,
      nome: nome.trim(),
      email: email.trim(),
      status: "Ativo",
      criado: new Date().toISOString().split("T")[0]
    };

    // Gerar novo ID de usuário
    const proximoUsuarioId = usuarios.reduce((max, u) => Math.max(max, typeof u.id === "number" ? u.id : 0), 0) + 1;
    const novoUsuario = {
      id: proximoUsuarioId,
      login: adminLogin.trim().toLowerCase(),
      senha: adminSenha.trim(),
      papel: "confeccao",
      nome: adminNome.trim(),
      companyId: proximoEmpresaId
    };

    onAddCompany(novaEmpresa);
    onAddUser(novoUsuario);

    setSalvo(true);
    setTimeout(() => {
      setSalvo(false);
      setMostrarForm(false);
      // Resetar form
      setNome("");
      setEmail("");
      setAdminNome("");
      setAdminLogin("");
      setAdminSenha("");
    }, 1500);
  };

  const formValido = nome.trim() && email.trim() && adminNome.trim() && adminLogin.trim() && adminSenha.trim();

  return (
    <div>
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-gray-900">Portal do Super Admin</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gerenciamento de Empresas Parceiras (SaaS)</p>
        </div>
        {!mostrarForm && (
          <button
            onClick={() => setMostrarForm(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-200 transition-all"
          >
            🏢 Cadastrar Nova Empresa
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-rose-500 to-rose-700 rounded-2xl p-5 text-white shadow-md">
            <div className="text-3xl mb-3">🏢</div>
            <div className="text-4xl font-black">{totalEmpresas}</div>
            <div className="text-sm opacity-80 mt-1">Total de Empresas</div>
          </div>
          <div className="bg-gradient-to-br from-violet-500 to-violet-700 rounded-2xl p-5 text-white shadow-md">
            <div className="text-3xl mb-3">👑</div>
            <div className="text-4xl font-black">{totalConfeccoes}</div>
            <div className="text-sm opacity-80 mt-1">Administradores de Confecções</div>
          </div>
          <div className="bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl p-5 text-white shadow-md">
            <div className="text-3xl mb-3">👥</div>
            <div className="text-4xl font-black">{totalUsuarios}</div>
            <div className="text-sm opacity-80 mt-1">Usuários na Plataforma</div>
          </div>
        </div>

        {/* Cadastro Form Modal/Panel */}
        {mostrarForm && (
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 space-y-6 max-w-2xl animate-in slide-in-from-top duration-300">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-base">🏢 Nova Empresa & Administrador</h3>
              <button
                onClick={() => setMostrarForm(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                Cancelar
              </button>
            </div>

            {/* Seção Empresa */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">1. Dados da Empresa</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Nome da Confecção *</label>
                  <input
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    placeholder="Ex: Alfaiataria Express"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">E-mail de Contato *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Ex: contato@express.com"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>
            </div>

            {/* Seção Administrador */}
            <div className="space-y-4 pt-2">
              <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">2. Conta do Administrador da Confecção</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Nome Completo *</label>
                  <input
                    value={adminNome}
                    onChange={e => setAdminNome(e.target.value)}
                    placeholder="Ex: Carlos Oliveira"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Login de Acesso *</label>
                  <input
                    value={adminLogin}
                    onChange={e => setAdminLogin(e.target.value)}
                    placeholder="Ex: carlos.admin"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Senha Inicial *</label>
                  <input
                    type="password"
                    value={adminSenha}
                    onChange={e => setAdminSenha(e.target.value)}
                    placeholder="Sua senha"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={() => setMostrarForm(false)}
                className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
              >
                Fechar
              </button>
              <button
                onClick={cadastrarEmpresa}
                disabled={!formValido || salvo}
                className={`px-6 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-md ${
                  salvo
                    ? "bg-emerald-500 shadow-emerald-100"
                    : "bg-rose-600 hover:bg-rose-700 disabled:opacity-40 shadow-rose-200"
                }`}
              >
                {salvo ? "✓ Cadastrado!" : "Cadastrar Empresa"}
              </button>
            </div>
          </div>
        )}

        {/* Lista de Empresas */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Empresas Cadastradas</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <tr>
                  <th className="text-left px-5 py-3">ID</th>
                  <th className="text-left px-5 py-3">Nome da Confecção</th>
                  <th className="text-left px-5 py-3">E-mail de Contato</th>
                  <th className="text-left px-5 py-3">Membros</th>
                  <th className="text-left px-5 py-3">Data de Adesão</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {empresas.map(e => {
                  const membros = usuarios.filter(u => u.companyId === e.id).length;
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/55 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-gray-400">#{e.id}</td>
                      <td className="px-5 py-4 font-bold text-gray-800">{e.nome}</td>
                      <td className="px-5 py-4 text-gray-500">{e.email}</td>
                      <td className="px-5 py-4 text-gray-600 font-semibold">{membros}</td>
                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {e.criado.split("-").reverse().join("/")}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-100 text-emerald-800 border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
