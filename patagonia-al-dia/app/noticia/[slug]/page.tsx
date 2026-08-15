import Link from "next/link";
import { notFound } from "next/navigation";
import { site, noticiaPrincipal, destacadas, ultimasNoticias, categorias } from "../../content";
import { generarSlug } from "../../../lib/slug";
import type { Noticia } from "../../../lib/types";

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
        <h1 className="articulo-titulo">{noticia.titulo}</h1>
        <div className="meta">
          {noticia.fecha}
          {noticia.hora ? ` · ${noticia.hora}` : ""}
        </div>

        <div className="articulo-cuerpo">
          {cuerpo.split("\n").map((parrafo, i) =>
            parrafo.trim() ? <p key={i}>{parrafo}</p> : null
          )}
        </div>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-bottom">
          © {new Date().getFullYear()} {site.nombre} — {site.region}.
        </div>
      </footer>
    </>
  );
}
