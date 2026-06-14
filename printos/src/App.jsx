import { useState, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════

const USUARIOS = [
  { id: 1, login: "confeccao", senha: "conf123",  papel: "confeccao",  nome: "Confecção Admin"  },
  { id: 2, login: "joao",      senha: "colab123", papel: "colaborador", nome: "João Silva"      },
  { id: 3, login: "maria",     senha: "cli123",   papel: "cliente",     nome: "Maria Souza",    clienteId: 1 },
  { id: 4, login: "pedro",     senha: "cli456",   papel: "cliente",     nome: "Pedro Oliveira", clienteId: 2 },
];

const CLIENTES_INIT = [
  { id: 1, nome: "Maria Souza",    email: "maria@email.com", fone: "(11) 98888-1111" },
  { id: 2, nome: "Pedro Oliveira", email: "pedro@email.com", fone: "(11) 98888-2222" },
];

const MODELOS  = ["Tradicional", "Babylook", "Infantil"];
const GOLAS    = ["Redonda", "V", "Polo", "Padre", "Sport"];
const MANGAS   = [
  "Manga Curta – Tradicional", "Manga Curta – Raglan",
  "Manga Longa – Tradicional", "Manga Longa – Raglan",
  "Sem Manga",
];
const TAM_ADULTO   = ["PP","P","M","G","GG","XGG","XGG1","XGG2","XGG3","XGG4"];
const TAM_INFANTIL = ["0","2","4","6","8","10","12","14"];
const ESTAMPAS = ["Local", "Total"];
const STATUS_FLUXO = [
  "Aguardando Arte","Arte Aprovada","Em Produção","Finalizado","Entregue",
];

const STATUS_COR = {
  "Aguardando Arte": { pil: "bg-amber-100 text-amber-800 border-amber-200",    dot: "bg-amber-500"   },
  "Arte Aprovada":   { pil: "bg-blue-100  text-blue-800  border-blue-200",     dot: "bg-blue-500"    },
  "Em Produção":     { pil: "bg-orange-100 text-orange-800 border-orange-200", dot: "bg-orange-500"  },
  "Finalizado":      { pil: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" },
  "Entregue":        { pil: "bg-slate-100 text-slate-600 border-slate-200",    dot: "bg-slate-400"   },
};

const OS_INIT = [
  {
    id: "OS-001", clienteId: 1, clienteNome: "Maria Souza",
    descricao: "Camisetas Evento Corporativo", modelo: "Tradicional",
    gola: "Redonda", manga: "Manga Curta – Tradicional",
    tamanhos: { PP:5, P:10, M:15, G:12, GG:8 },
    estampa: "Local", cor: "#FFFFFF",
    status: "Em Produção", criado: "2026-06-10",
    obs: "Logo frente e costas", imgs: [],
  },
  {
    id: "OS-002", clienteId: 2, clienteNome: "Pedro Oliveira",
    descricao: "Uniforme Sub-15", modelo: "Infantil",
    gola: "Sport", manga: "Manga Curta – Raglan",
    tamanhos: { "0":2,"4":3,"6":5,"8":4,"10":3,"12":2 },
    estampa: "Total", cor: "#0047AB",
    status: "Arte Aprovada", criado: "2026-06-12",
    obs: "Azul e branco – número no dorso", imgs: [],
  },
  {
    id: "OS-003", clienteId: 1, clienteNome: "Maria Souza",
    descricao: "Baby Look Estampado", modelo: "Babylook",
    gola: "V", manga: "Manga Curta – Tradicional",
    tamanhos: { PP:8, P:15, M:12, G:6 },
    estampa: "Local", cor: "#FF69B4",
    status: "Aguardando Arte", criado: "2026-06-13",
    obs: "Rosa com estampa floral", imgs: [],
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═══════════════════════════════════════════════════════════

const somarTam = t => Object.values(t).reduce((s, v) => s + (parseInt(v) || 0), 0);
const fmtData  = d => { if (!d) return ""; const [y,m,dd] = d.split("-"); return `${dd}/${m}/${y}`; };
const novoId   = os => { const max = os.map(o => +o.id.split("-")[1]).reduce((a, b) => Math.max(a, b), 0); return `OS-${String(max + 1).padStart(3, "0")}`; };
const getTamList = m => m === "Infantil" ? TAM_INFANTIL : TAM_ADULTO;

// ═══════════════════════════════════════════════════════════
// COMPONENTES MENORES
// ═══════════════════════════════════════════════════════════

function Badge({ status }) {
  const c = STATUS_COR[status] || { pil: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.pil}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

function PapelTag({ papel }) {
  const m = {
    confeccao:   ["Confecção",   "bg-violet-100 text-violet-700"],
    colaborador: ["Colaborador", "bg-teal-100 text-teal-700"],
    cliente:     ["Cliente",     "bg-sky-100 text-sky-700"],
  };
  const [l, c] = m[papel] || [papel, "bg-gray-100 text-gray-600"];
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${c}`}>{l}</span>;
}

function Toggle({ opcoes, valor, onChange, pequeno }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opcoes.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`${pequeno ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"} rounded-lg font-medium border transition-all ${
            valor === o
              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200"
              : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50"
          }`}
        >{o}</button>
      ))}
    </div>
  );
}

function Secao({ titulo, children }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{titulo}</p>
      {children}
    </div>
  );
}

function BarraProgresso({ status }) {
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

// ═══════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════

function Login({ onLogin }) {
  const [l, setL] = useState("");
  const [s, setS] = useState("");
  const [ver, setVer] = useState(false);
  const [err, setErr] = useState("");
  const [load, setLoad] = useState(false);

  const entrar = () => {
    setLoad(true); setErr("");
    setTimeout(() => {
      const u = USUARIOS.find(u => u.login === l && u.senha === s);
      u ? onLogin(u) : setErr("Usuário ou senha incorretos.");
      setLoad(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-7">

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 ring-1 ring-white/20 text-3xl backdrop-blur-sm">👕</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">PrintOS</h1>
            <p className="text-indigo-400 text-sm">Sistema de Produção de Camisetas</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500" />
          <div className="p-8 space-y-5">
            <h2 className="text-base font-bold text-gray-800">Acesse sua conta</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Usuário</label>
                <input value={l} onChange={e => setL(e.target.value)} onKeyDown={e => e.key === "Enter" && entrar()}
                  placeholder="seu login"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Senha</label>
                <div className="relative">
                  <input type={ver ? "text" : "password"} value={s} onChange={e => setS(e.target.value)} onKeyDown={e => e.key === "Enter" && entrar()}
                    placeholder="••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
                  <button onClick={() => setVer(!ver)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {ver ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
            </div>

            {err && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">⚠️ {err}</p>}

            <button onClick={entrar} disabled={load || !l || !s}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-200">
              {load ? "Entrando…" : "Entrar →"}
            </button>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Acesso rápido — demo</p>
              <div className="grid grid-cols-2 gap-2">
                {USUARIOS.map(u => (
                  <button key={u.id} onClick={() => { setL(u.login); setS(u.senha); }}
                    className="text-left px-3 py-2.5 bg-gray-50 hover:bg-indigo-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all group">
                    <p className="text-xs font-bold text-gray-700 group-hover:text-indigo-700 truncate">{u.nome}</p>
                    <p className="text-[10px] text-gray-400 mb-1">{u.login} / {u.senha}</p>
                    <PapelTag papel={u.papel} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════

function Sidebar({ usuario, aba, setAba, sair }) {
  const nav = {
    confeccao:   [["dashboard","📊","Dashboard"],["oss","📋","Todas as OSs"],["nova","➕","Nova OS"],["clientes","👥","Clientes"]],
    colaborador: [["oss","📋","Ordens de Serviço"]],
    cliente:     [["meus","🛍️","Meus Pedidos"]],
  }[usuario.papel] || [];

  return (
    <aside className="w-56 bg-slate-950 text-white flex flex-col h-screen sticky top-0 shrink-0">
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">👕</span>
          <div>
            <p className="font-black text-sm tracking-tight">PrintOS</p>
            <p className="text-[10px] text-slate-500">Confecção Personalizada</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 border-b border-white/10 bg-white/5">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Conectado como</p>
        <p className="text-sm font-semibold truncate">{usuario.nome}</p>
        <div className="mt-1"><PapelTag papel={usuario.papel} /></div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(([id, icon, label]) => (
          <button key={id} onClick={() => setAba(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              aba === id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/60"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}>
            <span className="text-base">{icon}</span>{label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button onClick={sair} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-950/60 hover:text-red-400 transition-all">
          <span>🚪</span>Sair
        </button>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════

function Dashboard({ oss }) {
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

// ═══════════════════════════════════════════════════════════
// LISTA DE OSs
// ═══════════════════════════════════════════════════════════

function ListaOS({ usuario, oss, onSelect }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  const vis = oss.filter(o => {
    const fs = filtro === "Todos" || o.status === filtro;
    const fq = !busca || [o.id, o.clienteNome, o.descricao].some(v => v.toLowerCase().includes(busca.toLowerCase()));
    return fs && fq;
  });

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-black text-gray-900">
          {usuario.papel === "colaborador" ? "Ordens de Serviço" : "Todas as OSs"}
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">{vis.length} resultado{vis.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <input value={busca} onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por OS, cliente, descrição…"
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <div className="flex gap-1 flex-wrap">
            {["Todos", ...STATUS_FLUXO].map(s => (
              <button key={s} onClick={() => setFiltro(s)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filtro === s ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
              <tr>
                <th className="text-left px-4 py-3">OS</th>
                {usuario.papel !== "cliente" && <th className="text-left px-4 py-3">Cliente</th>}
                <th className="text-left px-4 py-3">Descrição</th>
                <th className="text-left px-4 py-3">Modelo</th>
                <th className="text-left px-4 py-3">Peças</th>
                <th className="text-left px-4 py-3">Data</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vis.length === 0
                ? <tr><td colSpan={8} className="text-center py-14 text-gray-400">Nenhuma OS encontrada</td></tr>
                : vis.map(o => (
                  <tr key={o.id} onClick={() => onSelect(o)}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer">
                    <td className="px-4 py-3.5 font-bold text-indigo-700">{o.id}</td>
                    {usuario.papel !== "cliente" && <td className="px-4 py-3.5 text-gray-700 font-medium">{o.clienteNome}</td>}
                    <td className="px-4 py-3.5 text-gray-500 max-w-[180px] truncate">{o.descricao}</td>
                    <td className="px-4 py-3.5 text-gray-600">{o.modelo}</td>
                    <td className="px-4 py-3.5 text-gray-600 font-semibold">{somarTam(o.tamanhos)}</td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs">{fmtData(o.criado)}</td>
                    <td className="px-4 py-3.5"><Badge status={o.status} /></td>
                    <td className="px-4 py-3.5 text-right text-xs font-semibold text-indigo-500 hover:text-indigo-700">Ver →</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MEUS PEDIDOS (cliente)
// ═══════════════════════════════════════════════════════════

function MeusPedidos({ usuario, oss, onSelect }) {
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

// ═══════════════════════════════════════════════════════════
// MODAL DETALHE DA OS
// ═══════════════════════════════════════════════════════════

function ModalOS({ os, usuario, fechar, atualizar }) {
  const [status, setStatus] = useState(os.status);
  const [salvo, setSalvo] = useState(false);
  const podeEditar = usuario.papel !== "cliente";

  const salvar = () => {
    const upd = { ...os, status };
    atualizar(upd);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 1800);
  };

  const pares = Object.entries(os.tamanhos).filter(([, v]) => +v > 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-lg font-black text-indigo-700">{os.id}</span>
              <Badge status={os.status} />
            </div>
            <p className="text-sm text-gray-500">{os.descricao}</p>
          </div>
          <button onClick={fechar} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition font-medium text-sm">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {podeEditar && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-end justify-between gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">Atualizar Status</p>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  className="w-full border border-indigo-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {STATUS_FLUXO.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={salvar} disabled={status === os.status && !salvo}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${salvo ? "bg-emerald-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-md shadow-indigo-200"}`}>
                {salvo ? "✓ Salvo!" : "Salvar"}
              </button>
            </div>
          )}

          <BarraProgresso status={os.status} />

          <div className="grid grid-cols-2 gap-4">
            {[
              usuario.papel !== "cliente" && ["Cliente", os.clienteNome],
              ["Data do Pedido", fmtData(os.criado)],
              ["Modelo", os.modelo],
              ["Gola", os.gola],
              ["Manga", os.manga],
              ["Estampa", os.estampa],
            ].filter(Boolean).map(([k, v]) => (
              <div key={k} className="space-y-0.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{k}</p>
                <p className="text-sm font-semibold text-gray-800">{v}</p>
              </div>
            ))}
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cor Base</p>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border-2 border-white shadow-md" style={{ background: os.cor }} />
                <span className="text-sm font-mono font-semibold text-gray-700">{os.cor}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Tamanhos / Quantidades</p>
            <div className="flex flex-wrap gap-2">
              {pares.map(([t, q]) => (
                <div key={t} className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-center min-w-[52px]">
                  <p className="text-[9px] font-bold text-indigo-400 uppercase">{t}</p>
                  <p className="text-xl font-black text-indigo-800">{q}</p>
                </div>
              ))}
              <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-center min-w-[52px]">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Total</p>
                <p className="text-xl font-black text-slate-700">{somarTam(os.tamanhos)}</p>
              </div>
            </div>
          </div>

          {os.obs && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Observações</p>
              <p className="text-sm text-gray-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">{os.obs}</p>
            </div>
          )}

          {os.imgs?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Artes / Logos ({os.imgs.length})</p>
              <div className="grid grid-cols-3 gap-2">
                {os.imgs.map((img, i) => (
                  <div key={i} className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <img src={img.url} alt={img.nome} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NOVA OS
// ═══════════════════════════════════════════════════════════

function NovaOS({ oss, setOss, onFim, clientes }) {
  const fileRef = useRef();
  const [salvo, setSalvo] = useState(false);
  const [form, setForm] = useState({
    clienteId: "", clienteNome: "", descricao: "",
    modelo: "Tradicional", gola: "Redonda",
    manga: "Manga Curta – Tradicional",
    estampa: "Local", cor: "#FFFFFF",
    tamanhos: {}, obs: "",
    status: "Aguardando Arte", imgs: [],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setModelo = m => setForm(f => ({ ...f, modelo: m, tamanhos: {} }));
  const setTam = (t, v) => setForm(f => ({ ...f, tamanhos: { ...f.tamanhos, [t]: Math.max(0, parseInt(v) || 0) } }));

  const handleFiles = e => {
    Array.from(e.target.files).forEach(file => {
      const r = new FileReader();
      r.onload = ev => setForm(f => ({ ...f, imgs: [...f.imgs, { nome: file.name, url: ev.target.result }] }));
      r.readAsDataURL(file);
    });
  };

  const remImg = i => setForm(f => ({ ...f, imgs: f.imgs.filter((_, idx) => idx !== i) }));

  const setCliente = id => {
    const c = clientes.find(c => c.id === +id);
    if (c) setForm(f => ({ ...f, clienteId: c.id, clienteNome: c.nome }));
  };

  const criar = () => {
    if (!form.clienteId || !form.descricao.trim()) return;
    setOss(prev => [{ ...form, id: novoId(prev), criado: new Date().toISOString().split("T")[0] }, ...prev]);
    setSalvo(true);
    setTimeout(() => { setSalvo(false); onFim(); }, 1600);
  };

  const tamList = getTamList(form.modelo);
  const total   = somarTam(form.tamanhos);
  const valido  = form.clienteId && form.descricao.trim();

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-black text-gray-900">Nova Ordem de Serviço</h1>
        <p className="text-sm text-gray-400 mt-0.5">Preencha todos os dados da produção</p>
      </div>

      <div className="p-6">
        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-7">

            <Secao titulo="Identificação">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Cliente *</label>
                  <select value={form.clienteId} onChange={e => setCliente(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="">Selecionar cliente…</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">Descrição do pedido *</label>
                  <input value={form.descricao} onChange={e => set("descricao", e.target.value)}
                    placeholder="Ex: Uniforme empresa XYZ"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
            </Secao>

            <Secao titulo="Modelo de Camiseta">
              <Toggle opcoes={MODELOS} valor={form.modelo} onChange={setModelo} />
            </Secao>

            <Secao titulo="Tipo de Gola">
              <Toggle opcoes={GOLAS} valor={form.gola} onChange={v => set("gola", v)} />
            </Secao>

            <Secao titulo="Tipo de Manga">
              <Toggle opcoes={MANGAS} valor={form.manga} onChange={v => set("manga", v)} pequeno />
            </Secao>

            <div className="grid grid-cols-2 gap-6">
              <Secao titulo="Tipo de Estampa">
                <Toggle opcoes={ESTAMPAS} valor={form.estampa} onChange={v => set("estampa", v)} />
              </Secao>
              <Secao titulo="Cor Base da Camiseta">
                <div className="flex items-center gap-3">
                  <input type="color" value={form.cor} onChange={e => set("cor", e.target.value)}
                    className="w-12 h-11 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-transparent" />
                  <input type="text" value={form.cor} onChange={e => set("cor", e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </Secao>
            </div>

            <Secao titulo={`Tamanhos / Quantidades${total > 0 ? ` — Total: ${total} peças` : ""}`}>
              <div className="grid grid-cols-5 gap-2">
                {tamList.map(t => (
                  <div key={t} className="text-center">
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">{t}</label>
                    <input type="number" min={0} value={form.tamanhos[t] || ""} onChange={e => setTam(t, e.target.value)}
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-xl px-1 py-2.5 text-sm text-center bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                ))}
              </div>
            </Secao>

            <Secao titulo="Observações">
              <textarea value={form.obs} onChange={e => set("obs", e.target.value)} rows={3}
                placeholder="Posicionamento da estampa, cores específicas, numeração, detalhes especiais…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
            </Secao>

            <Secao titulo="Artes / Logos (upload)">
              <div onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-7 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group">
                <div className="text-4xl mb-2.5">🖼️</div>
                <p className="text-sm font-semibold text-gray-500 group-hover:text-indigo-600">Clique para enviar imagens</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG — múltiplos arquivos permitidos</p>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              </div>

              {form.imgs.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {form.imgs.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <img src={img.url} alt={img.nome} className="w-full h-full object-cover" />
                      </div>
                      <button onClick={() => remImg(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-md">✕</button>
                      <p className="text-[9px] text-gray-400 mt-1 truncate">{img.nome}</p>
                    </div>
                  ))}
                </div>
              )}
            </Secao>

            <Secao titulo="Status Inicial">
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {STATUS_FLUXO.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Secao>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button onClick={onFim}
                className="px-5 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button onClick={criar} disabled={!valido || salvo}
                className={`px-7 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
                  salvo
                    ? "bg-emerald-500 text-white shadow-emerald-200"
                    : "bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-indigo-200"
                }`}>
                {salvo ? "✓ OS Criada com Sucesso!" : "Criar Ordem de Serviço"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CLIENTES
// ═══════════════════════════════════════════════════════════

function Clientes({ clientes }) {
  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-black text-gray-900">Clientes</h1>
        <p className="text-sm text-gray-400 mt-0.5">Cadastro de clientes</p>
      </div>
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
              <tr>
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Nome</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Telefone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clientes.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-gray-400 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3.5 font-bold text-gray-800">{c.nome}</td>
                  <td className="px-4 py-3.5 text-gray-500">{c.email}</td>
                  <td className="px-4 py-3.5 text-gray-500">{c.fone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [oss, setOss]         = useState(OS_INIT);
  const [clientes]            = useState(CLIENTES_INIT);
  const [aba, setAba]         = useState("dashboard");
  const [modal, setModal]     = useState(null);

  const login = u => {
    setUsuario(u);
    setAba(u.papel === "confeccao" ? "dashboard" : u.papel === "colaborador" ? "oss" : "meus");
  };

  const sair = () => { setUsuario(null); setAba("dashboard"); };

  const atualizar = updated => {
    setOss(prev => prev.map(o => o.id === updated.id ? updated : o));
    setModal(updated);
  };

  if (!usuario) return <Login onLogin={login} />;

  const ossVisiveis = usuario.papel === "cliente"
    ? oss.filter(o => o.clienteId === usuario.clienteId)
    : oss;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar usuario={usuario} aba={aba} setAba={setAba} sair={sair} />
      <main className="flex-1 overflow-y-auto">
        {aba === "dashboard" && usuario.papel === "confeccao"  && <Dashboard oss={oss} />}
        {aba === "oss"       && usuario.papel !== "cliente"    && <ListaOS usuario={usuario} oss={ossVisiveis} onSelect={setModal} />}
        {aba === "meus"      && usuario.papel === "cliente"    && <MeusPedidos usuario={usuario} oss={ossVisiveis} onSelect={setModal} />}
        {aba === "nova"      && usuario.papel === "confeccao"  && <NovaOS oss={oss} setOss={setOss} onFim={() => setAba("oss")} clientes={clientes} />}
        {aba === "clientes"  && usuario.papel === "confeccao"  && <Clientes clientes={clientes} />}
      </main>
      {modal && <ModalOS os={modal} usuario={usuario} fechar={() => setModal(null)} atualizar={atualizar} />}
    </div>
  );
}
