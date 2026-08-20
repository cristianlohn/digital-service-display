import { headers, cookies } from "next/headers";
import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";
import { Tenant } from "@prisma/client";

export const ADMIN_TENANT_COOKIE = "dsd_admin_active_tenant";

export async function getAdminActiveTenant() {
  const user = await getCurrentUser();
  const headersList = headers();
  const hostname = headersList.get("host") || "";
  const cookieStore = cookies();
  const selectedSlugOrId = cookieStore.get(ADMIN_TENANT_COOKIE)?.value;

  const cleanHost = hostname.replace(/:\d+$/, "").toLowerCase().replace(/^www\./, "");

  // 1. Se for Tenant Admin com tenant_id fixo
  if (user && user.role === "TENANT_ADMIN" && user.tenantId) {
    const userTenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      include: {
        theme: true,
        settings: true,
        content: true,
        seo_config: true,
      },
    });
    if (userTenant) return userTenant;
  }

  // 2. Se estiver acessando através do próprio domínio personalizado (ex: catuto.com.br/admin ou www.catuto.com.br/admin)
  if (cleanHost && !cleanHost.includes("localhost") && !cleanHost.endsWith(".vercel.app") && !cleanHost.includes("127.0.0.1")) {
    const domainTenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { custom_domain: cleanHost },
          { custom_domain: `www.${cleanHost}` },
          { slug: cleanHost },
        ],
        status: "ACTIVE",
      },
      include: {
        theme: true,
        settings: true,
        content: true,
        seo_config: true,
      },
    });
    if (domainTenant) return domainTenant;
  }

  // 3. Se for Super Admin e selecionou um tenant via cookie
  if (selectedSlugOrId) {
    const selectedTenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id: selectedSlugOrId },
          { slug: selectedSlugOrId },
        ],
        status: "ACTIVE",
      },
      include: {
        theme: true,
        settings: true,
        content: true,
        seo_config: true,
      },
    });
    if (selectedTenant) return selectedTenant;
  }

  // 4. Se o usuário tem tenant_id (ex: Super Admin associado a Catuto)
  if (user && user.tenantId) {
    const userTenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      include: {
        theme: true,
        settings: true,
        content: true,
        seo_config: true,
      },
    });
    if (userTenant) return userTenant;
  }

  // 5. Fallback: Busca o tenant "catuto" prioritariamente, ou o primeiro ativo
  const catutoFallback = await prisma.tenant.findFirst({
    where: { slug: "catuto", status: "ACTIVE" },
    include: {
      theme: true,
      settings: true,
      content: true,
      seo_config: true,
    },
  });

  if (catutoFallback) return catutoFallback;

  return prisma.tenant.findFirst({
    where: { status: "ACTIVE" },
    include: {
      theme: true,
      settings: true,
      content: true,
      seo_config: true,
    },
  });
}
