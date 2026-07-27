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

// Kurs sıralarını toplu olarak güncelle
export async function PUT(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const updates: { id: string; orderIndex: number }[] = await request.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Geçersiz veri formatı." },
        { status: 400 }
      );
    }

    // Prisma does not support bulk update with different values per row directly using updateMany.
    // We will use $transaction to run multiple updates.
    await prisma.$transaction(
      updates.map((update) =>
        prisma.course.update({
          where: { id: update.id },
          data: { orderIndex: update.orderIndex },
        })
      )
    );

    return NextResponse.json({ success: true, message: "Sıralama başarıyla kaydedildi." });
  } catch (error) {
    console.error("Admin Reorder Courses Error:", error);
    return NextResponse.json(
      { error: "Sıralama güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
