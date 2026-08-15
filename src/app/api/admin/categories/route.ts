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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "COURSE" or "PUBLICATION"

    // Typescript'in Prisma cache kalıntıları yüzünden hata vermemesi için
    const whereClause: any = type ? { type } : undefined;

    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: { orderIndex: "asc" }
    });
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: "Hata oluştu: " + error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

    const { name, orderIndex, type } = await request.json();
    if (!name) return NextResponse.json({ error: "Kategori adı gerekli" }, { status: 400 });

    const createData: any = { name, orderIndex: orderIndex || 0, type: type || "COURSE" };
    const category = await prisma.category.create({
      data: createData
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
