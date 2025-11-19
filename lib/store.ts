export type ImageRecord = {
  id: string;
  filename: string;
  mimeType: string;
  data: Buffer;
  size: number;
  createdAt: number;
};

const globalForImages = globalThis as unknown as { images: ImageRecord[] };

if (!globalForImages.images) {
  globalForImages.images = [];
}

export const images = globalForImages.images;

export function addImage(image: ImageRecord) {
  images.unshift(image);
}

export function getImages() {
  // Return metadata only, not the full binary data
  return images.map(({ id, filename, mimeType, size, createdAt }) => ({
    id,
    filename,
    mimeType,
    size,
    createdAt,
  }));
}

export function getImage(id: string) {
  return images.find((img) => img.id === id);
}

export function deleteImage(id: string) {
  const index = images.findIndex((img) => img.id === id);
  if (index > -1) {
    images.splice(index, 1);
    return true;
  }
  return false;
}
