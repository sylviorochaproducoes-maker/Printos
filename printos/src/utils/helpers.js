export const TAM_ADULTO = ["PP", "P", "M", "G", "GG", "XGG", "XGG1", "XGG2", "XGG3", "XGG4"];
export const TAM_INFANTIL = ["0", "2", "4", "6", "8", "10", "12", "14"];

export const STATUS_FLUXO = [
  "Aguardando Arte",
  "Arte Aprovada",
  "Em Produção",
  "Finalizado",
  "Entregue"
];

export const MODELOS  = ["Tradicional", "Babylook", "Infantil"];
export const GOLAS    = ["Redonda", "V", "Polo", "Padre", "Sport"];
export const MANGAS   = [
  "Manga Curta – Tradicional", "Manga Curta – Raglan",
  "Manga Longa – Tradicional", "Manga Longa – Raglan",
  "Sem Manga",
];
export const ESTAMPAS = ["Local", "Total"];

export const STATUS_COR = {
  "Aguardando Arte": { pil: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-500" },
  "Arte Aprovada":   { pil: "bg-blue-100  text-blue-800  border-blue-200",    dot: "bg-blue-500" },
  "Em Produção":     { pil: "bg-orange-100 text-orange-800 border-orange-200", dot: "bg-orange-500" },
  "Finalizado":      { pil: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" },
  "Entregue":        { pil: "bg-slate-100 text-slate-600 border-slate-200",   dot: "bg-slate-400" }
};

export const somarTam = (t) => {
  if (!t) return 0;
  return Object.values(t).reduce((s, v) => s + (parseInt(v) || 0), 0);
};

export const fmtData = (d) => {
  if (!d) return "";
  const parts = d.split("-");
  if (parts.length < 3) return d;
  const [y, m, dd] = parts;
  return `${dd}/${m}/${y}`;
};

export const novoId = (os) => {
  const max = os
    .map((o) => {
      const parts = o.id.split("-");
      return parts.length > 1 ? parseInt(parts[1]) || 0 : 0;
    })
    .reduce((a, b) => Math.max(a, b), 0);
  return `OS-${String(max + 1).padStart(3, "0")}`;
};

export const getTamList = (m) => (m === "Infantil" ? TAM_INFANTIL : TAM_ADULTO);

export const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erro ao decodificar JWT", e);
    return null;
  }
};

