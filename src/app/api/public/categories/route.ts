import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    
    const whereClause: any = type ? { type } : {};
    
    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: { orderIndex: "asc" }
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: "Hata" }, { status: 500 });
  }
}
