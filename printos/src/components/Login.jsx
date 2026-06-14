import { useState } from "react";

function PapelTag({ papel }) {
  const m = {
    superadmin:  ["Super Admin", "bg-rose-100 text-rose-700 border-rose-200"],
    confeccao:   ["Confecção Admin", "bg-violet-100 text-violet-700 border-violet-200"],
    colaborador: ["Colaborador", "bg-teal-100 text-teal-700 border-teal-200"],
    cliente:     ["Cliente", "bg-sky-100 text-sky-700 border-sky-200"],
  };
  const [l, c] = m[papel] || [papel, "bg-gray-100 text-gray-600 border-gray-200"];
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c}`}>{l}</span>;
}

export default function Login({ onLogin, usuarios = [], empresas = [] }) {
  const [emailOrLogin, setEmailOrLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarGoogleModal, setMostrarGoogleModal] = useState(false);

  const obterNomeEmpresa = (companyId) => {
    if (!companyId) return "";
    const emp = empresas.find(e => e.id === companyId);
    return emp ? emp.nome : "";
  };

  const realizarLogin = (u) => {
    setCarregando(true);
    setErro("");
    setTimeout(() => {
      onLogin(u);
      setCarregando(false);
    }, 600);
  };

  const entrarComCredenciais = () => {
    if (!emailOrLogin || !senha) return;
    setCarregando(true);
    setErro("");
    setTimeout(() => {
      const u = usuarios.find(
        (user) =>
          (user.login.toLowerCase() === emailOrLogin.toLowerCase() ||
            (user.email && user.email.toLowerCase() === emailOrLogin.toLowerCase())) &&
          user.senha === senha
      );
      if (u) {
        onLogin(u);
      } else {
        setErro("Usuário ou senha incorretos.");
      }
      setCarregando(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 ring-1 ring-white/20 text-3xl backdrop-blur-sm shadow-inner shadow-white/5 animate-pulse">
            👕
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">PrintOS</h1>
            <p className="text-indigo-300 text-sm">Sistema Multi-Empresas de Produção</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500" />
          <div className="p-8 space-y-6">
            <h2 className="text-base font-bold text-gray-800">Acesse sua conta</h2>

            {/* Email/Login & Password Form */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Usuário ou E-mail</label>
                <input
                  value={emailOrLogin}
                  onChange={(e) => setEmailOrLogin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && entrarComCredenciais()}
                  placeholder="ex: confeccao ou admin@printos.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                  disabled={carregando}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={verSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && entrarComCredenciais()}
                    placeholder="••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    disabled={carregando}
                  />
                  <button
                    onClick={() => setVerSenha(!verSenha)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {verSenha ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
            </div>

            {erro && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 flex items-center gap-2">
                ⚠️ {erro}
              </p>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={entrarComCredenciais}
                disabled={carregando || !emailOrLogin || !senha}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg"
              >
                {carregando ? "Entrando..." : "Entrar →"}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium">ou</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                onClick={() => setMostrarGoogleModal(true)}
                disabled={carregando}
                className="w-full py-3 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl transition-all flex items-center justify-center shadow-sm"
              >
                {/* Google G Logo SVG */}
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.57-1.07-1.3-1.19-2.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.34l3.66 2.84c.87-2.6 3.3-4.53 6.3-5.3z"
                  />
                </svg>
                Continuar com o Google
              </button>
            </div>

            {/* Quick Demo Section */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                Acesso rápido (Ambiente de Teste)
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {usuarios.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setEmailOrLogin(u.login);
                      setSenha(u.senha);
                    }}
                    className="text-left px-3 py-2 bg-gray-50 hover:bg-indigo-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition group"
                  >
                    <p className="text-xs font-bold text-gray-700 group-hover:text-indigo-700 truncate">
                      {u.nome}
                    </p>
                    <p className="text-[9px] text-gray-400 truncate mb-1">
                      {u.login} {u.companyId ? `· ${obterNomeEmpresa(u.companyId)}` : ""}
                    </p>
                    <PapelTag papel={u.papel} />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Google OAuth Simulator Modal */}
      {mostrarGoogleModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200">
            {/* Google styling logo header */}
            <div className="p-6 text-center border-b border-gray-100">
              <div className="flex justify-center mb-4">
                {/* Google Wordmark Logo in SVG */}
                <svg className="h-6" viewBox="0 0 272 92" fill="none">
                  <path d="M42.7 49.3c0 8.6-6.4 15.6-15.1 15.6-8.7 0-15.1-7-15.1-15.6 0-8.7 6.4-15.6 15.1-15.6 8.7 0 15.1 6.9 15.1 15.6zm-10 0c0-5.3-3.7-9.4-8.2-9.4-4.6 0-8.2 4.1-8.2 9.4 0 5.2 3.7 9.4 8.2 9.4 4.5 0 8.2-4.2 8.2-9.4z" fill="#EA4335" />
                  <path d="M75.2 49.3c0 8.6-6.4 15.6-15.1 15.6-8.7 0-15.1-7-15.1-15.6 0-8.7 6.4-15.6 15.1-15.6 8.7 0 15.1 6.9 15.1 15.6zm-10 0c0-5.3-3.7-9.4-8.2-9.4-4.6 0-8.2 4.1-8.2 9.4 0 5.2 3.7 9.4 8.2 9.4 4.5 0 8.2-4.2 8.2-9.4z" fill="#FBBC05" />
                  <path d="M106.6 35.1v27.9c0 11.5-6.8 16.2-14.8 16.2-7.5 0-12.1-5-13.8-9.1l8.7-3.6c1.6 3.7 5.2 8.1 10.6 8.1 4.9 0 8-3 8-8.6v-2.2h-.4c-1.5 1.9-4.4 3.6-8.1 3.6-7.7 0-14.7-6.7-14.7-15.5 0-8.9 7-15.8 14.7-15.8 3.7 0 6.6 1.7 8.1 3.5h.4v-2.6h9.6zm-9.3 14.3c0-5.2-3.3-9.2-7.7-9.2-4.5 0-8 4-8 9.2 0 5.1 3.5 9.2 8 9.2 4.4 0 7.7-4.1 7.7-9.2z" fill="#4285F4" />
                  <path d="M119.5 13.9V63h-9.8V13.9h9.8z" fill="#34A853" />
                  <path d="M145.4 52.8l7.8 5.2c-2.5 3.8-8.6 10-15.9 10-9 0-16.4-7-16.4-15.6 0-9.1 7.4-15.6 15.6-15.6 8.4 0 12.4 6.7 13.7 9.9l1 2.4-20.2 8.3c1.6 3.1 4 4.7 7.5 4.7 3.5 0 5.8-1.7 6.9-4.9zm-14.8-4c3-1.2 5.3-3.9 6.2-6.1-2-1.2-4.5-1.9-7-1.9-6.3 0-11.4 5.3-11.4 11.4l12.2-3.4z" fill="#EA4335" />
                  <path d="M33.6 28c-5.7 0-10.7 2.5-13.8 6.5v-5.5H10V63h9.8V44.4c0-6 2.3-11.2 8.8-11.2 5.9 0 7.9 4.3 7.9 10.7V63h9.8V42.6c.1-8.9-3.9-14.6-12.7-14.6z" fill="#4285F4" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Fazer login com o Google</h3>
              <p className="text-xs text-gray-400 mt-1">para continuar no PrintOS</p>
            </div>

            <div className="p-4 max-h-72 overflow-y-auto divide-y divide-gray-100">
              {usuarios.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setMostrarGoogleModal(false);
                    realizarLogin(u);
                  }}
                  className="w-full flex items-center gap-3 py-3 px-4 hover:bg-gray-50 transition text-left first:rounded-t-lg last:rounded-b-lg group"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm">
                    {u.nome.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 group-hover:text-indigo-600 truncate">
                      {u.nome}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {u.login.includes("@") ? u.login : `${u.login}@gmail.com`}
                    </p>
                  </div>
                  <div className="text-right">
                    <PapelTag papel={u.papel} />
                    {u.companyId && (
                      <p className="text-[9px] text-gray-400 mt-0.5 truncate max-w-[80px]">
                        {obterNomeEmpresa(u.companyId)}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-gray-50 flex items-center justify-between border-t border-gray-100">
              <button
                onClick={() => setMostrarGoogleModal(false)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Cancelar
              </button>
              <span className="text-[10px] text-gray-400">Ambiente Protegido</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
