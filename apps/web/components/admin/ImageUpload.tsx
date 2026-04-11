"use client";

/**
 * Drop-in image upload button for admin forms.
 * Uploads directly from the browser to Cloudinary (unsigned preset).
 * No server-side code needed — just sets the returned URL in state.
 *
 * Usage:
 *   <ImageUpload value={form.imageUrl} onChange={(url) => setForm(f => ({ ...f, imageUrl: url }))} />
 *
 * Required env vars (baked at build time):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME   — e.g. "dxyz1234"
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET — e.g. "ml_default" (must be Unsigned)
 */

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  /** "image" (default) or "auto" (images + videos) */
  resourceType?: "image" | "auto";
  /** Shape of the preview: "rect" (default) or "circle" */
  previewShape?: "rect" | "circle";
};

export function ImageUpload({
  value,
  onChange,
  label,
  hint,
  resourceType = "image",
  previewShape = "rect",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

  async function handleFile(file: File) {
    if (!configured) {
      setError("Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);

      const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
      const res = await fetch(endpoint, { method: "POST", body: fd });
      if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText);
        throw new Error(msg);
      }
      const json = (await res.json()) as { secure_url: string };
      onChange(json.secure_url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (file) handleFile(file);
    ev.target.value = "";
  }

  function onDrop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    const file = ev.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const hasImage = value.trim().startsWith("http");

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium leading-none">{label}</p>}

      {/* URL input — always visible so pasting a URL still works */}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… or upload below"
        className="border-[#E5E7EB]"
      />

      {/* Drop zone / upload button */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#E5E7EB] bg-[#F8FAFC] px-4 py-5 text-center transition hover:border-[#22C55E]"
      >
        {uploading ? (
          <p className="text-sm text-muted-foreground">Uploading…</p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              Drag & drop an image here, or
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={!configured}
            >
              Upload from computer
            </Button>
            {!configured && (
              <p className="text-[11px] text-amber-600">
                Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + UPLOAD_PRESET to enable uploads.
              </p>
            )}
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={resourceType === "auto" ? "image/*,video/*" : "image/*"}
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      {/* Preview */}
      {hasImage && (
        <div className="mt-1">
          <p className="mb-1 text-xs text-muted-foreground">Preview</p>
          <div
            className={`relative overflow-hidden border bg-muted ${
              previewShape === "circle"
                ? "h-24 w-24 rounded-full"
                : "h-32 w-full max-w-xs rounded-lg"
            }`}
          >
            <Image
              src={value.trim()}
              alt="preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
