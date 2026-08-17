import { readFileFromGithub, writeFileToGithub } from "./github";
import type { SiteData, Noticia } from "./types";

const GRAPH_VERSION = "v21.0";
const SITE_JSON_PATH = "content/site.json";
// Ojo: acá NO recortamos la lista. Todo lo que se sube se guarda para
// siempre — el límite de "cuántas se muestran" se aplica solo al
// renderizar la portada (ver app/page.tsx), nunca al guardar.

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  permalink_url?: string;
}

export interface ResultadoSync {
  ok: boolean;
  nuevos: number;
  error?: string;
}

function formatearFechaFB(iso: string): { fecha: string; hora: string } {
  const d = new Date(iso);
  const fecha = d.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Santiago",
  });
  const hora = d.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Santiago",
  });
  return { fecha, hora };
}

function tituloDesdeMensaje(mensaje: string): string {
  const limpio = mensaje.trim().replace(/\s+/g, " ");
  const primeraLinea = limpio.split("\n")[0];
  if (primeraLinea.length <= 100) return primeraLinea;
  return primeraLinea.slice(0, 97).trimEnd() + "...";
}

function postAnoticia(post: FacebookPost): Noticia | null {
  const mensaje = post.message?.trim();
  if (!mensaje) return null; // publicaciones sin texto (solo foto suelta, etc.) se ignoran

  const { fecha, hora } = formatearFechaFB(post.created_time);

  return {
    categoria: "Regional",
    titulo: tituloDesdeMensaje(mensaje),
    fecha,
    hora,
    resumen: mensaje.length > 220 ? mensaje.slice(0, 217).trimEnd() + "..." : mensaje,
    contenidoCompleto: mensaje,
    imagenUrl: post.full_picture,
    fbPostId: post.id,
  };
}

export async function sincronizarFacebook(): Promise<ResultadoSync> {
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  const TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!PAGE_ID || !TOKEN) {
    return {
      ok: false,
      nuevos: 0,
      error:
        "Faltan las variables FACEBOOK_PAGE_ID o FACEBOOK_PAGE_ACCESS_TOKEN en Vercel. Revisa la guía de configuración.",
    };
  }

  let posts: FacebookPost[];
  try {
    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PAGE_ID}/posts?fields=id,message,created_time,full_picture,permalink_url&limit=15&access_token=${TOKEN}`;
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || json.error) {
      const msg = json?.error?.message || "Error desconocido de Facebook.";
      return { ok: false, nuevos: 0, error: `Facebook rechazó la solicitud: ${msg}` };
    }
    posts = json.data || [];
  } catch (e) {
    return {
      ok: false,
      nuevos: 0,
      error: `No se pudo conectar con Facebook: ${e instanceof Error ? e.message : String(e)}`,
    };
  }

  let data: SiteData;
  try {
    data = await readFileFromGithub<SiteData>(SITE_JSON_PATH);
  } catch (e) {
    return {
      ok: false,
      nuevos: 0,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  const idsExistentes = new Set(
    [data.noticiaPrincipal, ...data.destacadas, ...data.ultimasNoticias]
      .map((n) => n.fbPostId)
      .filter(Boolean)
  );

  // Procesamos del más antiguo al más nuevo para que el orden final quede cronológico
  const postsNuevos = [...posts].reverse().filter((p) => !idsExistentes.has(p.id));

  const noticiasNuevas = postsNuevos
    .map(postAnoticia)
    .filter((n): n is Noticia => n !== null);

  if (noticiasNuevas.length === 0) {
    return { ok: true, nuevos: 0 };
  }

  const ultimasActualizadas = [...noticiasNuevas.reverse(), ...data.ultimasNoticias];

  const dataActualizada: SiteData = {
    ...data,
    ultimasNoticias: ultimasActualizadas,
  };

  try {
    await writeFileToGithub(
      SITE_JSON_PATH,
      dataActualizada,
      `Sincronización automática con Facebook (${noticiasNuevas.length} noticia${
        noticiasNuevas.length === 1 ? "" : "s"
      } nueva${noticiasNuevas.length === 1 ? "" : "s"})`
    );
  } catch (e) {
    return {
      ok: false,
      nuevos: 0,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  return { ok: true, nuevos: noticiasNuevas.length };
}
