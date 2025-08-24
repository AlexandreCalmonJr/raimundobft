# Documentação Completa: Site de Buffet com Painel Administrativo

## 📋 Visão Geral do Projeto

Este projeto consiste em um **site público totalmente dinâmico** para um serviço de buffet e um **painel administrativo integrado** para gerenciar todo o seu conteúdo. O sistema foi construído com HTML, CSS (Tailwind CSS) e JavaScript puro, utilizando **Firebase** como backend para banco de dados e autenticação, e **ImgBB** para armazenamento de imagens.

### 🎯 Objetivo Principal
Permitir que o administrador do site tenha **controle total sobre o conteúdo** (textos, imagens, categorias, etc.) sem precisar de conhecimento técnico ou editar o código-fonte.

---

## 👨‍💻 2. Para o Desenvolvedor (Documentação Técnica)

### ⚙️ 2.1. Tecnologias Utilizadas

#### Frontend
- **HTML5, CSS3, JavaScript** (ES6 Modules)
- **Estilização**: Tailwind CSS (via CDN)
- **Ícones**: Lucide Icons (via CDN)

#### Backend (BaaS - Backend as a Service)
- **Firebase**
  - **Banco de Dados**: Firestore
  - **Autenticação**: Firebase Authentication
- **Armazenamento de Imagens**: ImgBB (via API)

### 📁 2.2. Estrutura de Arquivos

O projeto é dividido em duas partes principais: o **site público** (na raiz) e o **painel administrativo** (na pasta `/admin`).

```
/
├── admin/                # Painel Administrativo
│   ├── pages/           # Lógica de cada página do painel (config, servicos, etc.)
│   ├── client.js        # Cliente Firebase do painel
│   ├── dashboard.js     # Roteador e lógica principal do painel
│   ├── login.js         # Lógica da página de login
│   ├── index.html       # Estrutura principal do painel (Dashboard)
│   └── login.html       # Página de login
│
├── js/                  # Site Público
│   ├── components/      # Módulos que geram o HTML de cada seção
│   ├── client.js        # Cliente Firebase do site público
│   └── main.js          # Orquestrador principal do site (busca dados, roteia)
│
├── css/
│   └── style.css
│
└── index.html           # Estrutura principal do site público
```

### 🔄 2.3. Fluxo de Dados

#### Site Público (`main.js`)
1. **Inicialização**: Ao carregar, a função `initializeApp` é chamada.
2. **Busca de Dados**: `fetchAllData` faz chamadas ao Firestore para buscar todos os dados necessários (config, serviços, galeria, etc.) de forma assíncrona.
3. **Renderização**: `setupRouter` recebe esses dados, monta o layout principal (Navbar e Footer) e renderiza o conteúdo da página atual (ex: `#inicio`).

#### Painel Admin (`dashboard.js`)
1. **Verificação de Sessão**: `onAuthStateChanged` do Firebase Auth monitora o estado de login. Se o usuário não estiver autenticado, é redirecionado para `login.html`.
2. **Roteamento**: Funciona como um roteador de página única, carregando o módulo da página solicitada (ex: `renderConfigPage` de `config.js`).
3. **Operações CRUD**: Cada módulo de página (`config.js`, `servicos.js`, etc.) é responsável por seu próprio CRUD, comunicando-se com o Firestore para ler e escrever dados, e com a API do ImgBB para upload de imagens.

---

## 📚 Recursos Adicionais

### 🔗 Links Úteis
- [Documentação do Firebase](https://firebase.google.com/docs)
- [Documentação da API do ImgBB](https://api.imgbb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

### 🔒 Segurança
- **Credenciais**: Mantenha as credenciais do Firebase e a chave de API do ImgBB seguras. Em um ambiente de produção, considere usar variáveis de ambiente.
- **Regras do Firestore**: Configure as [Regras de Segurança do Firestore](https://firebase.google.com/docs/firestore/security/get-started) para permitir escrita apenas por usuários autenticados.
