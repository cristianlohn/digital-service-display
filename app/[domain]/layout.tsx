import { getTenantByDomainOrSlug } from "@/lib/tenant";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: { domain: string };
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const tenant = await getTenantByDomainOrSlug(params.domain);

  const primaryColor = tenant?.theme?.primary_color || "#0b192c";
  const secondaryColor = tenant?.theme?.secondary_color || "#ff6500";

  return (
    <div
      className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-slate-900 selection:text-white"
      style={
        {
          "--tenant-primary": primaryColor,
          "--tenant-secondary": secondaryColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
