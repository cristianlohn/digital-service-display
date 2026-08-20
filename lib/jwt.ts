import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const AUTH_COOKIE_NAME = "dsd_admin_session";
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "d58f3b14e21a6c0e81c034a78726b2bcf1b7029589d9e4a8677e43689c1628d9";

const key = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "TENANT_ADMIN";
  tenantId?: string | null;
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}
