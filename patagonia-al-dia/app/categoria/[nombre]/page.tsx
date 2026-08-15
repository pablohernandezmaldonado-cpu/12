import Link from "next/link";
import { notFound } from "next/navigation";
import { site, noticiaPrincipal, destacadas, ultimasNoticias, categorias } from "../../content";
import { generarSlug } from "../../../lib/slug";
import type { Noticia } from "../../../lib/types";

function todasLasNoticias(): Noticia[] {
  return [noticiaPrincipal, ...destacadas, ...ultimasNoticias];
}

export default function CategoriaPage({ params }: { params: { nombre: string } }) {
  const categoria = categorias.find((c) => generarSlug(c.nombre) === params.nombre);

  if (!categoria) {
    notFound();
  }

  const noticias = todasLasNoticias().filter((n) => n.categoria === categoria.nombre);

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

        <span className="tag" style={{ background: categoria.color, marginTop: 6 }}>
          Categoría
        </span>
        <h1 className="articulo-titulo">{categoria.nombre}</h1>

        {noticias.length === 0 ? (
          <p className="admin-hint" style={{ marginTop: 20 }}>
            Todavía no hay noticias publicadas en esta categoría.
          </p>
        ) : (
          <div className="list-noticias" style={{ marginTop: 24 }}>
            {noticias.map((n) => (
              <Link href={`/noticia/${generarSlug(n.titulo)}`} className="list-item" key={n.titulo}>
                <span className="meta">{n.fecha}</span>
                {n.imagenUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.imagenUrl} alt={n.titulo} className="list-item-thumb" />
                ) : (
                  <div className="list-item-thumb list-item-thumb-empty" />
                )}
                <div>
                  <h3 className="card-title">{n.titulo}</h3>
                  <p className="card-resumen">{n.resumen || n.bajada}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="wrap footer-bottom">
          © {new Date().getFullYear()} {site.nombre} — {site.region}.
        </div>
      </footer>
    </>
  );
}
