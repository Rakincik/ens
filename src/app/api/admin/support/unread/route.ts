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

export async function GET() {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const unreadCount = await prisma.supportMessage.count({
      where: { isRead: false },
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("Admin Support Unread Error:", error);
    return NextResponse.json({ error: "Hata" }, { status: 500 });
  }
}
