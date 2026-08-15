import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../lib/auth";
import { sincronizarFacebook } from "../../../../lib/facebookSync";

export const maxDuration = 30;

export async function POST() {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "No autorizado. Vuelve a iniciar sesión." }, { status: 401 });
  }

  const resultado = await sincronizarFacebook();
  return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}
