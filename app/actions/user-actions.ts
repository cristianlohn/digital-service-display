"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth, hashPassword } from "@/lib/auth";
import { AdminRole } from "@prisma/client";

export async function createAdminUserAction(formData: FormData) {
  try {
    const currentUser = await requireAuth();

    if (currentUser.role !== "SUPER_ADMIN") {
      return { success: false, message: "Apenas Super Admins podem criar novos usuários." };
    }

    const name = formData.get("name") as string;
    const email = (formData.get("email") as string)?.toLowerCase()?.trim();
    const password = formData.get("password") as string;
    const role = (formData.get("role") as AdminRole) || AdminRole.TENANT_ADMIN;
    const tenantId = (formData.get("tenant_id") as string) || null;

    if (!name || !email || !password) {
      return { success: false, message: "Nome, e-mail e senha são obrigatórios." };
    }

    if (password.length < 6) {
      return { success: false, message: "A senha deve ter no mínimo 6 caracteres." };
    }

    const existingUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "Já existe um usuário cadastrado com este e-mail." };
    }

    const passwordHash = await hashPassword(password);

    await prisma.adminUser.create({
      data: {
        name,
        email,
        password_hash: passwordHash,
        role,
        tenant_id: role === "SUPER_ADMIN" ? null : tenantId,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, message: `Usuário ${name} cadastrado com sucesso!` };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return { success: false, message: "Erro interno ao cadastrar usuário." };
  }
}

export async function deleteAdminUserAction(userId: string) {
  try {
    const currentUser = await requireAuth();

    if (currentUser.role !== "SUPER_ADMIN") {
      return { success: false, message: "Apenas Super Admins podem remover usuários." };
    }

    if (currentUser.userId === userId) {
      return { success: false, message: "Você não pode remover seu próprio usuário conectado." };
    }

    await prisma.adminUser.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");
    return { success: true, message: "Usuário removido com sucesso." };
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return { success: false, message: "Erro ao excluir usuário." };
  }
}
