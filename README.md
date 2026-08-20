# 🚀 Digital Service Display — White-Label Multitenant

Plataforma corporativa **White-Label Multitenant** desenvolvida para empresas e prestadores de serviços (engenharia, consultoria, clínicas, escritórios e tecnologia). Construída sobre **Next.js (App Router)**, **PostgreSQL / Supabase (Prisma ORM)** e **Tailwind CSS**, a arquitetura foi desenhada para entrega de alta performance na **Vercel**, SEO técnico automatizado via **Schema.org JSON-LD** e isolamento seguro de tenants por coluna (`tenant_id`).

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) | Server Components, Server Actions e Edge Middleware |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) | Tipagem estrita de ponta a ponta |
| **Estilização & UI** | [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/) | Filosofia Impeccable Design e variáveis CSS dinâmicas por tenant |
| **Banco de Dados** | [PostgreSQL (Supabase)](https://supabase.com/) | Banco relacional com suporte a pooling e conexões diretas |
| **ORM** | [Prisma ORM](https://www.prisma.io/) | Modelagem, migrações tipadas e queries otimizadas |
| **Validação** | [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/) | Validação de formulários e Server Actions |
| **SEO & Metadados** | Dynamic `generateMetadata` + Schema.org JSON-LD | Indexação máxima para busca orgânica e SEO Local |
| **Hospedagem** | [Vercel](https://vercel.com/) | Otimizado para Edge Middleware e Serverless Functions |

---

## 📐 Arquitetura do Sistema

```mermaid
graph TD
    Client[Navegador / Visitante] -->|dallautomacao.com.br / subdomínio| Edge[Vercel Edge Middleware]
    Edge -->|Reescrita Interna| Route[app/[domain]/page.tsx]
    Route -->|Consulta com Cache| TenantLib[lib/tenant.ts]
    TenantLib -->|Prisma Client| Supabase[(Supabase PostgreSQL)]
    Route -->|Injeção de Metadados & Schema| JSONLD[lib/schema.ts]
    Route -->|Renderização Modular| UI[Componentes Públicos]
    
    AdminUser[Administrador] -->|Acesso a /admin| AdminPanel[app/admin]
    AdminPanel -->|Server Actions| AdminActions[app/actions/admin-actions.ts]
    AdminActions -->|CRUD & Toggles| Supabase
```

### 1. Resolução Multitenant na Camada Edge
O arquivo [`middleware.ts`](./middleware.ts) intercepta todas as requisições antes da renderização:
- **Domínio Próprio**: `dallautomacao.com.br` $\rightarrow$ busca por `custom_domain`.
- **Subdomínio da Plataforma**: `dall.plataforma.com.br` $\rightarrow$ busca pelo `slug` `"dall"`.
- **Ambiente Local**: `localhost:3000` $\rightarrow$ carrega o tenant padrão de testes (`dall-automacao`).
- **Painel Administrativo**: requisições para `/admin` são repassadas diretamente.

### 2. Isolamento de Dados por Tenant
Todas as tabelas relacionais (`TenantTheme`, `TenantSettings`, `TenantContent`, `Service`, `Badge`, `Lead`, `FAQ`) são vinculadas ao `tenant_id`, garantindo total segregação de dados.

### 3. Personalização Visual Dinâmica (White-Label)
As cores corporativas (`primary_color`, `secondary_color`) e tipografia são injetadas no [`app/[domain]/layout.tsx`](./app/[domain]/layout.tsx) como variáveis CSS (`--tenant-primary`, `--tenant-secondary`), permitindo que cada empresa tenha sua própria identidade visual sem reescrever estilos.

---

## 📂 Estrutura de Pastas

```bash
digital-service-display/
├── app/
│   ├── [domain]/                # Rotas públicas dinâmicas por tenant
│   │   ├── layout.tsx           # Injeção de variáveis CSS e tipografia do tenant
│   │   ├── page.tsx             # Landing page modular com Schema.org e SEO
│   │   ├── robots.ts            # robots.txt dinâmico por domínio
│   │   └── sitemap.ts           # sitemap.xml dinâmico por domínio
│   ├── actions/                 # Next.js Server Actions
│   │   ├── admin-actions.ts     # Atualização de tema, seções, serviços e leads
│   │   └── lead-actions.ts      # Criação e validação de leads com Zod
│   ├── admin/                   # Painel Administrativo White-Label
│   │   ├── content/             # Gerenciador de textos, slogan, sobre e contato
│   │   ├── leads/               # Pipeline de leads com acionador de WhatsApp
│   │   ├── services/            # CRUD completo de serviços e categorias
│   │   ├── settings/            # Toggles de seções e editor de tema/cores
│   │   ├── layout.tsx           # Layout com Sidebar e dados do tenant
│   │   └── page.tsx             # Dashboard com métricas e últimos contatos
│   ├── globals.css              # Design tokens, Tailwind base e glassmorphism
│   ├── layout.tsx               # Root fallback layout
│   └── page.tsx                 # Página institucional da plataforma SaaS
├── components/
│   └── public/                  # Componentes modulares de alta conversão
│       ├── AboutSection.tsx     # História, anos de atuação e pilares
│       ├── ContactSection.tsx   # Formulário validado e dados de contato
│       ├── CredentialsBar.tsx   # Barra de credenciais (CNPJ, CREA, Normas)
│       ├── DynamicIcon.tsx      # Renderizador dinâmico de ícones Lucide
│       ├── FAQSection.tsx       # Acordeão interativo de dúvidas técnicas
│       ├── FloatingWhatsApp.tsx # Botão pulsante flutuante para WhatsApp
│       ├── Footer.tsx           # Rodapé corporativo completo com dados legais
│       ├── Header.tsx           # Navegação responsiva com glassmorphism
│       ├── HeroSection.tsx      # Banner principal com tipografia de impacto
│       ├── MissionSection.tsx   # Missão, visão e valores
│       └── ServicesSection.tsx  # Catálogo com abas de categorias e cotação
├── lib/
│   ├── prisma.ts                # Instância singleton do PrismaClient
│   ├── schema.ts                # Gerador dinâmico de JSON-LD Schema.org
│   ├── tenant.ts                # Consultas de tenant com tipagem completa
│   └── utils.ts                 # Formatadores de telefone, CNPJ e links de WhatsApp
├── prisma/
│   ├── schema.prisma            # Modelagem completa do banco de dados
│   └── seed.ts                  # Seed de teste com dados reais (D'All Engenharia)
├── middleware.ts                # Resolução de subdomínios e domínios próprios
├── tailwind.config.ts           # Configuração de temas e variáveis CSS
└── package.json                 # Dependências e scripts
```

---

## ⚡ Guia de Instalação e Execução Local

### 1. Clonar o repositório e instalar dependências
```bash
git clone <url-do-repositorio>
cd digital-service-display
npm install
```

### 2. Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
```env
# Conexão com Supabase / PostgreSQL
DATABASE_URL="postgresql://postgres:[SENHA]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:[SENHA]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

# Domínio Raiz da Plataforma
NEXT_PUBLIC_ROOT_DOMAIN="localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Sincronizar o Schema com o Banco de Dados
```bash
# Envia a estrutura de tabelas para o Supabase
npx prisma db push

# Executa o seed com o cliente de teste "D'All Engenharia e Automação"
npm run prisma:seed
```

### 4. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

### 5. Acessar as rotas
- **Página Pública do Tenant (D'All Engenharia)**: `http://localhost:3000` ou `http://dall.localhost:3000`
- **Painel Administrativo**: `http://localhost:3000/admin`
- **Configuração de Seções & Tema**: `http://localhost:3000/admin/settings`
- **Catálogo de Serviços**: `http://localhost:3000/admin/services`
- **Gestão de Leads**: `http://localhost:3000/admin/leads`
- **Sitemap XML**: `http://localhost:3000/sitemap.xml`
- **Robots TXT**: `http://localhost:3000/robots.txt`

---

## 🏢 Cliente de Teste Inicial (Seed)

O script [`prisma/seed.ts`](./prisma/seed.ts) popula automaticamente o banco de dados com os dados corporativos:

- **Empresa**: D'All Engenharia e Automação
- **Slogan**: *"Onde há energia, há evolução"*
- **Contato**: (47) 99752-1721 | `dall.engenharias@gmail.com`
- **Endereço**: Rua dos Caruaras, 479 - Comasa, Joinville (SC) - CEP 89228-000
- **Documentos**: CNPJ 55.934.680/0001-02 | CREA-SC 223232-2
- **Categorias & Serviços**:
  - *Engenharia & Infraestrutura Elétrica*: Projetos em Baixa/Média Tensão, Montagem de Painéis (QGBT/CCM), Laudos SPDA e Eficiência Energética.
  - *Automação & Controle Inteligente*: Automação Residencial (Alexa/Google Home), Automação Industrial (CLP/SCADA), Adequação NR10/NBR 5410.

---

## 🌐 Deploy na Vercel

1. Suba o código para o GitHub/GitLab.
2. Importe o repositório na **Vercel**.
3. Adicione as variáveis de ambiente:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_ROOT_DOMAIN` (ex: `seudominio.com.br`)
4. Para configurar domínios próprios para clientes (ex: `dallautomacao.com.br`):
   - Adicione o domínio no painel de **Domains** da Vercel.
   - Aponte o registro `CNAME` ou `A` no DNS do cliente para a Vercel.
   - O `middleware.ts` reconhecerá automaticamente o hostname e servirá o tenant correspondente.

---

## 📄 Licença
Este projeto é distribuído sob licença proprietária para uso em soluções corporativas White-Label.
