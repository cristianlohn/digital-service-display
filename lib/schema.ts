import { TenantWithRelations } from "@/lib/tenant";

export function generateJsonLd(tenant: TenantWithRelations, currentUrl: string) {
  const { content, seo_config, services, theme } = tenant;

  const businessType = seo_config?.schema_business_type || "ProfessionalService";

  const fullAddress = content
    ? `${content.address_street}, ${content.address_number} - ${content.address_neighborhood}, ${content.address_city} - ${content.address_state}, CEP ${content.address_zip}`
    : "";

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
    taxID: content?.cnpj || undefined,
    vatID: content?.cnpj || undefined,
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
    openingHoursSpecification: content?.working_hours
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
            opens: "08:00",
            closes: "18:00",
          },
        ]
      : undefined,
  };

  return JSON.stringify(schema);
}
