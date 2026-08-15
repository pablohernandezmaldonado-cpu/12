// Escribe un archivo JSON en el repositorio de GitHub configurado.
// Usado tanto para guardar contenido del sitio como para cambiar la
// contraseña del panel admin. Requiere GITHUB_OWNER, GITHUB_REPO y
// GITHUB_TOKEN configurados como variables de entorno en Vercel.

export function githubConfigured(): boolean {
  return !!(process.env.GITHUB_OWNER && process.env.GITHUB_REPO && process.env.GITHUB_TOKEN);
}

// Lee y devuelve el contenido ya parseado (JSON) de un archivo del repositorio.
export async function readFileFromGithub<T>(path: string): Promise<T> {
  const OWNER = process.env.GITHUB_OWNER;
  const REPO = process.env.GITHUB_REPO;
  const BRANCH = process.env.GITHUB_BRANCH || "main";
  const TOKEN = process.env.GITHUB_TOKEN;

  if (!OWNER || !REPO || !TOKEN) {
    throw new Error(
      "Faltan variables de entorno GITHUB_OWNER, GITHUB_REPO o GITHUB_TOKEN en Vercel."
    );
  }

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const res = await fetch(`${apiUrl}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`No se pudo leer ${path} en GitHub: ${await res.text()}`);
  }

  const data = await res.json();
  const contenido = Buffer.from(data.content, "base64").toString("utf-8");
  return JSON.parse(contenido) as T;
}

export async function writeFileToGithub(path: string, data: unknown, commitMessage: string): Promise<void> {
  const OWNER = process.env.GITHUB_OWNER;
  const REPO = process.env.GITHUB_REPO;
  const BRANCH = process.env.GITHUB_BRANCH || "main";
  const TOKEN = process.env.GITHUB_TOKEN;

  if (!OWNER || !REPO || !TOKEN) {
    throw new Error(
      "Faltan variables de entorno GITHUB_OWNER, GITHUB_REPO o GITHUB_TOKEN en Vercel. Revisa el LEEME.md."
    );
  }

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;

  // 1. Leer el archivo actual para obtener su "sha" (GitHub lo exige para sobreescribir)
  const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });

  if (!getRes.ok) {
    throw new Error(`No se pudo leer ${path} en GitHub: ${await getRes.text()}`);
  }
  const current = await getRes.json();

  // 2. Escribir el nuevo contenido
  const content = Buffer.from(JSON.stringify(data, null, 2), "utf-8").toString("base64");

  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      message: commitMessage,
      content,
      sha: current.sha,
      branch: BRANCH,
    }),
  });

  if (!putRes.ok) {
    throw new Error(`No se pudo guardar ${path} en GitHub: ${await putRes.text()}`);
  }
}

// Sube un archivo nuevo (pensado para imágenes) al repositorio.
// A diferencia de writeFileToGithub, no intenta leer un archivo
// existente primero: se usa con nombres únicos, así que siempre crea
// un archivo nuevo. base64Content debe venir SIN el prefijo
// "data:image/png;base64,".
export async function uploadBinaryFileToGithub(
  path: string,
  base64Content: string,
  commitMessage: string
): Promise<void> {
  const OWNER = process.env.GITHUB_OWNER;
  const REPO = process.env.GITHUB_REPO;
  const BRANCH = process.env.GITHUB_BRANCH || "main";
  const TOKEN = process.env.GITHUB_TOKEN;

  if (!OWNER || !REPO || !TOKEN) {
    throw new Error(
      "Faltan variables de entorno GITHUB_OWNER, GITHUB_REPO o GITHUB_TOKEN en Vercel. Revisa el LEEME.md."
    );
  }

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;

  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      message: commitMessage,
      content: base64Content,
      branch: BRANCH,
    }),
  });

  if (!putRes.ok) {
    throw new Error(`No se pudo subir la imagen: ${await putRes.text()}`);
  }
}
