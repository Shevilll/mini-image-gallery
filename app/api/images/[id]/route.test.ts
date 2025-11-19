import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DELETE } from './route';
import * as store from '@/lib/store';

vi.mock('@/lib/store', () => ({
  deleteImage: vi.fn(),
}));

describe('DELETE /api/images/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 404 when image does not exist', async () => {
    vi.mocked(store.deleteImage).mockReturnValue(false);

    const request = new Request('http://localhost:3000/api/images/non-existent', {
      method: 'DELETE',
    });
    const response = await DELETE(request, { params: { id: 'non-existent' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Image not found');
  });

  it('should successfully delete an existing image', async () => {
    vi.mocked(store.deleteImage).mockReturnValue(true);

    const request = new Request('http://localhost:3000/api/images/test-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, { params: { id: 'test-1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(store.deleteImage).toHaveBeenCalledWith('test-1');
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(store.deleteImage).mockImplementation(() => {
      throw new Error('Database error');
    });

    const request = new Request('http://localhost:3000/api/images/test-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, { params: { id: 'test-1' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to delete image');
  });
});
