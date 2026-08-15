import Link from "next/link";
import {
  site,
  radio,
  noticiaPrincipal,
  destacadas,
  ultimasNoticias,
  categorias,
  menu,
  publicidad,
  streamingCanales,
  contacto,
} from "./content";
import PublicidadSlot from "./components/PublicidadSlot";
import ClimaWidget from "./components/ClimaWidget";
import RelojPuntaArenas from "./components/RelojPuntaArenas";
import SocialIcons from "./components/SocialIcons";
import { generarSlug } from "../lib/slug";
import { conFormato } from "../lib/formato";

// Si alguien pega un link sin "https://" al principio (ej: pegado a
// mano en el panel), esto evita que el navegador lo confunda con una
// ruta interna del propio sitio.
function urlCompleta(url: string): string {
  const limpia = url.trim();
  if (!limpia) return limpia;
  return /^https?:\/\//i.test(limpia) ? limpia : `https://${limpia}`;
}

export default function Home() {
  return (
    <>
      {/* Franja de despacho — elemento distintivo con coordenadas y hora */}
      <div className="dispatch">
        <div className="wrap dispatch-inner">
          <span>
            {site.coordenadas} — {site.ciudad.toUpperCase()}, {site.region.toUpperCase()}
          </span>
          <RelojPuntaArenas />
          {radio.enVivo ? (
            <span className="dispatch-live">
              <span className="dot" /> TRANSMITIENDO AHORA · {radio.nombrePrograma.toUpperCase()}
            </span>
          ) : (
            <span>RADIO FUERA DE AIRE</span>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="site-header">
        <div className="wrap header-inner">
          <a href="/" className="logo logo-with-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt="Patagonia al Día" className="logo-img" />
            <span>
              Patagonia<span className="accent"> al Día</span>
            </span>
          </a>
          <nav className="main-menu">
            {menu.map((item) => {
              let href = item.href;
              if (item.nombre === "Inicio") href = "/";
              else if (item.nombre === "Contacto") href = "#contacto-footer";
              else if (item.nombre === "Programación") href = "/programacion";
              else if (categorias.some((c) => c.nombre === item.nombre)) {
                href = `/categoria/${generarSlug(item.nombre)}`;
              }
              return (
                <Link key={item.nombre} href={href}>
                  {item.nombre}
                </Link>
              );
            })}
          </nav>
          <div className="header-right">
            <SocialIcons contacto={contacto} className="header-social" />
            <a
              href={radio.urlStreaming ? urlCompleta(radio.urlStreaming) : "#contacto-footer"}
              target={radio.urlStreaming ? "_blank" : undefined}
              rel="noreferrer"
              className="btn-live"
            >
              <span className="dot" /> RADIO EN VIVO
            </a>
          </div>
        </div>
      </header>

      <main className="wrap">
        {/* Hero: noticia principal + radio */}
        <section className="hero">
          <div className={noticiaPrincipal.centrado ? "texto-centrado" : ""}>
            {noticiaPrincipal.imagenUrl ? (
              <div className="principal-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={noticiaPrincipal.imagenUrl}
                  alt={noticiaPrincipal.imagenAlt || noticiaPrincipal.titulo}
                  className="principal-img-real"
                />
              </div>
            ) : (
              <div className="principal-img" aria-label={noticiaPrincipal.imagenAlt} />
            )}
            <div className="eyebrow">{noticiaPrincipal.categoria}</div>
            <h1 className="principal-titulo">{conFormato(noticiaPrincipal.titulo)}</h1>
            <p className="principal-bajada">{conFormato(noticiaPrincipal.bajada)}</p>
            <div className="meta">{noticiaPrincipal.fecha}</div>
            <Link className="leer-mas" href={`/noticia/${generarSlug(noticiaPrincipal.titulo)}`}>
              LEER MÁS →
            </Link>
          </div>

          <div className="hero-sidebar">
            <aside className="radio-panel">
              <div className="radio-status">
                <span className="dot" /> {radio.enVivo ? "EN VIVO" : "FUERA DE AIRE"}
              </div>
              <div className="radio-nombre">{radio.nombrePrograma}</div>
              <div className="radio-meta">Con {radio.locutor}</div>
              <a
                href={radio.urlStreaming ? urlCompleta(radio.urlStreaming) : "#contacto-footer"}
                target={radio.urlStreaming ? "_blank" : undefined}
                rel="noreferrer"
                className="play-btn"
              >
                ▶ ESCUCHAR EN VIVO
              </a>
            </aside>
            <PublicidadSlot tipo="lateral" items={publicidad} className="ad-lateral ad-lateral-stack" />
          </div>
        </section>

        {/* Streaming de TV (varias señales) + Clima */}
        <section className="tv-clima-row">
          <div className="tv-grid">
            {streamingCanales.map((canal) => (
              <div className="tv-box" key={canal.id}>
                <div className="tv-box-title">
                  {canal.logoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={canal.logoUrl} alt={canal.titulo} className="tv-box-logo" />
                  )}
                  {canal.titulo}
                </div>
                {canal.url ? (
                  <iframe
                    src={urlCompleta(canal.url)}
                    title={canal.titulo}
                    className="tv-iframe"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="tv-placeholder">Sin señal configurada</div>
                )}
                {canal.enlaceOficial && (
                  <a
                    href={urlCompleta(canal.enlaceOficial)}
                    target="_blank"
                    rel="noreferrer"
                    className="tv-oficial-link"
                  >
                    Ver en el sitio oficial ↗
                  </a>
                )}
              </div>
            ))}
          </div>
          <ClimaWidget />
        </section>

        {/* Banner comercial superior — debajo del clima y las señales */}
        <PublicidadSlot tipo="banner-superior" items={publicidad} />

        {/* Noticias destacadas */}
        <section className="section">
          <h2 className="section-title">
            Noticias destacadas <small>seleccionadas por la redacción</small>
          </h2>
          <div className="grid-3">
            {destacadas.map((n) => {
              const color =
                categorias.find((c) => c.nombre === n.categoria)?.color ?? "#2F4B3C";
              return (
                <Link href={`/noticia/${generarSlug(n.titulo)}`} className="card" key={n.titulo}>
                  {n.imagenUrl ? (
                    <div className="card-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={n.imagenUrl} alt={n.titulo} className="card-img-real" />
                    </div>
                  ) : (
                    <div className="card-img" />
                  )}
                  <div className={`card-body ${n.centrado ? "texto-centrado" : ""}`}>
                    <span className="tag" style={{ background: color }}>
                      {n.categoria}
                    </span>
                    <h3 className="card-title">{conFormato(n.titulo)}</h3>
                    <p className="card-resumen">{conFormato(n.resumen)}</p>
                    <span className="meta">{n.fecha}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Categorías */}
        <section className="section">
          <h2 className="section-title">Secciones</h2>
          <div className="cat-row">
            {categorias.map((c) => (
              <Link
                className="cat-pill"
                style={{ background: c.color }}
                href={`/categoria/${generarSlug(c.nombre)}`}
                key={c.nombre}
              >
                {c.nombre}
              </Link>
            ))}
          </div>
        </section>

        {/* Publicidad entre noticias */}
        <PublicidadSlot tipo="entre-noticias" items={publicidad} />

        {/* Publicidad para celular (solo visible en pantallas chicas) */}
        <PublicidadSlot tipo="celular" items={publicidad} className="ad-mobile-only ad-banner" />

        {/* Últimas noticias */}
        <section className="section">
          <h2 className="section-title">
            Últimas noticias <small>actualizado {noticiaPrincipal.fecha}</small>
          </h2>
          <div className="list-noticias">
            {ultimasNoticias.map((n) => {
              const color =
                categorias.find((c) => c.nombre === n.categoria)?.color ?? "#2F4B3C";
              return (
                <Link href={`/noticia/${generarSlug(n.titulo)}`} className="list-item" key={n.titulo}>
                  <span className="meta">
                    {n.hora} · {n.fecha.slice(0, 6)}
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
                    <p className="card-resumen">{conFormato(n.resumen)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Publicidad destacada */}
        <PublicidadSlot tipo="destacada" items={publicidad} className="ad-destacada" />
      </main>

      {/* Auspiciadores */}
      <section className="auspiciadores-section">
        <div className="wrap">
          <div className="section-title" style={{ color: "var(--glaciar)" }}>
            Aviso Comercial
          </div>
          <PublicidadSlot tipo="auspiciador" items={publicidad} className="ad-auspiciadores" />
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer" id="contacto-footer">
        <div className="wrap footer-inner">
          <div>
            <div className="logo logo-with-img" style={{ marginBottom: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo.png" alt="Patagonia al Día" className="logo-img" />
              <span>
                Patagonia<span className="accent"> al Día</span>
              </span>
            </div>
            <p>{site.eslogan}</p>
          </div>
          <div>
            <h4>Contacto</h4>
            <p>{contacto.direccion}</p>
            <p>{contacto.telefono}</p>
            <p>{contacto.email}</p>
          </div>
          <div>
            <h4>Síguenos</h4>
            <SocialIcons contacto={contacto} className="footer-social" />
          </div>
        </div>
        <div className="wrap footer-bottom footer-bottom-row">
          <span>
            © {new Date().getFullYear()} Patagonia al Día — {site.region}. Todos los derechos reservados.
          </span>
          <a href="/admin" className="admin-access-link">
            Acceso administrador
          </a>
        </div>
      </footer>
    </>
  );
}
