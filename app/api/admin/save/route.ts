import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../lib/auth";
import { writeFileToGithub } from "../../../../lib/github";

export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "No autorizado. Vuelve a iniciar sesión." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Datos inválidos." }, { status: 400 });
  }

  try {
    await writeFileToGithub("content/site.json", body, "Actualización de contenido desde el panel admin");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    );
  }
}
