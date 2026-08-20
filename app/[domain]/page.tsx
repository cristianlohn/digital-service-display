import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTenantByDomainOrSlug } from "@/lib/tenant";
import { generateJsonLd } from "@/lib/schema";

// Modular Components
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

// 1. Geração Dinâmica de Metadados de SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tenant = await getTenantByDomainOrSlug(params.domain);

  if (!tenant) {
    return {
      title: "Empresa não encontrada",
      description: "A página solicitada não existe ou foi desativada.",
    };
  }

  const { seo_config, content, theme } = tenant;

  const title =
    seo_config?.meta_title ||
    `${tenant.name} | Soluções em Engenharia e Automação`;

  const description =
    seo_config?.meta_description ||
    content?.hero_subtitle ||
    `Serviços especializados de ${tenant.name}.`;

  const canonicalUrl =
    seo_config?.canonical_url ||
    (tenant.custom_domain
      ? `https://${tenant.custom_domain}`
      : `https://${tenant.slug}.digitaldisplay.com.br`);

  const ogImage =
    seo_config?.og_image_url ||
    content?.hero_image_url ||
    theme?.logo_url ||
    undefined;

  return {
    title,
    description,
    keywords: seo_config?.keywords || [],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: tenant.name,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : [],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// 2. Renderização da Página Pública do Tenant
export default async function TenantPage({ params }: PageProps) {
  const tenant = await getTenantByDomainOrSlug(params.domain);

  if (!tenant) {
    notFound();
  }

  const { settings } = tenant;
  const currentUrl = tenant.custom_domain
    ? `https://${tenant.custom_domain}`
    : `https://${tenant.slug}.digitaldisplay.com.br`;

  const jsonLd = generateJsonLd(tenant, currentUrl);

  return (
    <>
      {/* Injeção do Schema.org JSON-LD para SEO Local e Serviços */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="flex min-h-screen flex-col">
        {/* Cabeçalho de Navegação */}
        <Header tenant={tenant} />

        <main className="flex-1">
          {/* Seção Hero de Destaque */}
          {settings?.show_hero && <HeroSection tenant={tenant} />}

          {/* Barra de Credenciais & Conformidade (CREA, CNPJ, Normas) */}
          {settings?.show_badges && <CredentialsBar tenant={tenant} />}

          {/* Catálogo de Serviços Especializados */}
          {settings?.show_services && <ServicesSection tenant={tenant} />}

          {/* Seção Sobre Nós */}
          {settings?.show_about && <AboutSection tenant={tenant} />}

          {/* Missão, Visão e Valores */}
          {settings?.show_mission && <MissionSection tenant={tenant} />}

          {/* Perguntas Frequentes (FAQ) */}
          {settings?.show_faq && <FAQSection tenant={tenant} />}

          {/* Formulário de Contato e Informações Diretas */}
          {settings?.show_contact_form && <ContactSection tenant={tenant} />}
        </main>

        {/* Rodapé Corporativo */}
        {settings?.show_footer && <Footer tenant={tenant} />}

        {/* Botão Flutuante do WhatsApp */}
        <FloatingWhatsApp tenant={tenant} />
      </div>
    </>
  );
}
