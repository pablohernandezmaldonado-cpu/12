import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../lib/auth";
import { uploadBinaryFileToGithub } from "../../../../lib/github";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB (las fotos ya llegan optimizadas desde el navegador)

function sanitizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca tildes
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "No autorizado. Vuelve a iniciar sesión." }, { status: 401 });
  }

  let body: { filename?: string; dataUrl?: string; folder?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Datos inválidos." }, { status: 400 });
  }

  const { filename, dataUrl, folder } = body;
  if (!filename || !dataUrl || !dataUrl.startsWith("data:")) {
    return NextResponse.json({ ok: false, error: "Falta la imagen." }, { status: 400 });
  }

  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json(
      { ok: false, error: "Formato de imagen no reconocido. Usa JPG, PNG, WEBP, GIF o SVG." },
      { status: 400 }
    );
  }
  const [, , base64] = match;

  const approxBytes = Math.ceil((base64.length * 3) / 4);
  if (approxBytes > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "La imagen pesa más de 4 MB. Usa una más liviana." }, { status: 400 });
  }

  const safeFolder = sanitizeName(folder || "general") || "general";
  const ext = filename.includes(".") ? filename.split(".").pop() : "jpg";
  const base = sanitizeName(filename.replace(/\.[^.]+$/, "")) || "imagen";
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}.${sanitizeName(ext || "jpg")}`;
  const path = `public/uploads/${safeFolder}/${unique}`;

  try {
    await uploadBinaryFileToGithub(path, base64, `Sube imagen: ${safeFolder}/${unique}`);
    return NextResponse.json({ ok: true, url: `/uploads/${safeFolder}/${unique}` });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    );
  }
}
