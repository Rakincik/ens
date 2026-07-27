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

// Tüm kuponları listele
export async function GET() {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const coupons = await prisma.coupon.findMany({
      include: {
        orders: {
          where: { status: "SUCCESS" },
          select: { totalAmount: true, createdAt: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Admin Fetch Coupons Error:", error);
    return NextResponse.json(
      { error: "Kuponlar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Yeni kupon oluştur
export async function POST(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { code, discountType, discountValue, courseId, isActive, startDate, expiryDate, usageLimit, influencerName, influencerEmail } = await request.json();

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { error: "Lütfen kupon kodu, indirim türü ve değerini belirtin." },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        courseId: courseId || null,
        isActive: isActive !== undefined ? isActive : true,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        influencerName: influencerName || null,
        influencerEmail: influencerEmail || null
      }
    });

    return NextResponse.json({
      message: "Kupon başarıyla oluşturuldu.",
      coupon
    }, { status: 201 });
  } catch (error) {
    console.error("Admin Create Coupon Error:", error);
    return NextResponse.json(
      { error: "Kupon oluşturulurken sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Kupon güncelle (Aktif-Pasif durumunu güncellemek için de kullanılır)
export async function PUT(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { id, code, discountType, discountValue, courseId, isActive, startDate, expiryDate, usageLimit, influencerName, influencerEmail } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Lütfen güncellenecek kuponu belirtin." },
        { status: 400 }
      );
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(code && { code: code.toUpperCase().trim() }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: parseFloat(discountValue) }),
        ...(courseId !== undefined && { courseId: courseId || null }),
        ...(isActive !== undefined && { isActive }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(expiryDate !== undefined && { expiryDate: expiryDate ? new Date(expiryDate) : null }),
        ...(usageLimit !== undefined && { usageLimit: usageLimit ? parseInt(usageLimit) : null }),
        ...(influencerName !== undefined && { influencerName: influencerName || null }),
        ...(influencerEmail !== undefined && { influencerEmail: influencerEmail || null })
      }
    });

    return NextResponse.json({
      message: "Kupon başarıyla güncellendi.",
      coupon: updatedCoupon
    });
  } catch (error) {
    console.error("Admin Update Coupon Error:", error);
    return NextResponse.json(
      { error: "Kupon güncellenirken sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Kupon sil
export async function DELETE(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Lütfen silinecek kuponu belirtin." },
        { status: 400 }
      );
    }

    await prisma.coupon.delete({
      where: { id }
    });

    return NextResponse.json({
      message: "Kupon başarıyla silindi."
    });
  } catch (error) {
    console.error("Admin Delete Coupon Error:", error);
    return NextResponse.json(
      { error: "Kupon silinirken sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}
