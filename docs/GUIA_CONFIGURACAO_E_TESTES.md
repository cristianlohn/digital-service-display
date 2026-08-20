# 🛠️ Guia Completo: Configuração do Supabase, Testes Locais e Deploy Gratuito na Vercel

Este guia detalha o passo a passo para colocar o banco de dados real no **Supabase**, rodar os testes localmente e publicar na **Vercel** usando a URL gratuita (`.vercel.app`), preparando o terreno para apontar o domínio definitivo posteriormente.

---

## 1. Configurar o Banco de Dados no Supabase (PostgreSQL Gratuito)

1. Acesse [supabase.com](https://supabase.com) e faça login (ou crie uma conta gratuita).
2. Clique em **"New Project"**.
3. Preencha:
   - **Name**: `digital-service-display`
   - **Database Password**: Defina uma senha forte e anote-a.
   - **Region**: `South America (São Paulo)` para menor latência.
4. Após a criação do projeto (leva cerca de 1 a 2 minutos), vá em:
   - **Project Settings** (ícone de engrenagem) $\rightarrow$ **Database**.
5. Role até a seção **Connection string** e selecione a aba **URI**:
   - **Transaction Pooler (Modo Pooled - Porta 6543)**:
     ```
     postgresql://postgres.[PROJECT-REF]:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - **Direct Connection (Modo Direto - Porta 5432)**:
     ```
     postgresql://postgres.[PROJECT-REF]:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
     ```

---

## 2. Configurar o `.env` no Projeto Local

Na pasta raiz do projeto (`c:/repo/digital-service-display`), crie o arquivo `.env` com suas credenciais:

```env
# URL de conexão com Pooling (para Serverless da Vercel)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# URL de conexão direta (usada pelo Prisma para rodar migrations e seed)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# Domínio raiz para ambiente de desenvolvimento
NEXT_PUBLIC_ROOT_DOMAIN="localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

NODE_ENV="development"
```

---

## 3. Criar as Tabelas e Rodar o Seed Real

No terminal, dentro de `c:/repo/digital-service-display`:

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Gerar os clientes tipados do Prisma
npx prisma generate

# 3. Enviar as tabelas para o Supabase
npx prisma db push

# 4. Inserir o primeiro cliente de teste real (D'All Engenharia)
npm run prisma:seed
```

Você verá a confirmação no terminal:
```bash
✅ Tenant criado com sucesso: D'All Engenharia e Automação (Slug: dall-automacao)
🚀 Custom Domain: dallautomacao.com.br
```

---

## 4. Testar Localmente

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Abra seu navegador:
- **Página Pública do Cliente (D'All Engenharia)**: [http://localhost:3000](http://localhost:3000)
- **Painel Administrativo**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Configuração de Seções & Cores**: [http://localhost:3000/admin/settings](http://localhost:3000/admin/settings)
- **Catálogo de Serviços**: [http://localhost:3000/admin/services](http://localhost:3000/admin/services)
- **Gestão de Leads**: [http://localhost:3000/admin/leads](http://localhost:3000/admin/leads)

---

## 5. Deploy Gratuito na Vercel (`.vercel.app`)

1. Crie um repositório no seu GitHub/GitLab e envie o código:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit white-label multitenant"
   git remote add origin https://github.com/SEU-USUARIO/digital-service-display.git
   git push -u origin main
   ```

2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New..."** $\rightarrow$ **"Project"**.
3. Selecione o repositório `digital-service-display`.
4. Em **Environment Variables**, adicione:
   - `DATABASE_URL`: *(sua URL do Supabase com pooling)*
   - `DIRECT_URL`: *(sua URL do Supabase direta)*
   - `NEXT_PUBLIC_ROOT_DOMAIN`: `seu-projeto.vercel.app`
5. Clique em **Deploy**.

Ao término do deploy, você terá uma URL pública gratuita (ex: `https://digital-service-display.vercel.app`).
O sistema foi configurado para exibir automaticamente o cliente de demonstração mesmo em URLs da Vercel!

---

## 6. Como Ativar o Domínio Oficial do Cliente (Após Aprovação)

Quando o cliente aprovar e for hora de colocar no ar em `dallautomacao.com.br`:

1. No painel do projeto na **Vercel**:
   - Vá em **Settings** $\rightarrow$ **Domains**.
   - Digite `dallautomacao.com.br` e `www.dallautomacao.com.br`.
   - A Vercel exibirá os registros de DNS para apontar no Registro.br ou Cloudflare:
     - **Tipo A**: `@` $\rightarrow$ `76.76.21.21`
     - **Tipo CNAME**: `www` $\rightarrow$ `cname.vercel-dns.com`
2. No painel `/admin` ou no Supabase:
   - Certifique-se de que o campo `custom_domain` na tabela `tenants` esteja preenchido com `dallautomacao.com.br`.
3. Pronto! O Next.js Edge Middleware fará o roteamento automático do domínio próprio para o site do cliente sem necessidade de mexer em código.
