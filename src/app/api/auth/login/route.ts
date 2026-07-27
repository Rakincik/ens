import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Lütfen e-posta ve şifrenizi girin." },
        { status: 400 }
      );
    }

    // Kullanıcıyı veritabanında bul
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Hatalı e-posta adresi veya şifre." },
        { status: 401 }
      );
    }

    // Şifreyi doğrula (Hem yeni düz metin şifreler, hem de eski hashli şifreler için destek)
    let isPasswordValid = false;
    
    if (user.passwordHash === password) {
      isPasswordValid = true;
    } else {
      try {
        isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      } catch (err) {
        isPasswordValid = false;
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Hatalı e-posta adresi veya şifre." },
        { status: 401 }
      );
    }

    // JWT token oluştur
    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      surname: user.surname,
    });

    const response = NextResponse.json({
      message: "Giriş başarıyla sağlandı.",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        surname: user.surname,
      },
    });

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
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Giriş işlemi sırasında sistemsel bir hata oluştu." },
      { status: 500 }
    );
  }
}
