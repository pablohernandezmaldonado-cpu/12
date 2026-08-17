import Link from "next/link";
import { notFound } from "next/navigation";
import { site, noticiaPrincipal, destacadas, ultimasNoticias, categorias, publicidad } from "../../content";
import { generarSlug } from "../../../lib/slug";
import { conFormato } from "../../../lib/formato";
import type { Noticia } from "../../../lib/types";
import PublicidadSlot from "../../components/PublicidadSlot";
import CompartirFacebook from "../../components/CompartirFacebook";

function todasLasNoticias(): Noticia[] {
  return [noticiaPrincipal, ...destacadas, ...ultimasNoticias];
}

export default function NoticiaPage({ params }: { params: { slug: string } }) {
  const noticia = todasLasNoticias().find((n) => generarSlug(n.titulo) === params.slug);

  if (!noticia) {
    notFound();
  }

  const color = categorias.find((c) => c.nombre === noticia.categoria)?.color ?? "#2F4B3C";
  const cuerpo = noticia.contenidoCompleto || noticia.bajada || noticia.resumen || "";

  return (
    <>
      <header className="site-header">
        <div className="wrap header-inner">
          <Link href="/" className="logo logo-with-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt={site.nombre} className="logo-img" />
            <span>
              Patagonia<span className="accent"> al Día</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="wrap articulo-wrap">
        <Link href="/" className="volver-link">
          ← Volver a portada
        </Link>

        <div className={noticia.centrado ? "texto-centrado" : ""}>
          {noticia.imagenUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={noticia.imagenUrl}
              alt={noticia.imagenAlt || noticia.titulo}
              className="articulo-img"
            />
          )}

          <span className="tag" style={{ background: color, marginTop: 18 }}>
            {noticia.categoria}
          </span>
          <h1 className="articulo-titulo">{conFormato(noticia.titulo)}</h1>
          <div className="meta">
            {noticia.fecha}
            {noticia.hora ? ` · ${noticia.hora}` : ""}
          </div>

          <div className="articulo-compartir">
            <CompartirFacebook />
          </div>
        </div>

        <PublicidadSlot tipo="en-articulo" items={publicidad} className="ad-banner" />

        <div className={noticia.centrado ? "texto-centrado" : ""}>
          <div className="articulo-cuerpo">
            {cuerpo.split("\n").map((parrafo, i) =>
              parrafo.trim() ? <p key={i}>{conFormato(parrafo)}</p> : null
            )}
          </div>
        </div>

        <Link href="/archivo" className="volver-link" style={{ marginTop: 32, display: "inline-block" }}>
          Ver índice de noticias →
        </Link>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-bottom">
          © {new Date().getFullYear()} {site.nombre} — {site.region}.
        </div>
      </footer>
    </>
  );
}
