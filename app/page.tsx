"use client";

import { useState } from "react";
import { UploadArea } from "@/components/upload-area";
import { GalleryGrid } from "@/components/gallery-grid";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <header className="border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-base sm:text-lg">
                G
              </span>
            </div>
            <h1 className="font-semibold text-base sm:text-lg tracking-tight">
              Mini Gallery
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Share your moments
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg text-pretty px-4 sm:px-0">
            A simple, fast, and elegant way to share images. Upload your
            favorite photos and view them instantly in a beautiful grid.
          </p>
        </div>

        <UploadArea onUploadComplete={handleUploadComplete} />

        <div className="mt-12 sm:mt-20">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold">Recent Uploads</h3>
            <span className="text-[10px] sm:text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
              Auto-updates
            </span>
          </div>
          <GalleryGrid refreshTrigger={refreshTrigger} />
        </div>
      </main>

      <footer className="border-t border-border/40 mt-12 sm:mt-20 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            Website Designed & Developed by{" "}
            <a
              href="https://theahmadfaraz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors duration-200"
            >
              Ahmad Faraz
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
