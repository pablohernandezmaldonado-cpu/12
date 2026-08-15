import { NextResponse } from "next/server";
import { sincronizarFacebook } from "../../../../lib/facebookSync";

export const maxDuration = 30;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const resultado = await sincronizarFacebook();
  return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}
