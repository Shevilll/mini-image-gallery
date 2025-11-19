import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from './route';
import * as store from '@/lib/store';

// Mock the store module
vi.mock('@/lib/store', () => ({
  addImage: vi.fn(),
  images: [],
}));

describe('POST /api/upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject requests without a file', async () => {
    const formData = new FormData();
    const request = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No file uploaded');
  });

  it('should reject files that are not JPEG or PNG', async () => {
    const formData = new FormData();
    const file = new File(['test'], 'test.gif', { type: 'image/gif' });
    formData.append('file', file);

    const request = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Only JPEG and PNG files are allowed');
  });

  it('should reject files larger than 3MB', async () => {
    const formData = new FormData();
    // Create a file larger than 3MB
    const largeBuffer = new ArrayBuffer(4 * 1024 * 1024); // 4MB
    const file = new File([largeBuffer], 'large.jpg', { type: 'image/jpeg' });
    formData.append('file', file);

    const request = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('File size must be less than 3MB');
  });

  it('should accept valid JPEG files', async () => {
    const formData = new FormData();
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    formData.append('file', file);

    const request = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();
    expect(store.addImage).toHaveBeenCalled();
  });

  it('should accept valid PNG files', async () => {
    const formData = new FormData();
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    formData.append('file', file);

    const request = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();
    expect(store.addImage).toHaveBeenCalled();
  });
});
