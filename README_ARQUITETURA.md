# 📑 Documentação Técnica & Resumo da Entrega da Arquitetura

Este documento reúne o detalhamento técnico e os códigos dos **4 pilares fundamentais** entregues para a plataforma **White-Label Multitenant**, bem como o catálogo completo dos módulos implementados e guia de execução.

---

## 🎯 Os 4 Entregáveis Principais

### 1. Modelagem do Banco de Dados ([`prisma/schema.prisma`](./prisma/schema.prisma))

O schema isola os tenants por chave relacional (`tenant_id`), com suporte a subdomínios, domínios próprios, customização visual dinâmica, toggles de seções, catálogo de serviços e captação de leads.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum TenantStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum LeadStatus {
  NEW
  CONTACTED
  CONVERTED
  ARCHIVED
}

model Tenant {
  id            String       @id @default(cuid())
  slug          String       @unique
  name          String
  custom_domain String?      @unique
  status        TenantStatus @default(ACTIVE)
  created_at    DateTime     @default(now())
  updated_at    DateTime     @updatedAt

  // 1-to-1 relations
  theme       TenantTheme?
  settings    TenantSettings?
  content     TenantContent?
  seo_config  SEOConfig?

  // 1-to-many relations
  categories   ServiceCategory[]
  services     Service[]
  badges       Badge[]
  faqs         FAQ[]
  testimonials Testimonial[]
  leads        Lead[]

  @@index([slug])
  @@index([custom_domain])
  @@map("tenants")
}

model TenantTheme {
  id                String   @id @default(cuid())
  tenant_id         String   @unique
  primary_color     String   @default("#0f172a")
  secondary_color   String   @default("#f59e0b")
  font_family       String   @default("Inter")
  logo_url          String?
  favicon_url       String?
  dark_mode_enabled Boolean  @default(false)
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt

  tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@map("tenant_themes")
}

model TenantSettings {
  id                String   @id @default(cuid())
  tenant_id         String   @unique
  show_hero         Boolean  @default(true)
  show_about        Boolean  @default(true)
  show_mission      Boolean  @default(true)
  show_services     Boolean  @default(true)
  show_badges       Boolean  @default(true)
  show_faq          Boolean  @default(true)
  show_testimonials Boolean  @default(true)
  show_contact_form Boolean  @default(true)
  show_map          Boolean  @default(true)
  show_footer       Boolean  @default(true)
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt

  tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@map("tenant_settings")
}

model TenantContent {
  id                    String   @id @default(cuid())
  tenant_id             String   @unique
  
  // Hero
  hero_title            String
  hero_subtitle         String
  cta_primary_text      String   @default("Solicitar Orçamento")
  cta_primary_link      String   @default("#contato")
  cta_whatsapp_text     String   @default("Falar no WhatsApp")
  hero_image_url        String?

  // About
  about_badge_text      String?  @default("Quem Somos")
  about_title           String
  about_description     String   @db.Text
  founded_year          Int?
  about_image_url       String?

  // Mission & Values
  mission_text          String?  @db.Text
  vision_text           String?  @db.Text
  values                String[] @default([])

  // Contact & Legal
  phone                 String?
  whatsapp_number       String
  email                 String
  address_street        String
  address_number        String
  address_neighborhood  String
  address_city          String
  address_state         String
  address_zip           String
  cnpj                  String
  professional_register String?  // CREA, CRM, OAB
  google_maps_url       String?  @db.Text
  working_hours         String?  @default("Segunda a Sexta: 08h às 18h")

  created_at            DateTime @default(now())
  updated_at            DateTime @updatedAt

  tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@map("tenant_contents")
}

model ServiceCategory {
  id         String    @id @default(cuid())
  tenant_id  String
  name       String
  order      Int       @default(0)
  created_at DateTime  @default(now())
  updated_at DateTime  @updatedAt

  tenant   Tenant    @relation(fields: [tenant_id], references: [id], onDelete: Cascade)
  services Service[]

  @@index([tenant_id])
  @@map("service_categories")
}

model Service {
  id                String           @id @default(cuid())
  tenant_id         String
  category_id       String?
  title             String
  short_description String           @db.Text
  full_description  String?          @db.Text
  icon_name         String           @default("Zap")
  order             Int              @default(0)
  is_featured       Boolean          @default(false)
  created_at        DateTime         @default(now())
  updated_at        DateTime         @updatedAt

  tenant   Tenant           @relation(fields: [tenant_id], references: [id], onDelete: Cascade)
  category ServiceCategory? @relation(fields: [category_id], references: [id], onDelete: SetNull)

  @@index([tenant_id])
  @@index([category_id])
  @@map("services")
}

model Badge {
  id         String   @id @default(cuid())
  tenant_id  String
  label      String
  value      String
  icon_name  String   @default("ShieldCheck")
  order      Int      @default(0)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@index([tenant_id])
  @@map("badges")
}

model SEOConfig {
  id                   String   @id @default(cuid())
  tenant_id            String   @unique
  meta_title           String
  meta_description     String   @db.Text
  keywords             String[] @default([])
  canonical_url        String?
  og_image_url         String?
  schema_business_type String   @default("ProfessionalService")
  created_at           DateTime @default(now())
  updated_at           DateTime @updatedAt

  tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@map("seo_configs")
}

model FAQ {
  id         String   @id @default(cuid())
  tenant_id  String
  question   String
  answer     String   @db.Text
  order      Int      @default(0)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@index([tenant_id])
  @@map("faqs")
}

model Testimonial {
  id              String   @id @default(cuid())
  tenant_id       String
  author_name     String
  role_or_company String?
  content         String   @db.Text
  rating          Int      @default(5)
  avatar_url      String?
  order           Int      @default(0)
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@index([tenant_id])
  @@map("testimonials")
}

model Lead {
  id               String     @id @default(cuid())
  tenant_id        String
  name             String
  email            String
  phone            String
  service_interest String?
  message          String?    @db.Text
  status           LeadStatus @default(NEW)
  created_at       DateTime   @default(now())
  updated_at       DateTime   @updatedAt

  tenant Tenant @relation(fields: [tenant_id], references: [id], onDelete: Cascade)

  @@index([tenant_id])
  @@index([status])
  @@map("leads")
}
```

---

### 2. Resolução de Domínios e Multitenancy ([`middleware.ts`](./middleware.ts))

O middleware intercepta a requisição na camada Edge da Vercel, identifica se o host é um subdomínio (`dall.plataforma.com.br`), um domínio personalizado (`dallautomacao.com.br`) ou ambiente local, reescrevendo a rota internamente para `app/[domain]/...`.

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "localhost:3000";
  const path = url.pathname;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

  // Rotas administrativas globais permanecem intactas
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  let tenantIdentifier = "dall-automacao";
  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");

  if (isLocalhost) {
    if (hostname.includes(".localhost")) {
      tenantIdentifier = hostname.split(".localhost")[0];
    } else {
      tenantIdentifier = "dall-automacao";
    }
  } else if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    tenantIdentifier = "platform-home";
  } else if (hostname.endsWith(`.${rootDomain}`)) {
    tenantIdentifier = hostname.replace(`.${rootDomain}`, "");
  } else {
    // Custom domain registrado (ex: dallautomacao.com.br)
    tenantIdentifier = hostname.replace(`:${url.port}`, "");
  }

  const responseUrl = new URL(`/${tenantIdentifier}${path === "/" ? "" : path}`, req.url);
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant-domain", tenantIdentifier);
  requestHeaders.set("x-tenant-host", hostname);

  return NextResponse.rewrite(responseUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}
```

---

### 3. Gerador Dinâmico de Schema.org JSON-LD ([`lib/schema.ts`](./lib/schema.ts))

Gera a estrutura JSON-LD para indexação de `LocalBusiness`, `ProfessionalService` ou `HomeAndConstructionBusiness`, incluindo `hasOfferCatalog`, endereço completo e área de cobertura.

```typescript
// lib/schema.ts
import { TenantWithRelations } from "@/lib/tenant";

export function generateJsonLd(tenant: TenantWithRelations, currentUrl: string) {
  const { content, seo_config, services, theme } = tenant;
  const businessType = seo_config?.schema_business_type || "ProfessionalService";

  const offerList = services.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.title,
      description: service.short_description,
      provider: {
        "@type": businessType,
        name: tenant.name,
      },
    },
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": businessType,
    "@id": `${currentUrl}/#organization`,
    name: tenant.name,
    legalName: tenant.name,
    description: seo_config?.meta_description || content?.hero_subtitle,
    url: currentUrl,
    logo: theme?.logo_url || undefined,
    image: content?.hero_image_url || theme?.logo_url || undefined,
    telephone: content?.phone || content?.whatsapp_number,
    email: content?.email,
    taxID: content?.cnpj,
    vatID: content?.cnpj,
    address: content
      ? {
          "@type": "PostalAddress",
          streetAddress: `${content.address_street}, ${content.address_number}`,
          addressLocality: content.address_city,
          addressRegion: content.address_state,
          postalCode: content.address_zip,
          addressCountry: "BR",
        }
      : undefined,
    areaServed: content
      ? [
          {
            "@type": "AdministrativeArea",
            name: `${content.address_city}, ${content.address_state}`,
          },
          {
            "@type": "Country",
            name: "Brasil",
          },
        ]
      : undefined,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Serviços de ${tenant.name}`,
      itemListElement: offerList,
    },
    contactPoint: content
      ? {
          "@type": "ContactPoint",
          telephone: content.phone || content.whatsapp_number,
          contactType: "customer service",
          areaServed: "BR",
          availableLanguage: ["Portuguese"],
        }
      : undefined,
  };

  return JSON.stringify(schema);
}
```

---

### 4. Página Pública com Renderização Modular e SEO ([`app/[domain]/page.tsx`](./app/[domain]/page.tsx))

```tsx
// app/[domain]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTenantByDomainOrSlug } from "@/lib/tenant";
import { generateJsonLd } from "@/lib/schema";

import { Header } from "@/components/public/Header";
import { HeroSection } from "@/components/public/HeroSection";
import { CredentialsBar } from "@/components/public/CredentialsBar";
import { ServicesSection } from "@/components/public/ServicesSection";
import { AboutSection } from "@/components/public/AboutSection";
import { MissionSection } from "@/components/public/MissionSection";
import { FAQSection } from "@/components/public/FAQSection";
import { ContactSection } from "@/components/public/ContactSection";
import { Footer } from "@/components/public/Footer";
import { FloatingWhatsApp } from "@/components/public/FloatingWhatsApp";

interface PageProps {
  params: { domain: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tenant = await getTenantByDomainOrSlug(params.domain);
  if (!tenant) return { title: "Empresa não encontrada" };

  const { seo_config, content, theme } = tenant;
  const title = seo_config?.meta_title || `${tenant.name} | Soluções em Engenharia e Automação`;
  const description = seo_config?.meta_description || content?.hero_subtitle || "";
  const canonicalUrl = seo_config?.canonical_url || (tenant.custom_domain ? `https://${tenant.custom_domain}` : `https://${tenant.slug}.digitaldisplay.com.br`);
  const ogImage = seo_config?.og_image_url || content?.hero_image_url || theme?.logo_url || undefined;

  return {
    title,
    description,
    keywords: seo_config?.keywords || [],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: tenant.name,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : [],
      locale: "pt_BR",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: ogImage ? [ogImage] : [] },
    robots: { index: true, follow: true },
  };
}

export default async function TenantPage({ params }: PageProps) {
  const tenant = await getTenantByDomainOrSlug(params.domain);
  if (!tenant) notFound();

  const { settings } = tenant;
  const currentUrl = tenant.custom_domain ? `https://${tenant.custom_domain}` : `https://${tenant.slug}.digitaldisplay.com.br`;
  const jsonLd = generateJsonLd(tenant, currentUrl);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <div className="flex min-h-screen flex-col">
        <Header tenant={tenant} />
        <main className="flex-1">
          {settings?.show_hero && <HeroSection tenant={tenant} />}
          {settings?.show_badges && <CredentialsBar tenant={tenant} />}
          {settings?.show_services && <ServicesSection tenant={tenant} />}
          {settings?.show_about && <AboutSection tenant={tenant} />}
          {settings?.show_mission && <MissionSection tenant={tenant} />}
          {settings?.show_faq && <FAQSection tenant={tenant} />}
          {settings?.show_contact_form && <ContactSection tenant={tenant} />}
        </main>
        {settings?.show_footer && <Footer tenant={tenant} />}
        <FloatingWhatsApp tenant={tenant} />
      </div>
    </>
  );
}
```

---

## 📊 Tabela de Módulos Implementados

| Módulo / Camada | Arquivo Criado | Descrição |
| :--- | :--- | :--- |
| **Data & ORM** | [`prisma/schema.prisma`](./prisma/schema.prisma) | Modelagem completa com isolamento multitenant |
| **Seed Inicial** | [`prisma/seed.ts`](./prisma/seed.ts) | Dados reais da **D'All Engenharia e Automação** (Joinville/SC) |
| **Middleware** | [`middleware.ts`](./middleware.ts) | Captura de host, roteamento dinâmico e subdomínios |
| **SEO & Schema** | [`lib/schema.ts`](./lib/schema.ts) | Gerador JSON-LD Schema.org (`OfferCatalog`, `PostalAddress`) |
| **Data Access** | [`lib/tenant.ts`](./lib/tenant.ts) | Consultas com tipagem estrita e cache otimizado |
| **Componentes UI** | [`components/public/`](./components/public) | `Header`, `Hero`, `CredentialsBar`, `Services`, `About`, `Mission`, `FAQ`, `Contact`, `Footer`, `FloatingWhatsApp` |
| **Painel /admin** | [`app/admin/`](./app/admin) | Dashboard de métricas, toggles de seções, editor de tema, CRUD de serviços e pipeline de leads |
| **Sitemap & Robots**| [`app/[domain]/sitemap.ts`](./app/[domain]/sitemap.ts) | Sitemap XML e Robots.txt dinâmicos por domínio |

---

## 🚀 Como Rodar e Testar Localmente

1. **Configurar o banco no `.env`**:
   Substitua as credenciais do Supabase/PostgreSQL no arquivo [`.env.example`](./.env.example) e renomeie para `.env`:
   ```bash
   DATABASE_URL="postgresql://postgres:[SENHA]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"
   DIRECT_URL="postgresql://postgres:[SENHA]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"
   ```

2. **Instalar dependências e sincronizar o banco**:
   ```bash
   npm install
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

3. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   - **Site Público (D'All Engenharia)**: Acesse `http://localhost:3000` ou `http://dall.localhost:3000`
   - **Painel Administrativo**: Acesse `http://localhost:3000/admin`
