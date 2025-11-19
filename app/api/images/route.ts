import { NextResponse } from 'next/server';
import { getImages } from '@/lib/store';

export async function GET() {
  try {
    const images = getImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
