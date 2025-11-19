import { describe, it, expect, beforeEach } from 'vitest';
import { addImage, getImages, getImage, deleteImage, images, ImageRecord } from './store';

describe('Image Store', () => {
  beforeEach(() => {
    // Clear the store before each test
    images.length = 0;
  });

  describe('addImage', () => {
    it('should add an image to the store', () => {
      const mockImage: ImageRecord = {
        id: 'test-1',
        filename: 'test.jpg',
        mimeType: 'image/jpeg',
        data: Buffer.from('test'),
        size: 1024,
        createdAt: Date.now(),
      };

      addImage(mockImage);
      expect(images).toHaveLength(1);
      expect(images[0]).toEqual(mockImage);
    });

    it('should add new images to the beginning of the array', () => {
      const image1: ImageRecord = {
        id: 'test-1',
        filename: 'test1.jpg',
        mimeType: 'image/jpeg',
        data: Buffer.from('test1'),
        size: 1024,
        createdAt: Date.now(),
      };

      const image2: ImageRecord = {
        id: 'test-2',
        filename: 'test2.jpg',
        mimeType: 'image/jpeg',
        data: Buffer.from('test2'),
        size: 2048,
        createdAt: Date.now(),
      };

      addImage(image1);
      addImage(image2);

      expect(images[0].id).toBe('test-2');
      expect(images[1].id).toBe('test-1');
    });
  });

  describe('getImages', () => {
    it('should return empty array when no images exist', () => {
      const result = getImages();
      expect(result).toEqual([]);
    });

    it('should return image metadata without binary data', () => {
      const mockImage: ImageRecord = {
        id: 'test-1',
        filename: 'test.jpg',
        mimeType: 'image/jpeg',
        data: Buffer.from('test'),
        size: 1024,
        createdAt: 12345,
      };

      addImage(mockImage);
      const result = getImages();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'test-1',
        filename: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        createdAt: 12345,
      });
      expect(result[0]).not.toHaveProperty('data');
    });
  });

  describe('getImage', () => {
    it('should return undefined for non-existent image', () => {
      const result = getImage('non-existent');
      expect(result).toBeUndefined();
    });

    it('should return the full image record including binary data', () => {
      const mockImage: ImageRecord = {
        id: 'test-1',
        filename: 'test.jpg',
        mimeType: 'image/jpeg',
        data: Buffer.from('test'),
        size: 1024,
        createdAt: Date.now(),
      };

      addImage(mockImage);
      const result = getImage('test-1');

      expect(result).toEqual(mockImage);
      expect(result?.data).toBeInstanceOf(Buffer);
    });
  });

  describe('deleteImage', () => {
    it('should return false when deleting non-existent image', () => {
      const result = deleteImage('non-existent');
      expect(result).toBe(false);
    });

    it('should delete an existing image and return true', () => {
      const mockImage: ImageRecord = {
        id: 'test-1',
        filename: 'test.jpg',
        mimeType: 'image/jpeg',
        data: Buffer.from('test'),
        size: 1024,
        createdAt: Date.now(),
      };

      addImage(mockImage);
      expect(images).toHaveLength(1);

      const result = deleteImage('test-1');
      expect(result).toBe(true);
      expect(images).toHaveLength(0);
    });

    it('should only delete the specified image', () => {
      const image1: ImageRecord = {
        id: 'test-1',
        filename: 'test1.jpg',
        mimeType: 'image/jpeg',
        data: Buffer.from('test1'),
        size: 1024,
        createdAt: Date.now(),
      };

      const image2: ImageRecord = {
        id: 'test-2',
        filename: 'test2.jpg',
        mimeType: 'image/jpeg',
        data: Buffer.from('test2'),
        size: 2048,
        createdAt: Date.now(),
      };

      addImage(image1);
      addImage(image2);

      deleteImage('test-1');
      expect(images).toHaveLength(1);
      expect(images[0].id).toBe('test-2');
    });
  });
});
