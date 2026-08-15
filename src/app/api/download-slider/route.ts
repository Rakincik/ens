import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'slider');
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const results = [];

    for (let i = 1; i <= 9; i++) {
      const url = `https://toa.muro.click/slider/${i}.png`;
      const dest = path.join(dir, `${i}.png`);
      
      try {
        const response = await fetch(url);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          fs.writeFileSync(dest, buffer);
          results.push(`Downloaded ${i}.png`);
        } else {
            // Belki uzantısı jpg'dir
            const urlJpg = `https://toa.muro.click/slider/${i}.jpg`;
            const responseJpg = await fetch(urlJpg);
            if(responseJpg.ok) {
                const arrayBuffer = await responseJpg.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                fs.writeFileSync(path.join(dir, `${i}.jpg`), buffer);
                results.push(`Downloaded ${i}.jpg`);
            } else {
                results.push(`Failed ${i} (both png and jpg): ${response.status}`);
            }
        }
      } catch (err: any) {
        results.push(`Error ${i}.png: ${err.message}`);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
