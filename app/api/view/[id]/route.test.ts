import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from './route';
import * as store from '@/lib/store';
import { NextResponse } from 'next/server';

vi.mock('@/lib/store', () => ({
  getImage: vi.fn(),
}));

describe('GET /api/view/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 404 when image does not exist', async () => {
    vi.mocked(store.getImage).mockReturnValue(undefined);

    const request = new Request('http://localhost:3000/api/view/non-existent');
    const response = await GET(request, { params: Promise.resolve({ id: 'non-existent' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Image not found');
  });

  it('should return the image data with correct headers', async () => {
    const mockImage = {
      id: 'test-1',
      filename: 'test.jpg',
      mimeType: 'image/jpeg',
      data: Buffer.from('test image content'),
      size: 18,
      createdAt: 12345,
    };

    vi.mocked(store.getImage).mockReturnValue(mockImage);

    const request = new Request('http://localhost:3000/api/view/test-1');
    const response = await GET(request, { params: Promise.resolve({ id: 'test-1' }) });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/jpeg');
    expect(response.headers.get('Content-Length')).toBe('18');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
    
    // Verify body content
    const buffer = await response.arrayBuffer();
    expect(Buffer.from(buffer)).toEqual(mockImage.data);
  });
});
