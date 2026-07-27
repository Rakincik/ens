import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Ürün ID belirtilmelidir." },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id, isActive: true },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Ürün bulunamadı veya satışta değil." },
        { status: 404 }
      );
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Public Fetch Course Detail Error:", error);
    return NextResponse.json(
      { error: "Ürün detayları yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
