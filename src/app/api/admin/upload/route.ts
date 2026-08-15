import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) return null;

  const payload = await verifyToken(tokenCookie.value);
  if (!payload || payload.role !== "ADMIN") return null;

  return payload;
}

export async function POST(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save folder path: public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate a unique filename using timestamp and random string
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const fileExtension = originalName.split(".").pop();
    const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const fileUrl = `/api/public/uploads/${fileName}`;

    return NextResponse.json({
      message: "Dosya başarıyla yüklendi.",
      url: fileUrl
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Dosya yüklenirken hata oluştu." }, { status: 500 });
  }
}
