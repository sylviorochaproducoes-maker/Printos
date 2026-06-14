# 👕 PrintOS — Sistema de Gestão de Confecção

Sistema completo de produção de camisetas personalizadas com controle de OSs, hierarquia de acesso e upload de artes.

---

## 🔐 Usuários de demonstração

| Papel | Login | Senha | Acesso |
|---|---|---|---|
| Confecção | `confeccao` | `conf123` | Total (dashboard, OSs, clientes) |
| Colaborador | `joao` | `colab123` | Somente OSs |
| Cliente | `maria` | `cli123` | Somente seus pedidos |
| Cliente | `pedro` | `cli456` | Somente seus pedidos |

---

## 🚀 Rodar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (já vem com o Node)

### Passo a passo

```bash
# 1. Entre na pasta do projeto
cd printos

# 2. Instale as dependências
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev
```

Abra `http://localhost:5173` no navegador.

---

## ☁️ Deploy no Vercel (grátis)

### Opção A — Via interface web (mais fácil)

1. Crie conta em [vercel.com](https://vercel.com)
2. Suba o projeto no GitHub (veja abaixo)
3. No Vercel: clique em **"Add New Project"**
4. Importe o repositório do GitHub
5. Clique em **"Deploy"** — pronto! ✅

O Vercel detecta automaticamente que é um projeto Vite.

### Opção B — Via CLI

```bash
npm install -g vercel
vercel
```

---

## 📦 Subir para o GitHub

```bash
# Na pasta do projeto
git init
git add .
git commit -m "feat: PrintOS inicial"

# Crie um repositório em github.com, depois:
git remote add origin https://github.com/SEU_USUARIO/printos.git
git branch -M main
git push -u origin main
```

---

## 🏗️ Estrutura do projeto

```
printos/
├── src/
│   ├── App.jsx        # Aplicação principal
│   ├── main.jsx       # Entry point React
│   └── index.css      # Tailwind CSS
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

---

## ✨ Funcionalidades

- ✅ Login com 3 níveis de acesso (Confecção, Colaborador, Cliente)
- ✅ Dashboard com estatísticas de produção
- ✅ CRUD de Ordens de Serviço
- ✅ Modelos: Tradicional, Babylook, Infantil
- ✅ Golas: Redonda, V, Polo, Padre, Sport
- ✅ Mangas: Curta/Longa (Tradicional ou Raglan) e Sem Manga
- ✅ Tamanhos adultos (PP ao XGG4) e infantis (0 ao 14)
- ✅ Estampa Local ou Total
- ✅ Seletor de cor base com picker visual
- ✅ Upload de logos e artes (PNG, JPG, SVG)
- ✅ Barra de progresso visual por status
- ✅ Atualização de status em tempo real
- ✅ Filtros e busca nas OSs

---

## 🛠️ Próximos passos sugeridos

- [ ] Banco de dados real (Supabase, Firebase ou MySQL)
- [ ] Autenticação segura com JWT
- [ ] Armazenamento de imagens em nuvem (Cloudflare R2 ou AWS S3)
- [ ] Cadastro de novos clientes e usuários pelo sistema
- [ ] Notificações por WhatsApp ou e-mail ao mudar status
- [ ] Relatório de produção em PDF

---

Desenvolvido com React + Vite + Tailwind CSS
