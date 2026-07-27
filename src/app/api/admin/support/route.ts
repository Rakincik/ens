import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Yardımcı Fonksiyon: Yetki Kontrolü
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) return null;

  const payload = await verifyToken(tokenCookie.value);
  if (!payload || payload.role !== "ADMIN") return null;

  return payload;
}

// Tüm mesajları getir
export async function GET() {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const messages = await prisma.supportMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Admin Support Fetch Error:", error);
    return NextResponse.json(
      { error: "Mesajlar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Mesajı okundu/okunmadı olarak işaretle
export async function PATCH(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { id, isRead } = await request.json();

    if (!id || typeof isRead !== "boolean") {
      return NextResponse.json(
        { error: "Eksik veya hatalı veri gönderildi." },
        { status: 400 }
      );
    }

    const updatedMessage = await prisma.supportMessage.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json({
      success: true,
      message: "Mesaj durumu güncellendi.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Admin Support Update Error:", error);
    return NextResponse.json(
      { error: "Mesaj durumu güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}
