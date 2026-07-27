import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
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

export async function GET() {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    // Tüm öğrencileri ve satın alım geçmişlerini getir
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            orderItems: {
              select: {
                course: {
                  select: { title: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Admin Fetch Students Error:", error);
    return NextResponse.json(
      { error: "Öğrenciler yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Şifre sıfırlama / güncelleme
export async function POST(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { studentId, newPassword } = await request.json();

    if (!studentId || !newPassword) {
      return NextResponse.json(
        { error: "Lütfen öğrenci ve yeni şifreyi belirtin." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Yeni şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    // KURAL DEĞİŞİKLİĞİ: Şifreler hashlenmeyecek
    const passwordHash = newPassword;

    // Güncelle
    await prisma.user.update({
      where: { id: studentId, role: "STUDENT" },
      data: { passwordHash }
    });

    return NextResponse.json({
      message: "Öğrenci şifresi başarıyla güncellendi."
    });
  } catch (error) {
    console.error("Admin Password Reset Error:", error);
    return NextResponse.json(
      { error: "Şifre güncellenirken sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}
