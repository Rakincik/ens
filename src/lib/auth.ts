import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "turkceoabtdeyiz_super_secret_jwt_key_2026"
);

export async function createToken(payload: {
  id: string;
  email: string;
  role: string;
  name: string;
  surname: string;
  phone?: string | null;
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token valid for 7 days
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as {
      id: string;
      email: string;
      role: string;
      name: string;
      surname: string;
      phone?: string | null;
    };
  } catch (error) {
    return null;
  }
}
