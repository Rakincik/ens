import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurunuz." },
        { status: 400 }
      );
    }

    const supportMessage = await prisma.supportMessage.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mesajınız başarıyla iletildi.",
      data: supportMessage
    });
  } catch (error) {
    console.error("Contact Form Submission Error:", error);
    return NextResponse.json(
      { error: "Mesajınız gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
