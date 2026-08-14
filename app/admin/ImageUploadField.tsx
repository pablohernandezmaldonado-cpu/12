"use client";

import { useRef, useState } from "react";
import { optimizarImagen } from "./optimizarImagen";

const MAX_MB = 8; // límite de lo que aceptamos ANTES de optimizar

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
    | { type: "idle" }
    | { type: "optimizando" }
    | { type: "subiendo" }
    | { type: "error"; msg: string }
    | { type: "ok"; msg: string }
  >({ type: "idle" });
  const [previaLocal, setPreviaLocal] = useState<string | null>(null);

  async function handleFile(archivoOriginal: File) {
    if (!archivoOriginal.type.startsWith("image/")) {
      setStatus({ type: "error", msg: "Ese archivo no es una imagen." });
      return;
    }
    if (archivoOriginal.size > MAX_MB * 1024 * 1024) {
      setStatus({ type: "error", msg: `La imagen pesa más de ${MAX_MB} MB. Usa una más liviana.` });
      return;
    }

    // Vista previa instantánea, antes de optimizar y subir
    const objectUrl = URL.createObjectURL(archivoOriginal);
    setPreviaLocal(objectUrl);
    setStatus({ type: "optimizando" });

    let archivo = archivoOriginal;
    try {
      archivo = await optimizarImagen(archivoOriginal);
    } catch {
      // si la optimización falla por algún motivo, seguimos con la original
      archivo = archivoOriginal;
    }

    setStatus({ type: "subiendo" });

    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
      reader.readAsDataURL(archivo);
    });

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: archivo.name, dataUrl, folder }),
      });
      const result = await res.json();
      if (!result.ok) {
        setStatus({ type: "error", msg: result.error || "No se pudo subir la imagen." });
        return;
      }
      onChange(result.url);
      const antes = (archivoOriginal.size / 1024 / 1024).toFixed(1);
      const despues = (archivo.size / 1024 / 1024).toFixed(1);
      if (archivo.size < archivoOriginal.size * 0.95) {
        setStatus({ type: "ok", msg: `Optimizada: ${antes} MB → ${despues} MB` });
      } else {
        setStatus({ type: "idle" });
      }
    } catch {
      setStatus({ type: "error", msg: "No se pudo conectar con el servidor." });
    } finally {
      URL.revokeObjectURL(objectUrl);
      setPreviaLocal(null);
    }
  }

  const imagenAMostrar = previaLocal || value;
  const cargando = status.type === "optimizando" || status.type === "subiendo";

  return (
    <div className="img-upload">
      {imagenAMostrar ? (
        <div className="img-upload-preview-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagenAMostrar} alt="Vista previa" className="img-upload-preview" />
          {status.type === "optimizando" && <div className="img-upload-spinner">Optimizando...</div>}
          {status.type === "subiendo" && <div className="img-upload-spinner">Subiendo...</div>}
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
          disabled={cargando}
        >
          {status.type === "optimizando"
            ? "Optimizando..."
            : status.type === "subiendo"
            ? "Subiendo..."
            : value
            ? "Cambiar foto"
            : "Subir foto"}
        </button>
        {value && !cargando && (
          <button type="button" className="btn-danger" style={{ marginTop: 0 }} onClick={() => onChange("")}>
            Quitar foto
          </button>
        )}
        {status.type === "error" && <span className="img-upload-status err">{status.msg}</span>}
        {status.type === "ok" && <span className="img-upload-status ok">{status.msg}</span>}
        {status.type === "idle" && (
          <span className="img-upload-status">
            JPG, PNG, WEBP, GIF o SVG · se optimiza sola al subir
          </span>
        )}
      </div>
    </div>
  );
}
