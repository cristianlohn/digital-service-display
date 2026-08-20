"use server";

import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase()?.trim();
  const password = formData.get("password") as string;
  const redirectUrl = (formData.get("redirect") as string) || "/admin";

  if (!email || !password) {
    return { success: false, error: "Por favor, preencha seu e-mail e senha." };
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      return { success: false, error: "E-mail ou senha incorretos." };
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return { success: false, error: "E-mail ou senha incorretos." };
    }

    // Cria token assinado
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenant_id,
    });

    // Grava cookie seguro
    setSessionCookie(token);

    return { success: true, redirectUrl };
  } catch (error) {
    console.error("Erro no loginAction:", error);
    return { success: false, error: "Erro interno no servidor ao autenticar." };
  }
}

export async function logoutAction() {
  clearSessionCookie();
  redirect("/admin/login");
}
