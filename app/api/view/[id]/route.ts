import { NextRequest, NextResponse } from 'next/server';
import { getImage } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = getImage(id);

  if (!image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  // Return the image binary data with the correct Content-Type
  return new NextResponse(image.data, {
    headers: {
      'Content-Type': image.mimeType,
      'Content-Length': image.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
