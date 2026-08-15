import rawData from "../content/site.json";
import type { SiteData } from "../lib/types";

const data = rawData as SiteData;

export const site = data.site;
export const radio = data.radio;
export const noticiaPrincipal = data.noticiaPrincipal;
export const destacadas = data.destacadas;
export const ultimasNoticias = data.ultimasNoticias;
export const categorias = data.categorias;
export const menu = data.menu;
export const publicidad = data.publicidad;
export const streamingCanales = data.streamingCanales;
export const contacto = data.contacto;
