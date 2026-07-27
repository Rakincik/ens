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

export async function GET() {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    // Tüm siparişleri, satın alan kullanıcıyı ve içindeki ürünleri getir
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, surname: true, email: true } },
        orderItems: {
          include: {
            course: { select: { title: true } }
          }
        }
      }
    });

    // Metrikler
    // 1. Toplam Gelir (Sadece SUCCESS olanlar)
    const totalRevenueResult = await prisma.order.aggregate({
      where: { status: "SUCCESS" },
      _sum: { totalAmount: true }
    });
    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

    // 2. Başarılı Satışlar (SUCCESS durumu)
    const successfulSales = await prisma.order.count({
      where: { status: "SUCCESS" }
    });

    // 3. Kayıtlı Öğrenciler
    const registeredStudents = await prisma.user.count({
      where: { role: "STUDENT" }
    });

    // 4. Toplam Ürün (Aktif Kurslar)
    const totalProducts = await prisma.course.count({
      where: { isActive: true }
    });

    return NextResponse.json({
      orders,
      metrics: {
        totalRevenue,
        successfulSales,
        registeredStudents,
        totalProducts
      }
    });

  } catch (error) {
    console.error("Admin Sales Fetch Error:", error);
    return NextResponse.json(
      { error: "Satış verileri yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
