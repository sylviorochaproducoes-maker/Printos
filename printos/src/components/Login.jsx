import { useState, useEffect } from "react";
import { decodeJWT } from "../utils/helpers";

export default function Login({ onLogin, usuarios = [], empresas = [] }) {
  const [emailOrLogin, setEmailOrLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [clientId, setClientId] = useState(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || 
    localStorage.getItem("printos_google_client_id") || 
    ""
  );
  const [mostrarConfigGoogle, setMostrarConfigGoogle] = useState(false);

  // Carregar script do Google Identity Services
  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      inicializarGoogle();
    };

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [clientId, usuarios]); // Re-inicializa se o clientId ou usuários mudarem

  const inicializarGoogle = () => {
    if (typeof google === "undefined" || !clientId) return;

    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      const container = document.getElementById("google-btn-container");
      if (container) {
        container.innerHTML = ""; // Limpa botão anterior
        google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          width: container.offsetWidth || 350,
          text: "continue_with",
          shape: "rectangular",
        });
      }
    } catch (e) {
      console.error("Erro ao inicializar Google Sign-In", e);
    }
  };

  const handleCredentialResponse = (response) => {
    setCarregando(true);
    setErro("");

    const payload = decodeJWT(response.credential);
    if (!payload || !payload.email) {
      setErro("Erro ao decodificar a conta do Google.");
      setCarregando(false);
      return;
    }

    const googleEmail = payload.email.toLowerCase();

    // Buscar usuário pelo e-mail
    const u = usuarios.find(
      (user) =>
        (user.email && user.email.toLowerCase() === googleEmail) ||
        (user.login && user.login.toLowerCase() === googleEmail)
    );

    if (u) {
      // Verificar se a empresa está ativa
      if (u.papel === "confeccao" || u.papel === "cliente") {
        const comp = empresas.find(e => e.id === u.companyId);
        if (comp && comp.status !== "Ativo") {
          setErro(`Acesso bloqueado: A empresa "${comp.nome}" está desativada ou com pendências financeiras.`);
          setCarregando(false);
          return;
        }
      } else if (u.papel === "colaborador") {
        const ids = u.companyIds || (u.companyId ? [u.companyId] : []);
        const ativas = empresas.filter(e => ids.includes(e.id) && e.status === "Ativo");
        if (ativas.length === 0) {
          setErro("Acesso bloqueado: Todas as empresas às quais você está associado estão desativadas.");
          setCarregando(false);
          return;
        }
      }
      onLogin(u);
    } else {
      setErro(
        `O e-mail do Google (${googleEmail}) não está cadastrado em nenhuma confecção. Cadastre este e-mail como Administrador, Colaborador ou Cliente primeiro.`
      );
    }
    setCarregando(false);
  };

  const salvarClientId = (val) => {
    setClientId(val);
    localStorage.setItem("printos_google_client_id", val);
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
        // Verificar se a empresa está ativa
        if (u.papel === "confeccao" || u.papel === "cliente") {
          const comp = empresas.find(e => e.id === u.companyId);
          if (comp && comp.status !== "Ativo") {
            setErro(`Acesso bloqueado: A empresa "${comp.nome}" está desativada ou com pendências financeiras.`);
            setCarregando(false);
            return;
          }
        } else if (u.papel === "colaborador") {
          const ids = u.companyIds || (u.companyId ? [u.companyId] : []);
          const ativas = empresas.filter(e => ids.includes(e.id) && e.status === "Ativo");
          if (ativas.length === 0) {
            setErro("Acesso bloqueado: Todas as empresas às quais você está associado estão desativadas.");
            setCarregando(false);
            return;
          }
        }
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 ring-1 ring-white/20 text-3xl backdrop-blur-sm shadow-inner shadow-white/5">
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-800"
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
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-800"
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
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 flex items-center gap-2 leading-relaxed">
                ⚠️ {erro}
              </p>
            )}

            {/* Buttons */}
            <div className="space-y-4">
              <button
                onClick={entrarComCredenciais}
                disabled={carregando || !emailOrLogin || !senha}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg"
              >
                {carregando ? "Entrando..." : "Entrar →"}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium">ou</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Google Sign-in Container */}
              {clientId ? (
                <div className="space-y-2">
                  <div id="google-btn-container" className="w-full flex justify-center min-h-[44px]" />
                  <p className="text-[10px] text-center text-gray-400">
                    Conectado com o Client ID: {clientId.slice(0, 15)}...
                  </p>
                </div>
              ) : (
                <div className="text-center p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-2">
                  <p className="text-xs text-amber-800 font-medium">
                    Google Sign-In necessita de configuração.
                  </p>
                  <button
                    onClick={() => setMostrarConfigGoogle(!mostrarConfigGoogle)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Como Configurar
                  </button>
                </div>
              )}
            </div>

            {/* Configuração box */}
            {(mostrarConfigGoogle || !clientId) && (
              <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-3 text-left">
                <p className="text-xs font-bold text-gray-700">Configuração do Google Auth</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Para habilitar o login real do Google, crie um projeto no <strong>Google Cloud Console</strong>, crie credenciais do tipo OAuth 2.0 Client ID e:
                </p>
                <ol className="list-decimal pl-4 text-[10px] text-gray-500 space-y-1">
                  <li>Configure o Vercel com a variável de ambiente: <code className="bg-gray-200 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code></li>
                  <li>Ou cole temporariamente o seu Client ID no campo abaixo:</li>
                </ol>
                <div className="pt-1 flex gap-2">
                  <input
                    value={clientId}
                    onChange={(e) => salvarClientId(e.target.value)}
                    placeholder="Cole seu Client ID aqui..."
                    className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-800"
                  />
                  {clientId && (
                    <button
                      onClick={() => {
                        salvarClientId("");
                        setMostrarConfigGoogle(false);
                      }}
                      className="text-xs font-bold text-red-500 hover:text-red-700"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
