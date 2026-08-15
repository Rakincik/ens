import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic"; // Tüm aktif kursları getir (Forced Recompile)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let courses = await prisma.course.findMany({
      where: { 
        isActive: true,
        ...(type ? { type } : {})
      } as any,
      orderBy: [
        { orderIndex: "asc" },
        { createdAt: "desc" }
      ],
      include: {
        categories: { select: { id: true, name: true } }
      }
    });

    // Dinamik URL yönlendirmesi silindi
    courses = courses.map(course => {
      return course;
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
