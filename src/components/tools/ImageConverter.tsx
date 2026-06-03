"use client";

/**
 * ImageConverter — image format conversion (jpg↔png, bmp→png) and image↔base64.
 * Uses Canvas API client-side; no uploads.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell, ToolBar } from "@/components/tool-shell";
import {
  fileToBase64,
  convertImageFormat,
  dataUrlToBase64,
  base64ToDataUrl,
} from "@/lib/engines/image";

type Mode = "img-convert" | "img-to-base64" | "base64-to-img";

function modeFromId(id: string): Mode {
  if (
    id === "image-to-base64" ||
    id === "jpg-to-base64" ||
    id === "png-to-base64"
  )
    return "img-to-base64";
  if (id === "base64-to-image") return "base64-to-img";
  return "img-convert";
}

const TARGET_MIME: Record<string, "image/png" | "image/jpeg"> = {
  "jpg-to-png": "image/png",
  "png-to-jpg": "image/jpeg",
  "bmp-to-png": "image/png",
};

export default function ImageConverter() {
  const tool = useToolMeta();
  const mode = useMemo(() => modeFromId(tool.id), [tool.id]);
  const targetMime = useMemo(
    () => TARGET_MIME[tool.id] ?? "image/png",
    [tool.id],
  );

  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string>("");
  const [base64Input, setBase64Input] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setStatus("Processing…");
      setOutputUrl("");
      setBase64Output("");

      const r = await fileToBase64(file);
      if (!r.ok) {
        setError(r.error);
        setStatus("");
        return;
      }
      const dataUrl = r.value;

      if (mode === "img-to-base64") {
        const b64 = dataUrlToBase64(dataUrl);
        if (!b64.ok) {
          setError(b64.error);
          setStatus("");
          return;
        }
        setBase64Output(b64.value);
        setStatus("Done.");
        return;
      }

      // img-convert
      const converted = await convertImageFormat(dataUrl, targetMime);
      if (!converted.ok) {
        setError(converted.error);
        setStatus("");
        return;
      }
      setOutputUrl(converted.value);
      setStatus("Done.");
    },
    [mode, targetMime],
  );

  const handleBase64Convert = useCallback(() => {
    setError(null);
    const b64 = base64Input.trim();
    if (!b64) {
      setError("Paste a Base64 string.");
      return;
    }
    // try common image mime types
    const mime = b64.startsWith("/9j") ? "image/jpeg" : "image/png";
    const url = base64ToDataUrl(b64, mime);
    setOutputUrl(url);
    setStatus("Done.");
  }, [base64Input]);

  const download = useCallback(() => {
    const src =
      outputUrl ||
      (base64Output
        ? `data:text/plain;charset=utf-8,${encodeURIComponent(base64Output)}`
        : "");
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    const ext = tool.id.includes("png")
      ? "png"
      : tool.id.includes("jpg")
      ? "jpg"
      : "bin";
    a.download = `output.${ext}`;
    a.click();
  }, [outputUrl, base64Output, tool.id]);

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={error}
      toolbar={
        <ToolBar
          output={outputUrl || base64Output}
          downloadName="output"
          onClear={() => {
            setOutputUrl("");
            setBase64Output("");
            setStatus("");
            setBase64Input("");
          }}
        />
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          maxWidth: "640px",
        }}
      >
        {mode === "base64-to-img" ? (
          <>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-text-secondary)",
                }}
              >
                Base64 String
              </span>
              <textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                rows={6}
                className="mono"
                placeholder="Paste Base64 image data here…"
                style={{ resize: "vertical" }}
              />
            </label>
            <button className="btn btn-primary" onClick={handleBase64Convert}>
              Convert →
            </button>
          </>
        ) : (
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
              }}
            >
              Upload Image
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>
        )}

        {status && (
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            {status}
          </p>
        )}

        {base64Output && (
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
              }}
            >
              Base64 Output
            </span>
            <textarea
              value={base64Output}
              readOnly
              rows={8}
              className="mono"
              style={{ resize: "vertical" }}
            />
          </label>
        )}

        {outputUrl && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
              }}
            >
              Preview
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={outputUrl}
              alt="converted output"
              style={{
                maxWidth: "100%",
                borderRadius: "0.5rem",
                border: "1px solid var(--color-border)",
              }}
            />
            <button className="btn btn-secondary" onClick={download}>
              Download
            </button>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
