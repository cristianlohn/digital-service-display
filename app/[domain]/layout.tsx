import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { getTenantByDomainOrSlug } from "@/lib/tenant";
import { notFound } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

interface TenantLayoutProps {
  children: React.ReactNode;
  params: { domain: string };
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const tenant = await getTenantByDomainOrSlug(params.domain);

  if (!tenant) {
    notFound();
  }

  const primaryColor = tenant.theme?.primary_color || "#0f172a";
  const secondaryColor = tenant.theme?.secondary_color || "#f59e0b";

  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <head>
        {tenant.theme?.favicon_url && (
          <link rel="icon" href={tenant.theme.favicon_url} />
        )}
        <style>{`
          :root {
            --tenant-primary: ${primaryColor};
            --tenant-secondary: ${secondaryColor};
          }
        `}</style>
      </head>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
