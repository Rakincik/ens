import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) return null;

  const payload = await verifyToken(tokenCookie.value);
  if (!payload || payload.role !== "ADMIN") return null;

  return payload;
}

export async function POST(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const body = await request.json();
    const { name, surname, email, password, role } = body;

    if (!name || !surname || !email) {
      return NextResponse.json({ error: "Lütfen ad, soyad ve e-posta alanlarını doldurun." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Bu e-posta adresi kullanımda." }, { status: 400 });
    }

    const passwordHash = password && password.trim() !== "" ? password : "123456";

    await prisma.user.create({
      data: {
        name,
        surname,
        email,
        passwordHash,
        role: role || "ADMIN",
      },
    });

    return NextResponse.json({ message: "Kullanıcı başarıyla oluşturuldu." });
  } catch (error) {
    console.error("Create User API Error:", error);
    return NextResponse.json(
      { error: "Kullanıcı oluşturulurken bir hata meydana geldi." },
      { status: 500 }
    );
  }
}
