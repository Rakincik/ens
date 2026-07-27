import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");

    if (!tokenCookie) {
      return NextResponse.json(
        { error: "Bu işlem için oturum açmalısınız." },
        { status: 401 }
      );
    }

    const payload = await verifyToken(tokenCookie.value);
    if (!payload) {
      return NextResponse.json(
        { error: "Geçersiz oturum." },
        { status: 401 }
      );
    }

    // Kullanıcının sipariş geçmişini getir
    const orders = await prisma.order.findMany({
      where: {
        userId: payload.id,
      },
      include: {
        orderItems: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Satın alınan aktif eğitimleri (Başarılı siparişlerdeki benzersiz kursları) çıkar
    const purchasedCoursesMap = new Map();
    orders
      .filter((order) => order.status === "SUCCESS")
      .forEach((order) => {
        order.orderItems.forEach((item) => {
          if (!purchasedCoursesMap.has(item.course.id)) {
            purchasedCoursesMap.set(item.course.id, item.course);
          }
        });
      });

    const purchasedCourses = Array.from(purchasedCoursesMap.values());

    return NextResponse.json({
      courses: purchasedCourses,
      orders: orders.map((o) => ({
        id: o.id,
        totalAmount: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt,
        items: o.orderItems.map((item) => item.course.title),
      })),
    });
  } catch (error) {
    console.error("Student Dashboard Fetch Error:", error);
    return NextResponse.json(
      { error: "Panel bilgileri yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
