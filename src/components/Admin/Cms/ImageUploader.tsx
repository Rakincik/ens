"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Loader2, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  recommendedSize?: string;
  label?: string;
}

export default function ImageUploader({ value, onChange, recommendedSize, label }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      
      // Frontend Image Optimization (Auto WebP & Resize)
      const optimizedBlob = await new Promise<Blob>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new window.Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Canvas context failed"));
            
            // Auto size calculation (max 800px)
            let width = img.width;
            let height = img.height;
            const MAX_SIZE = 800;
            
            if (width > height) {
              if (width > MAX_SIZE) {
                height = Math.round(height * (MAX_SIZE / width));
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width = Math.round(width * (MAX_SIZE / height));
                height = MAX_SIZE;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Fill white background for transparent images
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Canvas toBlob failed"));
              },
              "image/webp",
              0.85
            );
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const formData = new FormData();
      const originalName = file.name.split('.')[0] || 'image';
      formData.append("file", optimizedBlob, `${originalName}.webp`);
      
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
        toast.success("Görsel otomatik optimize edilerek yüklendi.");
      } else {
        toast.error("Görsel yüklenemedi.");
      }
    } catch (error) {
      toast.error("Yükleme sırasında bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {label && <label style={{ fontSize: "13px", fontWeight: 600 }}>{label}</label>}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{ 
          width: "100%", height: "160px", border: "2px dashed var(--border-color)", borderRadius: "8px", 
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          backgroundColor: value ? "transparent" : "#faf9f6", position: "relative", overflow: "hidden",
          transition: "border-color 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-accent)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-color)"}
      >
        {value ? (
          <>
            <img src={value} alt="Uploaded preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div 
              style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }} 
              onMouseEnter={e => e.currentTarget.style.opacity = "1"} 
              onMouseLeave={e => e.currentTarget.style.opacity = "0"}
            >
              <label style={{ cursor: "pointer", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <UploadCloud size={24} />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>Değiştir</span>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              </label>
              <button 
                onClick={(e) => { e.preventDefault(); onChange(""); }}
                style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(255,0,0,0.8)", border: "none", color: "#fff", borderRadius: "50%", padding: "4px", cursor: "pointer" }}
              >
                <X size={14} />
              </button>
            </div>
          </>
        ) : (
          <label style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "var(--text-muted)", width: "100%", height: "100%", justifyContent: "center" }}>
            {uploading ? <Loader2 className="animate-spin" size={28} style={{ color: "var(--color-accent)" }} /> : <ImageIcon size={28} />}
            <span style={{ fontSize: "13px", fontWeight: 500 }}>{uploading ? "Yükleniyor..." : "Sürükle bırak veya tıkla"}</span>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} disabled={uploading} />
          </label>
        )}
      </div>
      <span style={{ fontSize: "11px", color: "var(--color-success, #10b981)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px", fontWeight: 500 }}>
        ✨ Boyut sınırı yok, sistem arka planda otomatik optimize eder
      </span>
    </div>
  );
}
