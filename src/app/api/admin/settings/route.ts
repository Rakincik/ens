import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Helper to check if request is from an authorized admin
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) return null;

  const payload = await verifyToken(tokenCookie.value);
  if (!payload || payload.role !== "ADMIN") return null;

  return payload;
}

// Tüm ayarları getir
export async function GET() {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const settings = await prisma.contentSettings.findMany();
    const formattedSettings = settings.reduce((acc: any, current) => {
      try {
        acc[current.key] = JSON.parse(current.value);
      } catch (e) {
        acc[current.key] = current.value;
      }
      return acc;
    }, {});

    return NextResponse.json({ settings: formattedSettings });
  } catch (error) {
    console.error("Admin Fetch Settings Error:", error);
    return NextResponse.json(
      { error: "Ayarlar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Ayar kaydet / Güncelle (Upsert)
export async function POST(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { key, value } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Lütfen anahtar (key) ve değer (value) belirtin." },
        { status: 400 }
      );
    }

    // Değeri JSON string'e dönüştür
    const valueString = typeof value === "string" ? value : JSON.stringify(value);

    const setting = await prisma.contentSettings.upsert({
      where: { key },
      update: { value: valueString },
      create: { key, value: valueString }
    });

    return NextResponse.json({
      message: `"${key}" içerik ayarları başarıyla kaydedildi.`,
      setting
    });
  } catch (error) {
    console.error("Admin Save Settings Error:", error);
    return NextResponse.json(
      { error: "Ayar kaydedilirken sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}
