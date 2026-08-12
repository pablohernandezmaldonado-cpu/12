"use client";

import { useRef, useState } from "react";

const MAX_MB = 4;

export default function ImageUploadField({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<
    { type: "idle" } | { type: "loading" } | { type: "error"; msg: string }
  >({ type: "idle" });
  const [previaLocal, setPreviaLocal] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", msg: "Ese archivo no es una imagen." });
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setStatus({ type: "error", msg: `La imagen pesa más de ${MAX_MB} MB. Usa una más liviana.` });
      return;
    }

    // Vista previa instantánea, antes de que termine de subir
    const objectUrl = URL.createObjectURL(file);
    setPreviaLocal(objectUrl);
    setStatus({ type: "loading" });

    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
      reader.readAsDataURL(file);
    });

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataUrl, folder }),
      });
      const result = await res.json();
      if (!result.ok) {
        setStatus({ type: "error", msg: result.error || "No se pudo subir la imagen." });
        return;
      }
      onChange(result.url);
      setStatus({ type: "idle" });
    } catch {
      setStatus({ type: "error", msg: "No se pudo conectar con el servidor." });
    } finally {
      URL.revokeObjectURL(objectUrl);
      setPreviaLocal(null);
    }
  }

  const imagenAMostrar = previaLocal || value;

  return (
    <div className="img-upload">
      {imagenAMostrar ? (
        <div className="img-upload-preview-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagenAMostrar} alt="Vista previa" className="img-upload-preview" />
          {status.type === "loading" && <div className="img-upload-spinner">Subiendo...</div>}
        </div>
      ) : (
        <div className="img-upload-empty">Sin foto</div>
      )}
      <div className="img-upload-controls">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className="btn-secondary"
          onClick={() => inputRef.current?.click()}
          disabled={status.type === "loading"}
        >
          {status.type === "loading" ? "Subiendo..." : value ? "Cambiar foto" : "Subir foto"}
        </button>
        {value && (
          <button type="button" className="btn-danger" style={{ marginTop: 0 }} onClick={() => onChange("")}>
            Quitar foto
          </button>
        )}
        {status.type === "error" && <span className="img-upload-status err">{status.msg}</span>}
        {status.type === "idle" && (
          <span className="img-upload-status">JPG, PNG, WEBP, GIF o SVG · hasta {MAX_MB} MB</span>
        )}
      </div>
    </div>
  );
}
