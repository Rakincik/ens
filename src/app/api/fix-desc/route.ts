import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const response = await fetch("https://turkceoabtdeyiz.com/frontend/fetch_courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });

    if (!response.ok) {
      throw new Error("Canlı siteden kurs listesi alınamadı.");
    }

    const data = await response.json();
    let updatedCount = 0;
    const errors: string[] = [];

    for (const item of data) {
      if (!item.slug || !item.title) continue;
      
      const course = await prisma.course.findFirst({
        where: { title: item.title }
      });
      
      if (course) {
        try {
          const htmlRes = await fetch(`https://turkceoabtdeyiz.com/urun/${item.slug}`);
          const html = await htmlRes.text();
          
          let descContent = "";
          
          const titleIdx = html.indexOf("Eğitim Hakkında");
          if (titleIdx !== -1) {
            // Find the container div
            const startIdx = html.lastIndexOf("<div", titleIdx);
            if (startIdx !== -1) {
              let depth = 0;
              let pos = startIdx;
              while (pos < html.length) {
                if (html.startsWith("<div", pos)) {
                  depth++;
                  pos += 4;
                } else if (html.startsWith("</div", pos)) {
                  depth--;
                  if (depth === 0) {
                    descContent = html.substring(startIdx, pos + 6);
                    break;
                  }
                  pos += 5;
                } else {
                  pos++;
                }
              }
              if (!descContent) descContent = html.substring(startIdx, startIdx + 8000);
            }
          }
          
          // Fallback if "Eğitim Hakkında" not found or extraction failed
          if (!descContent || descContent.length < 50) {
            const match = html.match(/<div[^>]*class="[^"]*tab-pane[^"]*active[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/?div/i) || html.match(/id="description"[^>]*>([\s\S]*?)<\/div>\s*<\/?div/i);
            if (match) descContent = match[1];
          }
          
          // Final fallback: just get a big chunk around the course title
          if (!descContent || descContent.length < 50) {
             const titlePos = html.indexOf(item.title);
             if (titlePos !== -1) {
               descContent = html.substring(titlePos, titlePos + 5000);
             }
          }

          if (descContent && descContent.length > 50) {
            await prisma.course.update({
              where: { id: course.id },
              data: { description: descContent.trim() }
            });
            updatedCount++;
          } else {
            errors.push(`'${item.title}' için uygun açıklama alanı bulunamadı.`);
          }
        } catch (fetchErr: any) {
          errors.push(`'${item.title}' güncellenemedi: ${fetchErr.message}`);
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${updatedCount} ürünün detayı başarıyla çekildi ve veritabanına işlendi.`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
