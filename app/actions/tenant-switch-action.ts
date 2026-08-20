"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_TENANT_COOKIE } from "@/lib/admin-tenant";
import { requireAuth } from "@/lib/auth";

export async function switchAdminTenantAction(tenantId: string) {
  const user = await requireAuth();

  if (user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Apenas Super Admins podem alternar entre empresas." };
  }

  cookies().set(ADMIN_TENANT_COOKIE, tenantId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });

  revalidatePath("/admin", "layout");
  return { success: true };
}
