import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import {
  AUTH_COOKIE_NAME,
  SessionPayload,
  createSessionToken,
  verifySessionToken,
} from "./jwt";

export {
  AUTH_COOKIE_NAME,
  type SessionPayload,
  createSessionToken,
  verifySessionToken,
};

/**
 * Criptografa a senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Valida a senha contra o hash armazenado
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Grava o cookie de autenticação na resposta HTTP
 */
export function setSessionCookie(token: string) {
  const isProd = process.env.NODE_ENV === "production";
  cookies().set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

/**
 * Remove o cookie de autenticação na resposta HTTP
 */
export function clearSessionCookie() {
  cookies().delete(AUTH_COOKIE_NAME);
}

/**
 * Obtém os dados do usuário autenticado no servidor
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true, role: true, tenant_id: true },
    });

    if (!user) return null;

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "SUPER_ADMIN" | "TENANT_ADMIN",
      tenantId: user.tenant_id,
    };
  } catch (error) {
    return session;
  }
}

/**
 * Guard para Server Actions e Server Components
 */
export async function requireAuth(): Promise<SessionPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Não autorizado. Faça login para continuar.");
  }
  return user;
}
