# Documentação Completa: Site de Buffet com Painel Administrativo

## 📋 Visão Geral do Projeto

Este projeto consiste em um **site público totalmente dinâmico** para um serviço de buffet e um **painel administrativo integrado** para gerenciar todo o seu conteúdo. O sistema foi construído com HTML, CSS (Tailwind CSS) e JavaScript puro, utilizando o **Supabase** como backend para banco de dados, autenticação e armazenamento de arquivos.

### 🎯 Objetivo Principal
Permitir que o administrador do site tenha **controle total sobre o conteúdo** (textos, imagens, cores, etc.) sem precisar de conhecimento técnico ou editar o código-fonte.

---

## 👤 1. Para o Administrador do Site (Guia de Uso do Painel)

Este guia explica como usar o painel administrativo para atualizar o conteúdo do seu site.

### 🔐 1.1. Acesso ao Painel

#### Como Acessar
1. **Acesse o Link de Login**: Navegue até o rodapé do seu site e clique no ícone de login discreto no canto inferior direito
2. **Acesso Direto**: Alternativamente, acesse diretamente a URL `www.seusite.com.br/admin/login.html`
3. **Faça o Login**: Insira o email e a senha de administrador cadastrados no Supabase

### 🎛️ 1.2. Seções do Painel

Após o login, você verá uma barra lateral com as seguintes seções:

#### 🎨 a) Configurações Gerais
**Esta é a seção mais importante**, pois controla a aparência e as informações globais do site.

##### Identidade do Site
- **Nome do Site**: O nome que aparece no topo e na aba do navegador
- **Logotipo**: Envie um arquivo de imagem (PNG, SVG) para ser seu logotipo oficial
- **Ícone de Fallback**: Caso o logotipo não seja enviado, este ícone (do Lucide Icons) será usado

##### Aparência e Cores
- **Cor Principal/Botões**: Clique na caixa de cor para selecionar as cores que combinam com sua marca
- **Fonte**: Digite o nome de uma fonte do Google Fonts (ex: `Roboto`, `Montserrat`) para alterar a tipografia de todo o site

##### Seção Principal (Hero)
- **Imagem Principal**: A imagem de fundo do topo do site
- **Título e Subtítulo**: Os textos que aparecem sobre a imagem principal

##### Seção "Sobre Nós"
- Edite o título, os parágrafos de descrição e a imagem desta seção

##### Rodapé, Contato e Redes Sociais
- Preencha os campos de contato e as URLs completas das suas redes sociais
- **Nota**: Se um campo for deixado em branco, o link correspondente não aparecerá no site

> ⚠️ **Importante**: Sempre clique no botão **"Salvar Alterações"** no final da página para que suas mudanças sejam aplicadas.

#### 🛎️ b) Gerenciar Serviços
Aqui você pode listar os tipos de eventos que seu buffet atende.

- **Adicionar**: Clique em "Adicionar Serviço", preencha o título, a descrição e o nome de um ícone do Lucide e salve
- **Editar/Excluir**: Use os botões na tabela para modificar ou remover um serviço existente

#### 🖼️ c) Gerenciar Galeria
Controle todas as imagens que aparecem na página "Galeria" e nos carrosséis.

- **Adicionar**: Clique em "Adicionar Imagem", selecione um arquivo, dê uma descrição (importante para acessibilidade) e defina uma categoria (ex: "Casamentos", "Decoração")
- **Excluir**: Passe o mouse sobre uma imagem e clique no ícone de lixeira para removê-la

#### 💬 d) Gerenciar Depoimentos
Adicione comentários de clientes para dar mais credibilidade ao seu serviço.

- **Adicionar**: Clique em "Adicionar Depoimento", preencha o nome do autor, o texto e a fonte (ex: "Instagram", "Cliente de Casamento")
- **Editar/Excluir**: Use os botões na tabela para gerenciar os depoimentos

---

## 👨‍💻 2. Para o Desenvolvedor (Documentação Técnica)

### ⚙️ 2.1. Tecnologias Utilizadas

#### Frontend
- **HTML5, CSS3, JavaScript** (ES6 Modules)
- **Estilização**: Tailwind CSS (via CDN)
- **Ícones**: Lucide Icons (via CDN)

#### Backend (BaaS)
- **Supabase**
  - **Banco de Dados**: PostgreSQL
  - **Autenticação**: Supabase Auth
  - **Armazenamento de Arquivos**: Supabase Storage

### 📁 2.2. Estrutura de Arquivos

O projeto é dividido em duas partes principais: o **site público** (na raiz) e o **painel administrativo** (na pasta `/admin`).

```
/
├── admin/                # Painel Administrativo
│   ├── pages/           # Lógica de cada página do painel (config, servicos, etc.)
│   ├── client.js        # Cliente Supabase do painel
│   ├── dashboard.js     # Roteador e lógica principal do painel
│   ├── login.js         # Lógica da página de login
│   ├── index.html       # Estrutura principal do painel (Dashboard)
│   └── login.html       # Página de login
│
├── js/                  # Site Público
│   ├── components/      # Módulos que geram o HTML de cada seção
│   ├── client.js        # Cliente Supabase do site público
│   └── main.js          # Orquestrador principal do site (busca dados, roteia)
│
├── css/
│   └── style.css
│
└── index.html           # Estrutura principal do site público
```

### 🔄 2.3. Fluxo de Dados

#### Site Público (`main.js`)
1. **Inicialização**: Ao carregar, a função `initializeApp` é chamada
2. **Busca de Dados**: `fetchAllData` faz chamadas paralelas ao Supabase para buscar todos os dados necessários (config, serviços, galeria, etc.)
3. **Configuração do Router**: `setupRouter` recebe esses dados, injeta os estilos dinâmicos (cores, fontes) no `<head>` e monta o layout principal (Navbar e Footer)
4. **Renderização**: O router interno renderiza o conteúdo da página atual (ex: `#inicio`) e inicia os carrosséis, se aplicável

#### Painel Admin (`dashboard.js`)
1. **Verificação de Sessão**: Verifica a sessão do usuário. Se não houver, redireciona para `login.html`
2. **Roteamento**: Funciona como um roteador, carregando o módulo da página solicitada (ex: `renderConfigPage` de `config.js`)
3. **CRUD Operations**: Cada módulo de página (`config.js`, `servicos.js`, etc.) é responsável por seu próprio CRUD, comunicando-se com o Supabase para ler e escrever dados

### 🚀 2.4. Como Estender o Projeto

Para adicionar uma nova página ao site público (ex: "Parceiros"):

#### 1. Banco de Dados
- Crie uma nova tabela `parceiros` no Supabase

#### 2. Painel Admin
- Crie `admin/pages/parceiros.js` com a lógica CRUD
- Adicione o link no `admin/index.html` e a rota no `admin/dashboard.js`

#### 3. Site Público
- Crie `js/components/PartnersSection.js` para renderizar o HTML
- Em `js/main.js`, adicione:
  - A busca dos dados de parceiros em `fetchAllData`
  - A nova rota em `setupRouter`

---

## 📚 Recursos Adicionais

### 🔗 Links Úteis
- [Documentação do Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [Google Fonts](https://fonts.google.com/)

### 🆘 Solução de Problemas
- **Site não carrega**: Verifique a conexão com o Supabase
- **Imagens não aparecem**: Verifique as permissões do Storage
- **Login não funciona**: Verifique as credenciais no Supabase Auth

### 🔒 Segurança
- Mantenha as credenciais do Supabase seguras
- Configure adequadamente as RLS (Row Level Security) policies
- Faça backups regulares dos dados

---

*Documentação criada para facilitar o uso e manutenção do sistema de buffet dinâmico.*