import type { PublicidadItem, TipoPublicidad } from "../../lib/types";

function urlCompleta(url: string): string {
  const limpia = url.trim();
  if (!limpia) return limpia;
  return /^https?:\/\//i.test(limpia) ? limpia : `https://${limpia}`;
}

const ETIQUETAS: Record<TipoPublicidad, string> = {
  "banner-superior": "BANNER SUPERIOR (940 × 110)",
  "lateral-superior": "BANNER LATERAL (SUPERIOR)",
  lateral: "BANNER LATERAL",
  "entre-noticias": "PUBLICIDAD ENTRE NOTICIAS",
  destacada: "PUBLICIDAD DESTACADA",
  celular: "PUBLICIDAD PARA CELULAR",
  auspiciador: "AUSPICIADOR",
};

export default function PublicidadSlot({
  tipo,
  items,
  className,
}: {
  tipo: TipoPublicidad;
  items: PublicidadItem[];
  className?: string;
}) {
  const filtrados = items.filter((i) => i.tipo === tipo);

  if (filtrados.length === 0) {
    return (
      <div className={`ad-slot ${className || "ad-banner"}`}>
        ESPACIO COMERCIAL — {ETIQUETAS[tipo]}
      </div>
    );
  }

  return (
    <div className={`ad-real-wrap ${className || ""}`}>
      {filtrados.map((item) => {
        const contenido = (
          <>
            {item.imagenUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imagenUrl} alt={item.cliente} className="ad-real-img" />
            ) : (
              <div className="ad-real-noimg">{item.cliente}</div>
            )}
            {item.descripcion && <div className="ad-real-desc">{item.descripcion}</div>}
          </>
        );
        return item.enlace ? (
          <a key={item.id} href={urlCompleta(item.enlace)} target="_blank" rel="noreferrer" className="ad-real-card">
            {contenido}
          </a>
        ) : (
          <div key={item.id} className="ad-real-card">
            {contenido}
          </div>
        );
      })}
    </div>
  );
}
