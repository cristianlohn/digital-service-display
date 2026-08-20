import { PrismaClient, TenantStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados multitenant...");

  // Limpeza prévia para o tenant de teste
  const existingTenant = await prisma.tenant.findUnique({
    where: { slug: "dall-automacao" },
  });

  if (existingTenant) {
    console.log("🧹 Removendo tenant de teste anterior...");
    await prisma.tenant.delete({
      where: { id: existingTenant.id },
    });
  }

  // 1. Criação do Tenant com dados institucionais, tema, configurações e badges
  const tenant = await prisma.tenant.create({
    data: {
      slug: "dall-automacao",
      name: "D'All Engenharia e Automação",
      custom_domain: "dallautomacao.com.br",
      status: TenantStatus.ACTIVE,

      // Tema Visual
      theme: {
        create: {
          primary_color: "#0B192C",
          secondary_color: "#FF6500",
          font_family: "Inter",
          logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
          favicon_url: "/favicon.ico",
          dark_mode_enabled: false,
        },
      },

      // Toggles de Seções
      settings: {
        create: {
          show_hero: true,
          show_about: true,
          show_mission: true,
          show_services: true,
          show_badges: true,
          show_faq: true,
          show_testimonials: true,
          show_contact_form: true,
          show_map: true,
          show_footer: true,
        },
      },

      // Conteúdo Completo e Dados Legais
      content: {
        create: {
          hero_title: "Onde há energia, há evolução.",
          hero_subtitle: "Engenharia elétrica de alta precisão, montagem de painéis, automação predial e industrial inteligente em conformidade com as normas NR10 e NBR 5410.",
          cta_primary_text: "Solicitar Orçamento Técnico",
          cta_primary_link: "#contato",
          cta_whatsapp_text: "Conversar com Engenheiro",
          hero_image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",

          about_badge_text: "Excelência Técnica em SC",
          about_title: "Soluções completas em Engenharia Elétrica e Automação",
          about_description: "A D'All Engenharia e Automação é referência em Joinville e região na concepção e execução de projetos elétricos industriais, comerciais e residenciais. Nossa equipe técnica é habilitada e comprometida em transformar infraestruturas elétricas em sistemas eficientes, seguros e preparados para o futuro, aliando engenharia de ponta com automação inteligente.",
          founded_year: 2020,
          about_image_url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",

          mission_text: "Entregar projetos e instalações elétricas com o mais alto rigor técnico, eficiência energética e segurança operacional, superando as expectativas dos nossos clientes.",
          vision_text: "Ser a empresa de engenharia e automação mais confiável e inovadora de Santa Catarina, reconhecida pela excelência e confiabilidade de cada entrega.",
          values: [
            "Rigor Técnico e Normativo (NR10 / NBR 5410)",
            "Segurança Inegociável",
            "Inovação Contínua em Automação",
            "Eficiência Energética e Sustentabilidade",
            "Transparência e Pontualidade",
          ],

          phone: "(47) 99752-1721",
          whatsapp_number: "5547997521721",
          email: "dall.engenharias@gmail.com",
          address_street: "Rua dos Caruaras",
          address_number: "479",
          address_neighborhood: "Comasa",
          address_city: "Joinville",
          address_state: "SC",
          address_zip: "89228-000",
          cnpj: "55.934.680/0001-02",
          professional_register: "CREA-SC 223232-2",
          google_maps_url: "https://maps.google.com/?q=Rua+dos+Caruaras+479+Joinville+SC",
          working_hours: "Segunda a Sexta: 07h30 às 18h00 | Atendimento de Emergência Industrial 24h",
        },
      },

      // Configuração SEO & Schema.org
      seo_config: {
        create: {
          meta_title: "D'All Engenharia e Automação | Projetos Elétricos e Automação em Joinville",
          meta_description: "Projetos elétricos de baixa e média tensão, montagem de painéis, automação residencial e industrial (CLP/SCADA) em Joinville e região. Certificação CREA e normas NR10/NBR 5410.",
          keywords: [
            "engenharia elétrica joinville",
            "automação industrial joinville",
            "montagem de painéis elétricos",
            "projetos elétricos sc",
            "automação residencial alexa",
            "laudo spda joinville",
            "adequação nr10",
          ],
          canonical_url: "https://dallautomacao.com.br",
          og_image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
          schema_business_type: "HomeAndConstructionBusiness",
        },
      },

      // Badges / Credenciais
      badges: {
        create: [
          { label: "Registro Técnico", value: "CREA-SC 223232-2", icon_name: "Award", order: 1 },
          { label: "Cadastro Nacional", value: "CNPJ 55.934.680/0001-02", icon_name: "ShieldCheck", order: 2 },
          { label: "Conformidade Normativa", value: "NBR 5410 & NR10", icon_name: "FileCheck2", order: 3 },
          { label: "Atendimento Especializado", value: "Industrial, Comercial e Residencial", icon_name: "CheckCircle2", order: 4 },
        ],
      },

      // FAQs
      faqs: {
        create: [
          {
            question: "A D'All emite ART (Anotação de Responsabilidade Técnica) do CREA?",
            answer: "Sim! Todos os nossos projetos, laudos e instalações contam com emissão de ART pelo CREA-SC, garantindo total respaldo legal e segurança técnica.",
            order: 1,
          },
          {
            question: "Vocês atendem chamados de emergência ou apenas projetos agendados?",
            answer: "Atuamos tanto com projetos planejados e cronogramas de execução quanto com suporte técnico para clientes industriais e comerciais em paradas e manutenções críticas.",
            order: 2,
          },
          {
            question: "Como funciona o orçamento de automação residencial?",
            answer: "Realizamos uma consultoria inicial para entender suas necessidades (iluminação, áudio, segurança, cortinas, climatização) e apresentamos uma proposta modular que pode ser expandida no futuro.",
            order: 3,
          },
          {
            question: "Qual a área de cobertura para atendimento presencial?",
            answer: "Nossa sede é em Joinville/SC, atendendo toda a região Norte Catarinense, Vale do Itajaí, Grande Florianópolis e sob consulta outras regiões do estado.",
            order: 4,
          },
        ],
      },

      // Testimonials
      testimonials: {
        create: [
          {
            author_name: "Carlos Eduardo Silva",
            role_or_company: "Gerente de Manutenção Industrial",
            content: "A reformulação dos nossos painéis elétricos e a implementação do CLP pela equipe da D'All reduziu o tempo de parada da linha em mais de 35%. Trabalho impecável e cumprimento rigoroso dos prazos.",
            rating: 5,
            order: 1,
          },
          {
            author_name: "Mariana Albuquerque",
            role_or_company: "Arquiteta de Interiores",
            content: "Parceria nota 10 para automação residencial nos projetos dos meus clientes. A integração de iluminação e climatização com Alexa ficou perfeita e os clientes adoram a facilidade de uso.",
            rating: 5,
            order: 2,
          },
        ],
      },
    },
  });

  // 2. Categorias e Serviços
  const catEletrica = await prisma.serviceCategory.create({
    data: {
      tenant_id: tenant.id,
      name: "Engenharia & Infraestrutura Elétrica",
      order: 1,
    },
  });

  const catAutomacao = await prisma.serviceCategory.create({
    data: {
      tenant_id: tenant.id,
      name: "Automação & Controle Inteligente",
      order: 2,
    },
  });

  await prisma.service.createMany({
    data: [
      {
        tenant_id: tenant.id,
        category_id: catEletrica.id,
        title: "Projetos Elétricos em Baixa e Média Tensão",
        short_description: "Dimensionamento e elaboração de projetos elétricos completos para indústrias, comércios e residências de alto padrão.",
        full_description: "Desenvolvemos projetos elétricos executivos completos respeitando rigorosamente a NBR 5410 e normas da concessionária local (Celesc). Inclui diagramas unifilares, cálculo de demanda, dimensionamento de condutores e proteções.",
        icon_name: "Zap",
        order: 1,
        is_featured: true,
      },
      {
        tenant_id: tenant.id,
        category_id: catEletrica.id,
        title: "Montagem de Quadros e Painéis Elétricos",
        short_description: "Montagem, parametrização e testes de QGBT, CCMs e quadros de distribuição conforme NR10.",
        full_description: "Construção de painéis elétricos com barramentos dimensionados, componentes homologados das melhores marcas (Schneider, Siemens, WEG) e identificação completa para máxima segurança operacional.",
        icon_name: "Cpu",
        order: 2,
        is_featured: true,
      },
      {
        tenant_id: tenant.id,
        category_id: catEletrica.id,
        title: "Laudos Técnicos, SPDA e Eficiência Energética",
        short_description: "Inspeção com emissão de ART, medição de aterramento e laudos de adequação às normas vigentes.",
        full_description: "Elaboração de laudos de inspeção elétrica, projetos de proteção contra descargas atmosféricas (SPDA - NBR 5419) e consultoria técnica para redução de custos com energia elétrica.",
        icon_name: "FileSpreadsheet",
        order: 3,
        is_featured: false,
      },
      {
        tenant_id: tenant.id,
        category_id: catAutomacao.id,
        title: "Automação Residencial e Predial",
        short_description: "Controle inteligente de iluminação, climatização e acessos integrados com Alexa e Google Home.",
        full_description: "Transformamos residências e edifícios em ambientes inteligentes com controle por voz, smartphones e rotinas automatizadas para conforto, economia e sofisticação.",
        icon_name: "Home",
        order: 1,
        is_featured: true,
      },
      {
        tenant_id: tenant.id,
        category_id: catAutomacao.id,
        title: "Automação Industrial, CLP e Sistemas SCADA",
        short_description: "Programação de controladores lógicos, interfaces IHM e sistemas supervisórios para linhas de produção.",
        full_description: "Soluções completas para automação de processos industriais, telemetria, rastreabilidade e integração de máquinas para ganho de produtividade e redução de paradas.",
        icon_name: "Activity",
        order: 2,
        is_featured: true,
      },
      {
        tenant_id: tenant.id,
        category_id: catAutomacao.id,
        title: "Adequação e Consultoria Normativa (NR10)",
        short_description: "Prontuário das instalações elétricas (PIE), procedimentos de segurança e adequação para auditorias.",
        full_description: "Auditoria in loco das instalações elétricas, organização de prontuários técnicos e adequação integral de segurança para empresas que buscam conformidade com a NR10.",
        icon_name: "ShieldAlert",
        order: 3,
        is_featured: false,
      },
    ],
  });

  console.log(`✅ Tenant criado com sucesso: ${tenant.name} (Slug: ${tenant.slug})`);
  console.log(`🚀 Custom Domain: ${tenant.custom_domain}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
