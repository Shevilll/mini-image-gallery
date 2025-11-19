"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  onUploadComplete: () => void;
}

export function UploadArea({ onUploadComplete }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Reset state
    setStatus("idle");
    setErrorMessage("");
    setProgress(0);

    // Validate type
    if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
      setStatus("error");
      setErrorMessage("Only JPEG and PNG files are allowed.");
      return;
    }

    // Validate size (3MB)
    if (selectedFile.size > 3 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage("File size must be less than 3MB.");
      return;
    }

    setFile(selectedFile);
  };

  const uploadFile = () => {
    if (!file) return;

    setStatus("uploading");
    setProgress(0);

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus("success");
        setProgress(100);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => {
          setStatus("idle");
          setProgress(0);
        }, 2000);
        onUploadComplete();
      } else {
        setStatus("error");
        try {
          const response = JSON.parse(xhr.responseText);
          setErrorMessage(response.error || "Upload failed");
        } catch (e) {
          setErrorMessage("Upload failed");
        }
      }
    });

    xhr.addEventListener("error", () => {
      setStatus("error");
      setErrorMessage("Network error occurred");
    });

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8 sm:mb-12 px-4 sm:px-0">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all duration-200 ease-in-out text-center",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-secondary/50",
          status === "error" && "border-destructive/50 bg-destructive/5",
          status === "success" && "border-green-500/50 bg-green-500/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png"
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
          {status === "success" ? (
            <div className="text-green-500 flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 mb-2" />
              <p className="font-medium text-sm sm:text-base">
                Upload Complete!
              </p>
            </div>
          ) : (
            <>
              {previewUrl ? (
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-border shadow-sm">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="p-3 sm:p-4 rounded-full bg-secondary">
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium">
                  {file ? file.name : "Drag & drop or click to upload"}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  JPEG or PNG up to 3MB
                </p>
              </div>

              {file && status !== "uploading" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setFile(null);
                      setStatus("idle");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={uploadFile}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Upload Image
                  </button>
                </div>
              )}
            </>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 text-destructive text-xs sm:text-sm mt-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status === "uploading" && (
            <div className="w-full mt-3 sm:mt-4 space-y-2">
              <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {!file && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 w-full h-full cursor-pointer"
            aria-label="Select file"
          />
        )}
      </div>
    </div>
  );
}
