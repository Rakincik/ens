import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic"; // Tüm aktif kursları getir (Forced Recompile)

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: [
        { orderIndex: "asc" },
        { createdAt: "desc" }
      ],
      include: {
        categories: { select: { id: true, name: true } }
      }
    });
    
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Public Fetch Courses Error:", error);
    return NextResponse.json(
      { error: "Kurslar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
