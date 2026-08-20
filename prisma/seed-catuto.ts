import { PrismaClient, TenantStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedCatuto() {
  console.log("🌱 Cadastrando/Atualizando tenant: Catuto Soluções Digitais...");

  // Remove tenant anterior com mesmo slug para recriação limpa
  const existingTenant = await prisma.tenant.findUnique({
    where: { slug: "catuto" },
  });

  if (existingTenant) {
    console.log("🧹 Atualizando tenant existente...");
    await prisma.tenant.delete({
      where: { id: existingTenant.id },
    });
  }

  // 1. Criação do Tenant com dados completos
  const tenant = await prisma.tenant.create({
    data: {
      slug: "catuto",
      name: "Catuto Soluções Digitais",
      custom_domain: "catuto.com.br",
      status: TenantStatus.ACTIVE,

      // Identidade Visual & Tema
      theme: {
        create: {
          primary_color: "#121212",
          secondary_color: "#00FF41",
          font_family: "Montserrat",
          logo_url: "/logo-catuto.svg",
          favicon_url: "/logo-catuto.svg",
          dark_mode_enabled: true,
        },
      },

      // Seções Ativas
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
          show_map: false,
          show_footer: true,
        },
      },

      // Textos & Conteúdo
      content: {
        create: {
          hero_title: "Sua estrutura sólida no digital",
          hero_subtitle: "A estrutura que o seu negócio precisa para flutuar no oceano digital.",
          cta_primary_text: "Solicitar Orçamento",
          cta_primary_link: "#contato",
          cta_whatsapp_text: "Conversar com Especialista",
          hero_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&auto=format&fit=crop&q=80",

          about_badge_text: "Quem Somos",
          about_title: "CATUTO Soluções Digitais: Sua Base no Digital",
          about_description: "A CATUTO é uma pequena empresa focada em transformar a presença digital de empreendedores e pequenas empresas. Nós criamos websites profissionais, modernos e de alta performance que servem como a base sólida para o crescimento do seu negócio online, permitindo que você navegue com segurança e eficiência no mercado digital turbulento.",
          founded_year: 2024,
          about_image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",

          mission_text: "Criar websites profissionais e funcionais que funcionem como ativos de crescimento e autoridade para nossos clientes no digital.",
          vision_text: "Ser reconhecida como a principal referência em agilidade e design técnico na criação de presença digital para empreendedores no Brasil.",
          values: [
            "Transparência Total (Comunicação Clara)",
            "Agilidade na Entrega e Processos",
            "Excelência Técnica (Velocidade e Segurança)",
            "Parceria com o Cliente (Foco no Resultado)",
          ],

          phone: null,
          whatsapp_number: "5547996348698",
          email: "cristian@catuto.com.br",
          address_street: "Rua dos Caruaras",
          address_number: "479",
          address_neighborhood: "Comasa",
          address_city: "Joinville",
          address_state: "SC",
          address_zip: "89228-000",
          cnpj: "55.934.680/0001-02",
          professional_register: "Soluções Web & Performance",
          google_maps_url: null,
          working_hours: "Segunda a Sexta: 08h às 18h | Atendimento Online em Todo o Brasil",
          instagram_url: "https://instagram.com/catuto.solucoes",
          linkedin_url: "https://linkedin.com/company/catuto",
        },
      },

      // SEO & Schema.org
      seo_config: {
        create: {
          meta_title: "CATUTO Soluções Digitais | Websites Profissionais e Performance no Brasil",
          meta_description: "Criação de websites profissionais, landing pages de alta conversão e otimização de performance em Joinville e região. Sua base sólida no digital.",
          keywords: [
            "criação de sites joinville",
            "web design brasil",
            "landing page alta conversão",
            "otimização velocidade site",
            "desenvolvimento web profissional",
            "sites para pequenas empresas",
          ],
          canonical_url: "https://catuto.com.br",
          og_image_url: "/logo-catuto.svg",
          schema_business_type: "ProfessionalService",
        },
      },

      // Badges de Autoridade
      badges: {
        create: [
          { label: "Especialidade", value: "Websites de Alta Performance", icon_name: "Globe", order: 1 },
          { label: "Cadastro Nacional", value: "CNPJ 55.934.680/0001-02", icon_name: "ShieldCheck", order: 2 },
          { label: "Atendimento", value: "B2B e Pequenas Empresas", icon_name: "Users", order: 3 },
          { label: "Certificação", value: "Google Performance Ready", icon_name: "Zap", order: 4 },
        ],
      },

      // FAQs
      faqs: {
        create: [
          {
            question: "Quanto tempo demora para criar um site?",
            answer: "O prazo médio é de 15 a 30 dias para um site institucional, dependendo da complexidade. Landing pages podem ser entregues em até 7 dias úteis.",
            order: 1,
          },
          {
            question: "Eu mesmo posso atualizar o conteúdo do meu site?",
            answer: "Sim! Todos os nossos websites são entregues com um painel de controle (CMS) intuitivo e um treinamento básico para você fazer alterações de forma independente e rápida.",
            order: 2,
          },
          {
            question: "O site é otimizado para celulares e mecanismos de busca (Google)?",
            answer: "Sim, todos os projetos são desenvolvidos com arquitetura Mobile-First, SEO técnico estruturado (Schema.org) e alta pontuação no Google PageSpeed Insights.",
            order: 3,
          },
        ],
      },

      // Depoimentos
      testimonials: {
        create: [
          {
            author_name: "Cristina Santos",
            role_or_company: "Empreendedora - Loja Criativa",
            content: "Meu antigo site era lento e não me trazia clientes. A CATUTO remodelou tudo e agora tenho uma presença profissional que orgulha o meu negócio.",
            rating: 5,
            order: 1,
          },
        ],
      },
    },
  });

  // 2. Categorias e Serviços
  const catWebsites = await prisma.serviceCategory.create({
    data: {
      tenant_id: tenant.id,
      name: "Criação de Websites & Landing Pages",
      order: 1,
    },
  });

  const catPerformance = await prisma.serviceCategory.create({
    data: {
      tenant_id: tenant.id,
      name: "Manutenção & Performance",
      order: 2,
    },
  });

  // Serviços da Categoria 1
  await prisma.service.createMany({
    data: [
      {
        tenant_id: tenant.id,
        category_id: catWebsites.id,
        title: "Desenvolvimento de Websites Institucionais",
        short_description: "Sua empresa profissional na internet, com design exclusivo e fácil de gerenciar.",
        full_description: "Sites de múltiplas páginas com blog, painel de controle intuitivo, e-mails profissionais e otimização para todos os dispositivos móveis.",
        icon_name: "Globe",
        is_featured: true,
        order: 1,
      },
      {
        tenant_id: tenant.id,
        category_id: catWebsites.id,
        title: "Landing Pages de Alta Conversão",
        short_description: "Páginas de vendas e captura de leads focadas em gerar resultados para campanhas.",
        full_description: "Páginas de navegação única (one-page), design persuasivo, formulários inteligentes e integração com CRMs e WhatsApp.",
        icon_name: "Zap",
        is_featured: false,
        order: 2,
      },
    ],
  });

  // Serviços da Categoria 2
  await prisma.service.createMany({
    data: [
      {
        tenant_id: tenant.id,
        category_id: catPerformance.id,
        title: "Otimização de Velocidade (WPO)",
        short_description: "Deixamos seu site existente mais rápido, melhorando a experiência do usuário.",
        full_description: "Melhoria no tempo de carregamento para dispositivos móveis, pontuação alta nos Core Web Vitals do Google e compressão avançada de recursos.",
        icon_name: "Activity",
        is_featured: true,
        order: 1,
      },
    ],
  });

  console.log(`✅ Tenant cadastrado com sucesso: ${tenant.name} (Slug: ${tenant.slug})`);
  console.log(`🚀 Custom Domain: ${tenant.custom_domain}`);
}

async function main() {
  try {
    await seedCatuto();
  } catch (error) {
    console.error("❌ Erro ao cadastrar tenant:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
