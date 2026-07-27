import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, name, surname, phone } = await request.json();

    if (!email || !password || !name || !surname || !phone) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    if (phone.startsWith("0")) {
      return NextResponse.json(
        { error: "Telefon numarası 0 ile başlayamaz." },
        { status: 400 }
      );
    }

    // E-posta benzersizlik kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresiyle zaten bir kullanıcı kayıtlı." },
        { status: 400 }
      );
    }

    // KURAL DEĞİŞİKLİĞİ: Şifreler hashlenmeyecek (Test Projesi)
    const passwordHash = password;

    // Kullanıcıyı veritabanında oluştur (İlk kaydolan kişi admin olabilir mi? Hayır, varsayılan STUDENT'tır.
    // Ancak veritabanında hiç kullanıcı yoksa ilk kişiyi ADMIN yapabiliriz, böylece test etmek çok kolay olur!)
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "ADMIN" : "STUDENT";

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        surname,
        phone,
        role,
      },
    });

    // JWT token oluştur
    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
    });

    const response = NextResponse.json(
      {
        message: "Kayıt işlemi başarıyla tamamlandı.",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          surname: user.surname,
          phone: user.phone,
        },
      },
      { status: 201 }
    );

    // HttpOnly cookie olarak token kaydet
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Kayıt işlemi sırasında sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}
