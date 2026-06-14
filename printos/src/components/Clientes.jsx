import { useState } from "react";

export default function Clientes({ usuario, clientes = [], usuarios = [], onAddClient, onAddUser }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [fone, setFone] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvo, setSalvo] = useState(false);

  // Filtrar clientes da mesma confecção
  const clientesFiltrados = clientes.filter(c => c.companyId === usuario.companyId);

  const cadastrarCliente = () => {
    if (!nome.trim() || !email.trim() || !fone.trim() || !login.trim() || !senha.trim()) return;

    // Gerar novo ID de cliente
    const proximoClienteId = clientes.reduce((max, c) => Math.max(max, c.id), 0) + 1;
    const novoCliente = {
      id: proximoClienteId,
      companyId: usuario.companyId,
      nome: nome.trim(),
      email: email.trim(),
      fone: fone.trim()
    };

    // Gerar novo ID de usuário para o cliente acessar
    const proximoUsuarioId = usuarios.reduce((max, u) => Math.max(max, typeof u.id === "number" ? u.id : 0), 0) + 1;
    const novoUsuario = {
      id: proximoUsuarioId,
      login: login.trim().toLowerCase(),
      senha: senha.trim(),
      papel: "cliente",
      nome: nome.trim(),
      clienteId: proximoClienteId,
      companyId: usuario.companyId
    };

    onAddClient(novoCliente);
    onAddUser(novoUsuario);

    setSalvo(true);
    setTimeout(() => {
      setSalvo(false);
      setMostrarForm(false);
      setNome("");
      setEmail("");
      setFone("");
      setLogin("");
      setSenha("");
    }, 1500);
  };

  const formValido = nome.trim() && email.trim() && fone.trim() && login.trim() && senha.trim();

  return (
    <div>
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestão de carteira de clientes</p>
        </div>
        {!mostrarForm && (
          <button
            onClick={() => setMostrarForm(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all"
          >
            👥 Adicionar Cliente
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Form Cadastro Cliente */}
        {mostrarForm && (
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6 space-y-5 max-w-2xl animate-in slide-in-from-top duration-300">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-base">👥 Novo Cliente & Acesso</h3>
              <button
                onClick={() => setMostrarForm(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                Cancelar
              </button>
            </div>

            {/* Dados Contato */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">1. Informações de Contato</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Nome Completo *</label>
                  <input value={nome} onChange={e => setNome(e.target.value)}
                    placeholder="Ex: Maria Souza"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">E-mail *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Ex: maria@email.com"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Telefone *</label>
                  <input value={fone} onChange={e => setFone(e.target.value)}
                    placeholder="Ex: (11) 98888-1111"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
            </div>

            {/* Conta do Cliente */}
            <div className="space-y-4 pt-2">
              <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">2. Credenciais de Acesso do Cliente</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Usuário/Login *</label>
                  <input value={login} onChange={e => setLogin(e.target.value)}
                    placeholder="Ex: maria"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Senha de Acesso *</label>
                  <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
                    placeholder="••••••"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
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
                onClick={cadastrarCliente}
                disabled={!formValido || salvo}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md ${
                  salvo
                    ? "bg-emerald-500 shadow-emerald-100"
                    : "bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 shadow-indigo-200"
                }`}
              >
                {salvo ? "✓ Adicionado!" : "Cadastrar Cliente"}
              </button>
            </div>
          </div>
        )}

        {/* Lista de Clientes */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Seus Clientes ({clientesFiltrados.length})
          </p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-3xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3">#</th>
                  <th className="text-left px-4 py-3">Nome</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Telefone</th>
                  <th className="text-left px-4 py-3">Usuário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400">
                      Nenhum cliente cadastrado.
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map(c => {
                    const usr = usuarios.find(u => u.clienteId === c.id && u.papel === "cliente");
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3.5 text-gray-400 font-mono text-xs">{c.id}</td>
                        <td className="px-4 py-3.5 font-bold text-gray-800">{c.nome}</td>
                        <td className="px-4 py-3.5 text-gray-500">{c.email}</td>
                        <td className="px-4 py-3.5 text-gray-500">{c.fone}</td>
                        <td className="px-4 py-3.5 text-gray-400 text-xs font-semibold">
                          {usr ? usr.login : "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
