/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Input } from "@/components/ui/input";
import { Image as ImageIcon, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo } from "react";

interface FormImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
}

export function FormImageUpload({ value, onChange }: FormImageUploadProps) {
  const files = value || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onChange([...files, ...newFiles].slice(0, 10)); // Max 10 images
    }
  };

  const removeImage = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const previews = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file));
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {previews.map((src, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border"
          >
            <Image
              src={src}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {files.length < 10 && (
          <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-primary hover:text-primary cursor-pointer transition-colors">
            <UploadCloud className="w-8 h-8" />
            <span className="text-xs text-center mt-2">
              Upload ({files.length}/10)
            </span>
            <Input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
      {files.length === 0 && (
        <div className="mt-4 p-6 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
          <ImageIcon className="w-12 h-12" />
          <p className="mt-2 text-sm">No images uploaded yet.</p>
          <p className="text-xs">Upload up to 10 images.</p>
        </div>
      )}
    </div>
  );
}
