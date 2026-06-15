import { useState, useEffect } from "react";

// Utilitários e Persistência
import { loadData, saveEmpresas, saveUsuarios, saveClientes, saveOSs } from "./utils/storage";

// Componentes
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ListaOS from "./components/ListaOS";
import MeusPedidos from "./components/MeusPedidos";
import NovaOS from "./components/NovaOS";
import Clientes from "./components/Clientes";
import Colaboradores from "./components/Colaboradores";
import SuperAdmin from "./components/SuperAdmin";
import ModalOS from "./components/ModalOS";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [aba, setAba] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  // Estados Globais
  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [oss, setOss] = useState([]);

  // Carregar dados iniciais no primeiro render
  useEffect(() => {
    const data = loadData();
    setEmpresas(data.empresas);
    setUsuarios(data.usuarios);
    setClientes(data.clientes);
    setOss(data.oss);
  }, []);

  const login = (u) => {
    setUsuario(u);
    if (u.papel === "superadmin") {
      setAba("empresas");
    } else if (u.papel === "confeccao") {
      setAba("dashboard");
    } else if (u.papel === "colaborador") {
      setAba("oss");
    } else if (u.papel === "cliente") {
      setAba("meus");
    }
  };

  const sair = () => {
    setUsuario(null);
    setAba("dashboard");
    setModal(null);
    setMenuAberto(false);
  };

  // ═══════════════════════════════════════════════════════════
  // CALLBACKS DE CADASTRO / ATUALIZAÇÃO
  // ═══════════════════════════════════════════════════════════

  const handleAddCompany = (novaEmpresa) => {
    setEmpresas((prev) => {
      const upd = [...prev, novaEmpresa];
      saveEmpresas(upd);
      return upd;
    });
  };

  const handleAddUser = (novoUsuario) => {
    setUsuarios((prev) => {
      const upd = [...prev, novoUsuario];
      saveUsuarios(upd);
      return upd;
    });
  };

  const handleAddClient = (novoCliente) => {
    setClientes((prev) => {
      const upd = [...prev, novoCliente];
      saveClientes(upd);
      return upd;
    });
  };

  const handleAddOS = (setter) => {
    if (typeof setter === "function") {
      setOss((prev) => {
        const upd = setter(prev);
        saveOSs(upd);
        return upd;
      });
    } else {
      setOss((prev) => {
        const upd = [setter, ...prev];
        saveOSs(upd);
        return upd;
      });
    }
  };

  const handleUpdateOS = (updatedOS) => {
    setOss((prev) => {
      const upd = prev.map((o) => (o.id === updatedOS.id ? updatedOS : o));
      saveOSs(upd);
      return upd;
    });
    setModal(updatedOS);
  };

  if (!usuario) {
    return <Login onLogin={login} usuarios={usuarios} empresas={empresas} />;
  }

  // ═══════════════════════════════════════════════════════════
  // FILTRAGEM POR TENANT (MULTI-EMPRESA)
  // ═══════════════════════════════════════════════════════════

  const ossVisiveis =
    usuario.papel === "superadmin"
      ? oss
      : usuario.papel === "cliente"
      ? oss.filter((o) => o.companyId === usuario.companyId && o.clienteId === usuario.clienteId)
      : oss.filter((o) => o.companyId === usuario.companyId);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden relative">
      {/* Mobile Top Header */}
      <header className="md:hidden h-14 bg-slate-950 text-white flex items-center justify-between px-4 z-30 shrink-0 shadow-md">
        <button
          onClick={() => setMenuAberto(true)}
          className="text-2xl focus:outline-none p-1"
        >
          ☰
        </button>
        <span className="font-black text-sm tracking-tight">PrintOS</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-600/80 text-white">
          {usuario.nome.split(" ")[0]}
        </span>
      </header>

      {/* Drawer Overlay for Mobile */}
      {menuAberto && (
        <div
          onClick={() => setMenuAberto(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        usuario={usuario}
        aba={aba}
        setAba={(novaAba) => {
          setAba(novaAba);
          setMenuAberto(false); // Fecha o menu lateral no celular ao trocar de aba
        }}
        sair={sair}
        empresas={empresas}
        menuAberto={menuAberto}
        fecharMenu={() => setMenuAberto(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Super Admin */}
        {aba === "empresas" && usuario.papel === "superadmin" && (
          <SuperAdmin
            empresas={empresas}
            usuarios={usuarios}
            onAddCompany={handleAddCompany}
            onAddUser={handleAddUser}
          />
        )}

        {/* Empresa Admin & Colaborador */}
        {aba === "dashboard" && usuario.papel === "confeccao" && (
          <Dashboard oss={ossVisiveis} />
        )}
        {aba === "oss" && usuario.papel !== "cliente" && (
          <ListaOS usuario={usuario} oss={ossVisiveis} onSelect={setModal} />
        )}
        {aba === "nova" && usuario.papel === "confeccao" && (
          <NovaOS
            usuario={usuario}
            oss={oss}
            setOss={handleAddOS}
            onFim={() => setAba("oss")}
            clientes={clientes}
          />
        )}
        {aba === "colaboradores" && usuario.papel === "confeccao" && (
          <Colaboradores
            usuario={usuario}
            usuarios={usuarios}
            onAddUser={handleAddUser}
          />
        )}
        {aba === "clientes" && usuario.papel === "confeccao" && (
          <Clientes
            usuario={usuario}
            clientes={clientes}
            usuarios={usuarios}
            onAddClient={handleAddClient}
            onAddUser={handleAddUser}
          />
        )}

        {/* Cliente */}
        {aba === "meus" && usuario.papel === "cliente" && (
          <MeusPedidos usuario={usuario} oss={ossVisiveis} onSelect={setModal} />
        )}
      </main>

      {/* Detalhe da OS */}
      {modal && (
        <ModalOS
          os={modal}
          usuario={usuario}
          fechar={() => setModal(null)}
          atualizar={handleUpdateOS}
        />
      )}
    </div>
  );
}
