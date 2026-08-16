import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Pool } from "pg";

// Helper to check if request is from an authorized admin
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

    const muroDbUrl = process.env.MURO_DATABASE_URL;
    if (!muroDbUrl) {
      console.warn("MURO_DATABASE_URL environment variable is not defined.");
      return NextResponse.json({ 
        groups: [], 
        error: "Muro veritabanı bağlantı adresi (MURO_DATABASE_URL) tanımlanmamış." 
      });
    }

    // Connect with a 3 second timeout to avoid hanging the nextjs thread if server is unreachable
    const muroPool = new Pool({
      connectionString: muroDbUrl,
      connectionTimeoutMillis: 3000,
    });

    try {
      const res = await muroPool.query('SELECT "Id" as id, "Name" as name FROM "Groups" ORDER BY "Name" ASC');
      await muroPool.end();
      
      return NextResponse.json({ groups: res.rows });
    } catch (dbError: any) {
      console.error("Muro Database Query Error:", dbError.message);
      // Clean up pool in case of error
      try {
        await muroPool.end();
      } catch (e) {}
      
      return NextResponse.json({ 
        groups: [], 
        error: `Muro veritabanına bağlanılamadı: ${dbError.message || dbError}` 
      });
    }
  } catch (error) {
    console.error("Admin Fetch Muro Groups Error:", error);
    return NextResponse.json(
      { error: "Muro grupları yüklenirken beklenmedik bir hata oluştu." },
      { status: 500 }
    );
  }
}
