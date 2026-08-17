export interface Noticia {
  categoria: string;
  titulo: string;
  fecha: string;
  resumen?: string;
  bajada?: string;
  hora?: string;
  imagenAlt?: string;
  imagenUrl?: string;
  contenidoCompleto?: string;
  fbPostId?: string;
  centrado?: boolean;
}

export type TipoPublicidad =
  | "banner-superior"
  | "lateral"
  | "entre-noticias"
  | "en-articulo"
  | "destacada"
  | "celular"
  | "auspiciador";

export interface PublicidadItem {
  id: string;
  tipo: TipoPublicidad;
  cliente: string;
  descripcion?: string;
  imagenUrl?: string;
  enlace?: string;
}

export interface CanalStreaming {
  id: string;
  titulo: string;
  url: string;
  logoUrl?: string;
  enlaceOficial?: string;
}

export interface Categoria {
  nombre: string;
  color: string;
}

export interface MenuItem {
  nombre: string;
  href: string;
}

export interface SiteData {
  site: {
    nombre: string;
    eslogan: string;
    region: string;
    ciudad: string;
    coordenadas: string;
  };
  radio: {
    enVivo: boolean;
    nombrePrograma: string;
    locutor: string;
    urlStreaming: string;
  };
  noticiaPrincipal: Noticia;
  destacadas: Noticia[];
  ultimasNoticias: Noticia[];
  categorias: Categoria[];
  menu: MenuItem[];
  publicidad: PublicidadItem[];
  streamingCanales: CanalStreaming[];
  contacto: {
    direccion: string;
    telefono: string;
    whatsapp: string;
    email: string;
    facebook: string;
    instagram: string;
  };
}
