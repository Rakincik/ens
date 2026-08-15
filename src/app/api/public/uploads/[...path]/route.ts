import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request, props: { params: Promise<{ path: string[] }> }) {
  try {
    const params = await props.params;
    const filePath = join(process.cwd(), 'public', 'uploads', ...params.path);
    
    if (!existsSync(filePath)) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const file = readFileSync(filePath);
    
    // Basit MIME tespiti
    const extension = params.path[params.path.length - 1].split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    if (extension === 'jpg' || extension === 'jpeg') contentType = 'image/jpeg';
    else if (extension === 'png') contentType = 'image/png';
    else if (extension === 'webp') contentType = 'image/webp';
    else if (extension === 'gif') contentType = 'image/gif';
    else if (extension === 'svg') contentType = 'image/svg+xml';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });
  } catch (error) {
    return new NextResponse('Server Error', { status: 500 });
  }
}
