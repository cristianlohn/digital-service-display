# 📋 Prompt Mestre para Implantação de Novos Clientes (White-Label)

Utilize o prompt estruturado abaixo sempre que for cadastrar ou implantar um novo cliente no sistema. Basta preencher as informações entre colchetes `[...]` e enviar para a IA gerar automaticamente o script de seed ou a inserção no banco de dados.

---

```markdown
Atue como Desenvolvedor Full Stack Sênior especializado em Next.js, Prisma ORM e PostgreSQL.

Preciso cadastrar um novo cliente na plataforma White-Label Multitenant (Digital Service Display).

Gere o código TypeScript do script de seed (ou inserção via Prisma) para incluir este novo cliente mantendo a estrutura relacional do `schema.prisma` (Tenant, TenantTheme, TenantSettings, TenantContent, SEOConfig, Badges, ServiceCategory, Service, FAQ e Testimonial).

---

### 1. DADOS DA EMPRESA
- **Nome da Empresa**: [Ex: D'All Engenharia e Automação]
- **Slug do Subdomínio**: [Ex: dall-automacao]
- **Domínio Próprio (Opcional)**: [Ex: dallautomacao.com.br]
- **Segmento / Tipo de Negócio (Schema.org)**: [Ex: ProfessionalService / HomeAndConstructionBusiness / LegalService / MedicalBusiness / LocalBusiness]

---

### 2. IDENTIDADE VISUAL & TEMA
- **Cor Primária (Hex)**: [Ex: #0B192C]
- **Cor Secundária / Destaque (Hex)**: [Ex: #FF6500]
- **Família Tipográfica**: [Ex: Inter / Roboto / Outfit / Montserrat]
- **URL da Logomarca (PNG transparente ou SVG)**: [Ex: https://...]
- **URL do Favicon**: [Ex: /favicon.ico]

---

### 3. CONTATO & DADOS LEGAIS
- **WhatsApp Comercial (apenas números com DDI/DDD)**: [Ex: 5547997521721]
- **Telefone Fixo / Comercial**: [Ex: (47) 3433-0000]
- **E-mail de Contato**: [Ex: contato@empresa.com.br]
- **Logradouro e Número**: [Ex: Rua dos Caruaras, 479]
- **Bairro**: [Ex: Comasa]
- **Cidade e UF**: [Ex: Joinville - SC]
- **CEP**: [Ex: 89228-000]
- **CNPJ**: [Ex: 55.934.680/0001-02]
- **Registro Profissional (CREA, CRM, OAB, CRC, etc.)**: [Ex: CREA-SC 223232-2]
- **Horário de Funcionamento**: [Ex: Segunda a Sexta: 08h às 18h]
- **Link do Google Maps**: [Ex: https://maps.google.com/?q=...]

---

### 4. TEXTOS & CONTEÚDO DA LANDING PAGE
- **Slogan / Título do Hero**: [Ex: Onde há energia, há evolução]
- **Subtítulo do Hero**: [Ex: Engenharia elétrica de alta precisão, montagem de painéis e automação industrial.]
- **Texto Botão CTA Principal**: [Ex: Solicitar Orçamento Técnico]
- **Texto Botão WhatsApp**: [Ex: Conversar com Especialista]
- **URL Imagem Hero**: [Ex: https://images.unsplash.com/...]

- **Tag / Badge Sobre**: [Ex: Quem Somos]
- **Título da Seção Sobre**: [Ex: Soluções completas em Engenharia Elétrica]
- **Ano de Fundação**: [Ex: 2020]
- **Descrição Completa Sobre a Empresa**: [Ex: A nossa empresa é referência em...]
- **URL Imagem Sobre**: [Ex: https://images.unsplash.com/...]

- **Missão**: [Ex: Entregar projetos com máximo rigor técnico e segurança.]
- **Visão**: [Ex: Ser referência em engenharia e automação no estado.]
- **Valores (lista)**:
  1. [Ex: Rigor Técnico e Normativo]
  2. [Ex: Segurança Inegociável]
  3. [Ex: Transparência e Pontualidade]

---

### 5. BADGES & CREDENCIAIS DE AUTORIDADE
1. [Rótulo: "Registro Técnico" | Valor: "CREA-SC 223232-2" | Ícone: "Award"]
2. [Rótulo: "Cadastro Nacional" | Valor: "CNPJ 55.934.680/0001-02" | Ícone: "ShieldCheck"]
3. [Rótulo: "Normas Atendidas" | Valor: "NBR 5410 & NR10" | Ícone: "FileCheck2"]
4. [Rótulo: "Atendimento" | Valor: "Industrial e Comercial" | Ícone: "CheckCircle2"]

---

### 6. CATEGORIAS & CATÁLOGO DE SERVIÇOS
- **Categoria 1**: [Ex: Engenharia & Infraestrutura Elétrica]
  - **Serviço 1.1**:
    - Título: [Ex: Projetos Elétricos em Baixa e Média Tensão]
    - Resumo (Card): [Ex: Dimensionamento e projetos executivos conforme NBR 5410.]
    - Detalhes Completos: [Ex: Inclui diagramas unifilares, cálculo de demanda e ART.]
    - Ícone Lucide: [Ex: Zap]
    - Destaque: [Sim/Não]
  - **Serviço 1.2**:
    - Título: [Ex: Montagem de Painéis Elétricos]
    - Resumo (Card): [Ex: Fabricação de quadros de comando e CCM conforme NR10.]
    - Detalhes Completos: [Ex: Componentes homologados e barramentos dimensionados.]
    - Ícone Lucide: [Ex: Cpu]
    - Destaque: [Sim/Não]

- **Categoria 2**: [Ex: Automação & Controle]
  - **Serviço 2.1**:
    - Título: [Ex: Automação Residencial e Predial]
    - Resumo (Card): [Ex: Controle inteligente de iluminação com Alexa e Google Home.]
    - Detalhes Completos: [Ex: Crie rotinas personalizadas e reduza o consumo.]
    - Ícone Lucide: [Ex: Home]
    - Destaque: [Sim/Não]

---

### 7. PERGUNTAS FREQUENTES (FAQ)
1. **P**: [Ex: A empresa emite ART do CREA?]
   **R**: [Ex: Sim, todos os nossos serviços possuem emissão de ART registrada.]
2. **P**: [Ex: Como solicito uma visita técnica?]
   **R**: [Ex: Basta clicar no botão de WhatsApp ou preencher o formulário no site.]

---

### 8. DEPOIMENTOS DE CLIENTES
1. **Autor**: [Ex: Carlos Eduardo Silva]
   **Cargo / Empresa**: [Ex: Gerente de Manutenção - Indústria XYZ]
   **Comentário**: [Ex: Trabalho impecável na montagem dos nossos painéis.]
   **Avaliação**: [5 estrelas]

---

### 9. CONFIGURAÇÃO DE SEO
- **Meta Title**: [Ex: Nome da Empresa | Serviços em Cidade - UF]
- **Meta Description**: [Ex: Projetos elétricos, laudos e automação em Joinville e região...]
- **Palavras-chave**: [engenharia joinville, automação residencial sc, laudo spda]

---

### 10. USUÁRIO GESTOR DO CLIENTE (PAINEL ADMIN)
- **Nome do Gestor**: [Ex: João da Silva]
- **E-mail de Login**: [Ex: contato@empresa.com.br]
- **Senha Inicial**: [Ex: Empresa@2024]
- **Nível de Acesso**: [Gestor de Empresa / TENANT_ADMIN]
```

---

## 🛠️ Como Cadastrar os Usuários das Novas Empresas

Você tem **2 formas simples** de cadastrar gestores:

### Opção 1: Diretamente pelo Painel Administrativo (Recomendado)
1. Acesse [`/admin/users`](https://www.catuto.com.br/admin/users) logado com o **Super Admin** (`admin@catuto.com.br`).
2. Preencha o Nome, E-mail, Senha e selecione a **Empresa Vinculada**.
3. Clique em **Cadastrar Usuário**. O cliente já poderá fazer login e gerenciar apenas o site dele!

### Opção 2: Via Script de Seed Automatizado
No script `prisma/seed-[cliente].ts`, inclua a criação com hash seguro:
```typescript
const salt = await bcrypt.genSalt(10);
await prisma.adminUser.upsert({
  where: { email: "contato@novocliente.com.br" },
  update: {
    name: "Gestor Novo Cliente",
    password_hash: await bcrypt.hash("Cliente@2024", salt),
    role: "TENANT_ADMIN",
    tenant_id: tenant.id,
  },
  create: {
    name: "Gestor Novo Cliente",
    email: "contato@novocliente.com.br",
    password_hash: await bcrypt.hash("Cliente@2024", salt),
    role: "TENANT_ADMIN",
    tenant_id: tenant.id,
  },
});
```
