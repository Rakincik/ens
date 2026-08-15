import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await prisma.contentSettings.findUnique({
        where: { key },
      });
      
      let parsedValue = null;
      if (setting) {
        let val = setting.value;
        parsedValue = JSON.parse(val);
      }
      
      return NextResponse.json({
        key,
        value: parsedValue,
      });
    }

    const settings = await prisma.contentSettings.findMany();
    const formattedSettings = settings.reduce((acc: any, current) => {
      let val = current.value;
      
      acc[current.key] = JSON.parse(val);
      return acc;
    }, {});

    return NextResponse.json({ settings: formattedSettings });
  } catch (error) {
    console.error("Public Fetch Settings Error:", error);
    return NextResponse.json(
      { error: "İçerik ayarları yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
