// Reduce el tamaño de una foto ANTES de subirla, ajustando la resolución
// a lo que realmente se ve en una pantalla (las fotos de celular suelen
// venir en 4000px+ de ancho, pero en la web nunca se muestran a más de
// ~1920px). Esto baja el peso del archivo entre 70% y 95% sin que se
// note diferencia visual. Los SVG y GIF se dejan tal cual (SVG es
// vectorial, y comprimir un GIF con canvas le rompería la animación).

const LADO_MAXIMO = 1920;
const CALIDAD_JPEG = 0.86;

export async function optimizarImagen(file: File): Promise<File> {
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  const bitmap = await cargarBitmap(file);
  const { width, height } = bitmap;

  const escala = Math.min(1, LADO_MAXIMO / Math.max(width, height));
  const nuevoAncho = Math.round(width * escala);
  const nuevoAlto = Math.round(height * escala);

  // Si la imagen ya es chica y liviana, y no hay que redimensionar, no
  // vale la pena reprocesarla.
  if (escala === 1 && file.size < 900 * 1024) {
    if ("close" in bitmap) bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = nuevoAncho;
  canvas.height = nuevoAlto;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, nuevoAncho, nuevoAlto);
  if ("close" in bitmap) bitmap.close();

  // El PNG se mantiene PNG (por transparencia); todo lo demás se
  // exporta como JPEG con buena calidad, que es lo que más pesa reduce.
  const tipoSalida = file.type === "image/png" ? "image/png" : "image/jpeg";
  const calidad = tipoSalida === "image/jpeg" ? CALIDAD_JPEG : undefined;

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, tipoSalida, calidad)
  );

  if (!blob || blob.size >= file.size) {
    // Si por algún motivo salió más pesada que la original, usamos la original.
    return file;
  }

  const nuevoNombre = tipoSalida === "image/jpeg" ? renombrarAJpg(file.name) : file.name;
  return new File([blob], nuevoNombre, { type: tipoSalida });
}

function renombrarAJpg(nombre: string): string {
  const sinExtension = nombre.replace(/\.[^.]+$/, "");
  return `${sinExtension}.jpg`;
}

async function cargarBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // sigue al fallback de abajo si el navegador no puede con ese formato
    }
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo procesar la imagen."));
    img.src = URL.createObjectURL(file);
  });
}
