"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, ImageIcon, Download, Link as LinkIcon, X } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ImageRecord {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: number;
}

interface GalleryGridProps {
  refreshTrigger: number;
}

export function GalleryGrid({ refreshTrigger }: GalleryGridProps) {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageRecord | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/images");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      } else {
        console.error("Failed to fetch images");
      }
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [refreshTrigger]);

  const openDeleteDialogFor = (image: ImageRecord) => {
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClick = (image: ImageRecord) => {
    openDeleteDialogFor(image);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;

    setDeletingId(imageToDelete.id);
    try {
      const res = await fetch(`/api/images/${imageToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));
        if (selectedImage?.id === imageToDelete.id) {
          setModalOpen(false);
          setSelectedImage(null);
        }
      } else {
        console.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Failed to delete image", error);
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  const openModal = (image: ImageRecord) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedImage(null), 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalOpen) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!modalOpen) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [modalOpen]);

  const humanFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (unix: number) => {
    try {
      const d = new Date(unix);
      return d.toLocaleString();
    } catch {
      return String(unix);
    }
  };

  const copyLink = async (id?: string) => {
    if (!id) return;
    const url = `${location.origin}/api/view/${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const downloadHrefFor = (id?: string) => {
    if (!id) return "#";
    return `/api/view/${id}?download=1`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-square bg-secondary animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 sm:py-20 text-muted-foreground">
        <div className="bg-secondary/50 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 opacity-50" />
        </div>
        <p className="text-sm sm:text-base">No images uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            onClick={() => openModal(image)}
            className="group relative aspect-square bg-secondary rounded-xl overflow-hidden border border-border hover:border-primary/20 transition-colors cursor-pointer"
          >
            <Image
              src={`/api/view/${image.id}`}
              alt={image.filename}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end justify-between p-3 sm:p-4 opacity-0 group-hover:opacity-100">
              <div className="text-white text-xs truncate max-w-[70%] font-medium">
                {image.filename}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(image);
                }}
                disabled={deletingId === image.id}
                className="p-2 bg-white/10 hover:bg-red-500/80 backdrop-blur-md rounded-full text-white transition-all duration-200 disabled:opacity-50"
                title="Delete image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${selectedImage.filename}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            ref={modalRef}
            className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-popover rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between gap-3 p-3 sm:p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium truncate max-w-[60vw]">
                  {selectedImage.filename}
                </div>
                <div className="text-xs text-muted-foreground">
                  • {humanFileSize(selectedImage.size)} •{" "}
                  {formatDate(selectedImage.createdAt)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    copyLink(selectedImage.id);
                  }}
                  title="Copy image link"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm hover:bg-muted/60"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy link</span>
                </button>

                <a
                  href={downloadHrefFor(selectedImage.id)}
                  onClick={(e) => e.stopPropagation()}
                  title="Download"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm hover:bg-muted/60"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialogFor(selectedImage);
                  }}
                  title="Delete"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeModal();
                  }}
                  title="Close"
                  className="p-2 rounded-md hover:bg-muted/60"
                  aria-label="Close image viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-black flex items-center justify-center">
              <div className="relative w-full max-h-[80vh]">
                <div className="w-full h-[70vh] relative">
                  <Image
                    src={`/api/view/${selectedImage.id}`}
                    alt={selectedImage.filename}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 border-t border-border text-sm text-muted-foreground flex items-center justify-between gap-3">
              <div className="truncate">
                {selectedImage.mimeType} · {humanFileSize(selectedImage.size)}
              </div>
              <div className="text-xs text-muted-foreground">
                ID: {selectedImage.id}
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {imageToDelete?.filename}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
