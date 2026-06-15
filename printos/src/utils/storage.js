// ═══════════════════════════════════════════════════════════
// DADOS DE SEMENTE (SEED)
// ═══════════════════════════════════════════════════════════

const DEFAULT_EMPRESAS = [
  { id: 1, nome: "Confecção Estilo & Cia", email: "contato@estilo.com", status: "Ativo", criado: "2026-06-01" },
  { id: 2, nome: "Estamparia Rápida", email: "suporte@rapida.com", status: "Ativo", criado: "2026-06-10" }
];

const DEFAULT_USUARIOS = [
  { id: "admin", login: "admin@printos.com", senha: "admin123", papel: "superadmin", nome: "Super Admin" },
  
  // Empresa 1
  { id: 1, login: "confeccao", senha: "conf123", papel: "confeccao", nome: "Estilo Admin", companyId: 1 },
  { id: 2, login: "joao", senha: "colab123", papel: "colaborador", nome: "João Silva", companyId: 1 },
  { id: 3, login: "maria", senha: "cli123", papel: "cliente", nome: "Maria Souza", clienteId: 1, companyId: 1 },
  { id: 4, login: "pedro", senha: "cli456", papel: "cliente", nome: "Pedro Oliveira", clienteId: 2, companyId: 1 },

  // Empresa 2
  { id: 5, login: "rapida", senha: "conf456", papel: "confeccao", nome: "Rápida Admin", companyId: 2 },
  { id: 6, login: "carlos", senha: "cli789", papel: "cliente", nome: "Carlos Santos", clienteId: 3, companyId: 2 }
];

const DEFAULT_CLIENTES = [
  { id: 1, companyId: 1, nome: "Maria Souza", email: "maria@email.com", fone: "(11) 98888-1111" },
  { id: 2, companyId: 1, nome: "Pedro Oliveira", email: "pedro@email.com", fone: "(11) 98888-2222" },
  { id: 3, companyId: 2, nome: "Carlos Santos", email: "carlos@email.com", fone: "(11) 98888-3333" }
];

const DEFAULT_OSS = [
  {
    id: "OS-001", companyId: 1, clienteId: 1, clienteNome: "Maria Souza",
    descricao: "Camisetas Evento Corporativo", modelo: "Tradicional",
    gola: "Redonda", manga: "Manga Curta – Tradicional",
    tamanhos: { PP: 5, P: 10, M: 15, G: 12, GG: 8 },
    estampa: "Local", cor: "#FFFFFF",
    status: "Corte", criado: "2026-06-10",
    obs: "Logo frente e costas", imgs: []
  },
  {
    id: "OS-002", companyId: 1, clienteId: 2, clienteNome: "Pedro Oliveira",
    descricao: "Uniforme Sub-15", modelo: "Infantil",
    gola: "Sport", manga: "Manga Curta – Raglan",
    tamanhos: { "0": 2, "4": 3, "6": 5, "8": 4, "10": 3, "12": 2 },
    estampa: "Total", cor: "#0047AB",
    status: "Arte Aprovada", criado: "2026-06-12",
    obs: "Azul e branco – número no dorso", imgs: []
  },
  {
    id: "OS-003", companyId: 1, clienteId: 1, clienteNome: "Maria Souza",
    descricao: "Baby Look Estampado", modelo: "Babylook",
    gola: "V", manga: "Manga Curta – Tradicional",
    tamanhos: { PP: 8, P: 15, M: 12, G: 6 },
    estampa: "Local", cor: "#FF69B4",
    status: "Aguardando Arte", criado: "2026-06-13",
    obs: "Rosa com estampa floral", imgs: []
  },
  {
    id: "OS-004", companyId: 2, clienteId: 3, clienteNome: "Carlos Santos",
    descricao: "Uniformes Escolares", modelo: "Tradicional",
    gola: "Polo", manga: "Manga Curta – Tradicional",
    tamanhos: { M: 50 },
    estampa: "Local", cor: "#00FF00",
    status: "Aguardando Arte", criado: "2026-06-14",
    obs: "Bordado no peito", imgs: []
  }
];

// ═══════════════════════════════════════════════════════════
// MÉTODOS AUXILIARES
// ═══════════════════════════════════════════════════════════

const getStorageItem = (key, defaultValue) => {
  try {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(val);
  } catch (e) {
    console.error("Erro ao ler localStorage", e);
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Erro ao escrever no localStorage", e);
  }
};

export const loadData = () => {
  const empresas = getStorageItem("printos_empresas", DEFAULT_EMPRESAS);
  const usuarios = getStorageItem("printos_usuarios", DEFAULT_USUARIOS);
  const clientes = getStorageItem("printos_clientes", DEFAULT_CLIENTES);
  let oss = getStorageItem("printos_oss", DEFAULT_OSS);

  // Migrar status antigos de "Em Produção" para "Corte"
  let migrado = false;
  oss = oss.map(o => {
    if (o.status === "Em Produção") {
      migrado = true;
      return { ...o, status: "Corte" };
    }
    return o;
  });

  if (migrado) {
    setStorageItem("printos_oss", oss);
  }

  return { empresas, usuarios, clientes, oss };
};

export const saveEmpresas = (empresas) => setStorageItem("printos_empresas", empresas);
export const saveUsuarios = (usuarios) => setStorageItem("printos_usuarios", usuarios);
export const saveClientes = (clientes) => setStorageItem("printos_clientes", clientes);
export const saveOSs = (oss) => setStorageItem("printos_oss", oss);
