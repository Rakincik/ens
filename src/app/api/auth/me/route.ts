import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");

    if (!tokenCookie) {
      return NextResponse.json({ user: null });
    }

    const payload = await verifyToken(tokenCookie.value);

    if (!payload) {
      // Hatalı/Süresi geçmiş token varsa temizle
      const response = NextResponse.json({ user: null });
      response.cookies.delete("token");
      return response;
    }

    return NextResponse.json({
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        name: payload.name,
        surname: payload.surname,
      },
    });
  } catch (error) {
    console.error("Auth Me Error:", error);
    return NextResponse.json({ user: null });
  }
}
