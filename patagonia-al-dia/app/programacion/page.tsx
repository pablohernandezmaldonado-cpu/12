import Link from "next/link";
import { site } from "../content";

export default function ProgramacionPage() {
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
        <h1 className="articulo-titulo">Programación</h1>
        <p className="admin-hint" style={{ marginTop: 12 }}>
          La grilla de programación semanal está en construcción — muy pronto vas a poder verla
          acá, con horarios y locutores de cada programa.
        </p>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-bottom">
          © {new Date().getFullYear()} {site.nombre} — {site.region}.
        </div>
      </footer>
    </>
  );
}
