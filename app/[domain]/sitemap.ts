import { MetadataRoute } from "next";
import { getTenantByDomainOrSlug } from "@/lib/tenant";

export default async function sitemap({
  params,
}: {
  params: { domain: string };
}): Promise<MetadataRoute.Sitemap> {
  const tenant = await getTenantByDomainOrSlug(params.domain);

  if (!tenant) {
    return [];
  }

  const baseUrl = tenant.custom_domain
    ? `https://${tenant.custom_domain}`
    : `https://${tenant.slug}.digitaldisplay.com.br`;

  return [
    {
      url: `${baseUrl}/`,
      lastModified: tenant.updated_at || new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#servicos`,
      lastModified: tenant.updated_at || new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#sobre`,
      lastModified: tenant.updated_at || new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#contato`,
      lastModified: tenant.updated_at || new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
