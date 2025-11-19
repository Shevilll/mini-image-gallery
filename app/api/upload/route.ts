import { NextRequest, NextResponse } from 'next/server';
import { addImage } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validation: File exists
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validation: File is an image (JPEG or PNG)
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG and PNG are allowed.' },
        { status: 400 }
      );
    }

    // Validation: File size <= 3MB
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 3MB limit.' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const newImage = {
      id: uuidv4(),
      filename: file.name,
      mimeType: file.type,
      data: buffer,
      size: file.size,
      createdAt: Date.now(),
    };

    addImage(newImage);

    return NextResponse.json(
      {
        message: 'Image uploaded successfully',
        image: {
          id: newImage.id,
          filename: newImage.filename,
          mimeType: newImage.mimeType,
          size: newImage.size,
          createdAt: newImage.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
