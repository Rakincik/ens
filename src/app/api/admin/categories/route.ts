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

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { orderIndex: "asc" }
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

    const { name, orderIndex } = await request.json();
    if (!name) return NextResponse.json({ error: "Kategori adı gerekli" }, { status: 400 });

    const category = await prisma.category.create({
      data: { name, orderIndex: orderIndex || 0 }
    });
    return NextResponse.json({ message: "Başarıyla eklendi", category });
  } catch (error) {
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

    const { id, name, orderIndex } = await request.json();
    if (!id || !name) return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });

    const category = await prisma.category.update({
      where: { id },
      data: { name, orderIndex }
    });
    return NextResponse.json({ message: "Başarıyla güncellendi", category });
  } catch (error) {
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: "Kategori silindi" });
  } catch (error) {
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}
