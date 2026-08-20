import { MetadataRoute } from "next";
import { getTenantByDomainOrSlug } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export default async function robots({
  params,
}: {
  params: { domain: string };
}): Promise<MetadataRoute.Robots> {
  const tenant = await getTenantByDomainOrSlug(params.domain);

  const baseUrl = tenant?.custom_domain
    ? `https://${tenant.custom_domain}`
    : `https://${tenant?.slug || "empresa"}.digitaldisplay.com.br`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
