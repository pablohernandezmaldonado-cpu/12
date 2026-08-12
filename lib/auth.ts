import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import rawAdmin from "../content/admin.json";

export const COOKIE_NAME = "pad_admin_auth";

interface AdminData {
  passwordHash: string;
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// El hash "real" es el guardado en content/admin.json. Si por alguna
// razon viene vacio (primer arranque, o el admin lo borro para
// recuperar el acceso), se usa como respaldo la variable de entorno
// ADMIN_PASSWORD configurada en Vercel.
function currentHash(): string {
  const admin = rawAdmin as AdminData;
  if (admin.passwordHash) return admin.passwordHash;
  return sha256(process.env.ADMIN_PASSWORD || "");
}

export function checkPassword(password: string): boolean {
  return sha256(password) === currentHash();
}

export function getAuthCookieValue(): string {
  return currentHash();
}

export function isAuthenticated(): boolean {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  return token === currentHash();
}

// Llamar al inicio de cada pagina protegida del panel admin.
// Si no hay sesion valida, redirige al login.
export function requireAuth(): void {
  if (!isAuthenticated()) {
    redirect("/admin/login");
  }
}
