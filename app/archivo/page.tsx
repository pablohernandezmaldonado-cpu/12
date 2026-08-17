import Link from "next/link";
import { site, noticiaPrincipal, destacadas, ultimasNoticias, categorias } from "../content";
import { generarSlug } from "../../lib/slug";
import { conFormato } from "../../lib/formato";
import type { Noticia } from "../../lib/types";

export default function ArchivoPage() {
  const todas: Noticia[] = [noticiaPrincipal, ...destacadas, ...ultimasNoticias].filter(
    (n) => n.titulo.trim().length > 0
  );

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

        <h1 className="articulo-titulo">Índice</h1>
        <p className="admin-hint" style={{ marginTop: 4 }}>
          Todas las noticias publicadas, {todas.length} en total. Ninguna se borra sola — quedan
          todas acá para siempre.
        </p>

        <div className="list-noticias" style={{ marginTop: 20 }}>
          {todas.map((n, i) => {
            const color = categorias.find((c) => c.nombre === n.categoria)?.color ?? "#2F4B3C";
            return (
              <Link href={`/noticia/${generarSlug(n.titulo)}`} className="list-item" key={`${n.titulo}-${i}`}>
                <span className="meta">
                  {n.fecha}
                  {n.hora ? ` · ${n.hora}` : ""}
                </span>
                {n.imagenUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.imagenUrl} alt={n.titulo} className="list-item-thumb" />
                ) : (
                  <div className="list-item-thumb list-item-thumb-empty" />
                )}
                <div>
                  <span className="tag" style={{ background: color, marginBottom: 6 }}>
                    {n.categoria}
                  </span>
                  <h3 className="card-title">{conFormato(n.titulo)}</h3>
                  <p className="card-resumen">{conFormato(n.resumen || n.bajada)}</p>
                </div>
              </Link>
            );
          })}
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
