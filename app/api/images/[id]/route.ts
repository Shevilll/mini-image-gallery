import { NextRequest, NextResponse } from 'next/server';
import { deleteImage } from '@/lib/store';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = deleteImage(id);

  if (success) {
    return NextResponse.json({ message: 'Image deleted successfully' });
  } else {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}
