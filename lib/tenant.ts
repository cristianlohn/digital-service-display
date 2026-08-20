import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type TenantWithRelations = Prisma.TenantGetPayload<{
  include: {
    theme: true;
    settings: true;
    content: true;
    seo_config: true;
    badges: {
      orderBy: { order: "asc" };
    };
    categories: {
      orderBy: { order: "asc" };
      include: {
        services: {
          orderBy: { order: "asc" };
        };
      };
    };
    services: {
      orderBy: { order: "asc" };
      include: {
        category: true;
      };
    };
    faqs: {
      orderBy: { order: "asc" };
    };
    testimonials: {
      orderBy: { order: "asc" };
    };
  };
}>;

export async function getTenantByDomainOrSlug(
  domainOrSlug: string
): Promise<TenantWithRelations | null> {
  // Limpeza de porta ou subdomínio se necessário
  const cleanIdentifier = domainOrSlug.toLowerCase().replace(/:\d+$/, "");

  // Se for localhost ou subdomínio de desenvolvimento
  const isLocal =
    cleanIdentifier === "localhost" ||
    cleanIdentifier.endsWith(".localhost") ||
    cleanIdentifier === "127.0.0.1";

  let slugOrDomain = cleanIdentifier;

  if (isLocal) {
    // Se for subdomínio local como "dall.localhost", extrai "dall"
    if (cleanIdentifier.includes(".localhost")) {
      slugOrDomain = cleanIdentifier.split(".")[0];
    } else {
      // Padrão de teste local se acessado via localhost:3000 diretamente
      slugOrDomain = "dall-automacao";
    }
  }

  // 1. Tenta buscar por Custom Domain ou Slug
  let tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { custom_domain: cleanIdentifier },
        { slug: slugOrDomain },
        { slug: cleanIdentifier },
      ],
      status: "ACTIVE",
    },
    include: {
      theme: true,
      settings: true,
      content: true,
      seo_config: true,
      badges: {
        orderBy: { order: "asc" },
      },
      categories: {
        orderBy: { order: "asc" },
        include: {
          services: {
            orderBy: { order: "asc" },
          },
        },
      },
      services: {
        orderBy: { order: "asc" },
        include: {
          category: true,
        },
      },
      faqs: {
        orderBy: { order: "asc" },
      },
      testimonials: {
        orderBy: { order: "asc" },
      },
    },
  });

  // 2. Fallback de segurança para demonstração em URLs temporárias (ex: Vercel Preview)
  if (!tenant) {
    tenant = await prisma.tenant.findFirst({
      where: { status: "ACTIVE" },
      include: {
        theme: true,
        settings: true,
        content: true,
        seo_config: true,
        badges: {
          orderBy: { order: "asc" },
        },
        categories: {
          orderBy: { order: "asc" },
          include: {
            services: {
              orderBy: { order: "asc" },
            },
          },
        },
        services: {
          orderBy: { order: "asc" },
          include: {
            category: true,
          },
        },
        faqs: {
          orderBy: { order: "asc" },
        },
        testimonials: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  return tenant;
}

export async function getAllActiveTenants() {
  return prisma.tenant.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      slug: true,
      custom_domain: true,
      name: true,
    },
  });
}
