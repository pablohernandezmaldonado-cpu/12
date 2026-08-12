import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAuthenticated } from "../../../../lib/auth";
import { writeFileToGithub } from "../../../../lib/github";

export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "No autorizado. Vuelve a iniciar sesión." }, { status: 401 });
  }

  let body: { newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Datos inválidos." }, { status: 400 });
  }

  const newPassword = (body.newPassword || "").trim();
  if (newPassword.length < 6) {
    return NextResponse.json(
      { ok: false, error: "La contraseña debe tener al menos 6 caracteres." },
      { status: 400 }
    );
  }

  const passwordHash = crypto.createHash("sha256").update(newPassword).digest("hex");

  try {
    await writeFileToGithub(
      "content/admin.json",
      { passwordHash },
      "Actualiza la contraseña del panel admin"
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    );
  }
}
