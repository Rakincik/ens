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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { id } = await params;

    const student = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        passwordHash: true, // KURAL DEĞİŞİKLİĞİ: Admin şifreyi görebilir
        name: true,
        surname: true,
        phone: true,
        createdAt: true,
        orders: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            paymentId: true,
            orderItems: {
              select: {
                price: true,
                course: {
                  select: { title: true, type: true }
                }
              }
            }
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: "Öğrenci bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error("Admin Fetch Student Details Error:", error);
    return NextResponse.json(
      { error: "Öğrenci detayları yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
