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

// Tüm kursları listele (Forced Recompile)
export async function GET(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "COURSE";

    let courses = await prisma.course.findMany({
      where: { type },
      orderBy: [
        { orderIndex: "asc" },
        { createdAt: "desc" }
      ],
      include: {
        categories: { select: { id: true, name: true } }
      }
    });

    courses = courses.map(course => {
      return course;
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Admin Fetch Courses Error:", error);
    return NextResponse.json(
      { error: "Kurslar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Yeni kurs oluştur
export async function POST(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { title, description, price, originalPrice, isActive, image, isCouponEligible, categoryIds, orderIndex, type, features, paymentLink, muroGroupId } = await request.json();

    if (!title || !description || price === undefined) {
      return NextResponse.json(
        { error: "Lütfen kurs adı, açıklama ve fiyatı eksiksiz doldurun." },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        isActive: isActive !== undefined ? isActive : true,
        image: image ? image.replace("https://toa.muro.click", "") : null,
        isCouponEligible: isCouponEligible !== undefined ? isCouponEligible : true,
        categories: Array.isArray(categoryIds) && categoryIds.length > 0 
          ? { connect: categoryIds.map((id: string) => ({ id })) }
          : undefined,
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
        type: type || "COURSE",
        features: Array.isArray(features) ? features : [],
        paymentLink: paymentLink || null,
        muroGroupId: muroGroupId || null
      }
    });

    return NextResponse.json({
      message: "Kurs paketi başarıyla oluşturuldu.",
      course
    }, { status: 201 });
  } catch (error) {
    console.error("Admin Create Course Error:", error);
    return NextResponse.json(
      { error: "Kurs oluşturulurken sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Kurs güncelle / Aktif-Pasif yap
export async function PUT(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { id, title, description, price, originalPrice, isActive, image, isCouponEligible, categoryIds, orderIndex, type, features, paymentLink, muroGroupId } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Lütfen güncellenecek kursu belirtin." },
        { status: 400 }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? parseFloat(originalPrice) : null }),
        ...(isActive !== undefined && { isActive }),
        ...(image !== undefined && { image: typeof image === 'string' ? image.replace("https://toa.muro.click", "") : image }),
        ...(isCouponEligible !== undefined && { isCouponEligible }),
        ...(categoryIds !== undefined && { 
          categories: Array.isArray(categoryIds) 
            ? { set: categoryIds.map((catId: string) => ({ id: catId })) }
            : { set: [] }
        }),
        ...(orderIndex !== undefined && { orderIndex: parseInt(orderIndex) }),
        ...(type !== undefined && { type }),
        ...(features !== undefined && { features: Array.isArray(features) ? features : [] }),
        ...(paymentLink !== undefined && { paymentLink }),
        ...(muroGroupId !== undefined && { muroGroupId: muroGroupId || null })
      }
    });

    return NextResponse.json({
      message: "Kurs başarıyla güncellendi.",
      course: updatedCourse
    });
  } catch (error) {
    console.error("Admin Update Course Error:", error);
    return NextResponse.json(
      { error: "Kurs güncellenirken sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Kurs sil
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
        { error: "Lütfen silinecek kursu belirtin." },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id }
    });

    return NextResponse.json({
      message: "Kurs paketi başarıyla silindi."
    });
  } catch (error) {
    console.error("Admin Delete Course Error:", error);
    return NextResponse.json(
      { error: "Kurs silinirken sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}
