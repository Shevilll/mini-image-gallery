import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from './route';
import * as store from '@/lib/store';

vi.mock('@/lib/store', () => ({
  getImages: vi.fn(),
}));

describe('GET /api/images', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array when no images exist', async () => {
    vi.mocked(store.getImages).mockReturnValue([]);

    const request = new Request('http://localhost:3000/api/images');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should return array of image metadata', async () => {
    const mockImages = [
      {
        id: 'test-1',
        filename: 'test1.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        createdAt: 12345,
      },
      {
        id: 'test-2',
        filename: 'test2.png',
        mimeType: 'image/png',
        size: 2048,
        createdAt: 12346,
      },
    ];

    vi.mocked(store.getImages).mockReturnValue(mockImages);

    const request = new Request('http://localhost:3000/api/images');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockImages);
    expect(store.getImages).toHaveBeenCalledTimes(1);
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(store.getImages).mockImplementation(() => {
      throw new Error('Database error');
    });

    const request = new Request('http://localhost:3000/api/images');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch images');
  });
});
