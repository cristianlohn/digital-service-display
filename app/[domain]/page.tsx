import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { Shield, LayoutDashboard, RefreshCw } from "lucide-react";

interface PageProps {
  params: { domain: string };
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

// 1. Geração Dinâmica de Metadados de SEO & Cartão WhatsApp (Open Graph)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tenant = await getTenantByDomainOrSlug(params.domain);

  if (!tenant) {
    return {
      title: "Digital Service Display | Plataforma White-Label",
      description: "Plataforma multitenant de exibição de serviços profissionais.",
    };
  }

  const { seo_config, content, theme } = tenant;

  const title =
    seo_config?.meta_title ||
    `${tenant.name} | Soluções Digitais & Serviços Profissionais`;

  const description =
    seo_config?.meta_description ||
    content?.hero_subtitle ||
    `Conheça os serviços especializados e solicite seu orçamento com ${tenant.name}.`;

  const canonicalUrl =
    seo_config?.canonical_url ||
    (tenant.custom_domain
      ? `https://${tenant.custom_domain}`
      : `https://${tenant.slug}.digitaldisplay.com.br`);

  // Open Graph Image (WhatsApp & Redes Sociais exigem URL absoluta)
  const rawOgImage =
    seo_config?.og_image_url ||
    content?.hero_image_url ||
    theme?.logo_url ||
    "/logo-catuto.svg";

  const ogImageUrl = rawOgImage.startsWith("http")
    ? rawOgImage
    : `${canonicalUrl.replace(/\/$/, "")}${rawOgImage.startsWith("/") ? rawOgImage : `/${rawOgImage}`}`;

  // Favicon Dinâmico do Cliente
  const rawFavicon = theme?.favicon_url || theme?.logo_url || "/logo-catuto.svg";
  const faviconUrl = rawFavicon.startsWith("http")
    ? rawFavicon
    : `${canonicalUrl.replace(/\/$/, "")}${rawFavicon.startsWith("/") ? rawFavicon : `/${rawFavicon}`}`;

  return {
    title,
    description,
    keywords: seo_config?.keywords || [],
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: [
        { url: faviconUrl, sizes: "any" },
        { url: faviconUrl, type: "image/svg+xml" },
      ],
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: tenant.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
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

  // Fallback amigável caso o banco ainda esteja inicializando
  if (!tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Shield size={36} />
          </div>

          <h2 className="text-2xl font-bold">
            Plataforma em Inicialização
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            O sistema está aguardando a conexão com o banco de dados Supabase ou a identificação do tenant.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-950 font-bold px-6 py-3 text-xs shadow hover:bg-slate-100 transition-all"
            >
              <LayoutDashboard size={16} />
              <span>Acessar Painel /admin</span>
            </Link>

            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 text-white font-bold px-6 py-3 text-xs border border-slate-700 hover:bg-slate-700 transition-all"
            >
              <RefreshCw size={16} />
              <span>Recarregar Página</span>
            </a>
          </div>
        </div>
      </div>
    );
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

      {/* Dynamic Fixed Full-Page Background (Desktop & Mobile Optimized) */}
      {tenant.theme?.background_image_url && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src={tenant.theme.background_image_url}
            alt={`${tenant.name} Background`}
            fill
            unoptimized
            className="object-cover object-center scale-105 transform-gpu"
            priority
          />
          {/* Enhanced Translucent Overlay (Higher contrast and visibility) */}
          <div className="absolute inset-0 bg-slate-900/10" />
          <div className="absolute inset-0 bg-white/55 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/70" />
        </div>
      )}

      <div className="flex min-h-screen flex-col relative z-10">
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
