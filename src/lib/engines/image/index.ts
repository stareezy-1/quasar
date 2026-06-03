/**
 * Image engine — Canvas-API-based image format conversion and Base64 helpers.
 * All functions are async since they rely on browser APIs (Image, Canvas).
 */

import { type EngineResult, ok, err } from "@/types/engines";

/** Convert an image File/Blob to a Base64 data URL. */
export function fileToBase64(file: File): Promise<EngineResult<string>> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(ok(reader.result as string));
    reader.onerror = () => resolve(err("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

/** Extract the raw Base64 string (without the data URL prefix). */
export function dataUrlToBase64(dataUrl: string): EngineResult<string> {
  const match = /^data:[^;]+;base64,(.+)$/.exec(dataUrl);
  if (!match) return err("Not a valid Base64 data URL.");
  return ok(match[1]!);
}

/** Reconstruct a data URL from a Base64 string + mime type. */
export function base64ToDataUrl(b64: string, mime: string): string {
  return `data:${mime};base64,${b64.trim()}`;
}

/**
 * Convert an image from one MIME type to another using a Canvas element.
 * @param dataUrl  Input image as a data URL.
 * @param targetMime  e.g. "image/png" | "image/jpeg"
 * @param quality  JPEG quality 0–1 (ignored for PNG).
 */
export function convertImageFormat(
  dataUrl: string,
  targetMime: "image/png" | "image/jpeg" | "image/webp",
  quality = 0.92,
): Promise<EngineResult<string>> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(err("Image conversion requires a browser environment."));
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(err("Canvas context unavailable."));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const result = canvas.toDataURL(targetMime, quality);
      resolve(ok(result));
    };
    img.onerror = () => resolve(err("Could not load image."));
    img.src = dataUrl;
  });
}

/** Get image dimensions from a data URL. */
export function getImageDimensions(
  dataUrl: string,
): Promise<EngineResult<{ width: number; height: number }>> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(err("Requires browser."));
      return;
    }
    const img = new Image();
    img.onload = () =>
      resolve(ok({ width: img.naturalWidth, height: img.naturalHeight }));
    img.onerror = () => resolve(err("Could not load image."));
    img.src = dataUrl;
  });
}
