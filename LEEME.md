# Patagonia al Día — Sitio web + Panel administrativo

Este es tu sitio web, ya armado y probado. Está construido con **Next.js**
(la misma tecnología que usan medios grandes) pero simplificado para que
lo puedas subir a **Vercel** sin necesitar saber programar. Incluye un
**panel administrativo con clave** en `/admin` para que edites noticias,
radio, categorías, menú y contacto sin depender de nadie.

**Cómo funciona el panel:** cuando entras a `tusitio.vercel.app/admin`,
escribes tu contraseña, editas lo que quieras y le das "Guardar cambios",
el panel actualiza el archivo `content/site.json` directo en tu
repositorio de GitHub. Eso hace que Vercel vuelva a publicar el sitio
solo, en 1-2 minutos. No hay base de datos que mantener ni nada que se
pueda perder — todo tu contenido vive en GitHub, como el resto del
código.

---

## 1. ¿QUÉ CONTIENE ESTA CARPETA?

- `app/page.tsx` → la estructura de la página (no la toques si no es necesario)
- `app/content.ts` → **AQUÍ ES DONDE TÚ EDITAS TODO**: noticias, radio, contacto, menú
- `app/globals.css` → los colores y estilos del sitio
- `app/layout.tsx` → configuración general (tipografías, título de la pestaña del navegador)

Para actualizar noticias, cambiar el estado de la radio, o los datos de
contacto, **solo necesitas editar `app/content.ts`**. Es texto simple entre
comillas, no es código complicado.

---

## 2. CÓMO SUBIRLO A VERCEL (sin usar la terminal)

### Paso 1 — Crea una cuenta en GitHub
Entra a https://github.com y crea una cuenta gratuita (si no tienes una).

### Paso 2 — Sube esta carpeta a GitHub
1. En GitHub, haz clic en **"New repository"** (Nuevo repositorio).
2. Ponle un nombre, por ejemplo `patagonia-al-dia`.
3. Déjalo en **Public** o **Private**, como prefieras.
4. Crea el repositorio (sin agregar README, ya tienes uno).
5. En la página del repositorio vacío, GitHub te va a mostrar un botón para
   **"uploading an existing file"** (subir un archivo existente).
6. Arrastra TODOS los archivos de esta carpeta (menos `node_modules` si
   llegara a aparecer) y confirma la subida ("Commit changes").

### Paso 3 — Conecta con Vercel
1. Entra a https://vercel.com y crea una cuenta gratuita usando tu cuenta
   de GitHub (botón "Continue with GitHub").
2. Haz clic en **"Add New..." → "Project"**.
3. Vercel te va a mostrar tu repositorio `patagonia-al-dia`. Haz clic en
   **"Import"**.
4. Vercel detecta automáticamente que es un proyecto Next.js. No cambies
   ninguna configuración.
5. Haz clic en **"Deploy"**.
6. Espera 1-2 minutos. Al terminar, Vercel te entrega un link como
   `patagonia-al-dia.vercel.app` — ese es tu sitio, ya en vivo.

### Paso 4 — Cada vez que quieras actualizar el sitio
1. Edita `app/content.ts` directamente en GitHub (botón del lápiz ✏️ en
   la página del archivo) o pídeme a mí que te genere el archivo actualizado.
2. Guarda los cambios ("Commit changes").
3. Vercel detecta el cambio automáticamente y vuelve a publicar el sitio
   solo, en 1-2 minutos. No tienes que hacer nada más.

---

## 3. ACTIVAR EL PANEL ADMINISTRATIVO (/admin)

**Cómo entrar:** abajo del todo en tu página de inicio hay un link chico
que dice "Acceso administrador" — haz clic ahí, o entra directo a
`tusitio.vercel.app/admin`.

**Contraseña de fábrica:** `patagonia2026`

⚠️ Cámbiala apenas entres por primera vez, desde la pestaña **"Cuenta"**
dentro del panel (no hace falta tocar Vercel para esto — se guarda solo).

El panel necesita 3 variables de entorno en Vercel para poder guardar
cambios (tanto contenido como la contraseña se guardan escribiendo
directo en tu repositorio de GitHub):

### Paso 1 — Crea un token de GitHub
1. Entra a https://github.com/settings/tokens?type=beta
2. Haz clic en **"Generate new token"**.
3. Ponle un nombre, ej. `patagonia-admin`.
4. En **"Repository access"** elige **"Only select repositories"** y
   selecciona tu repositorio.
5. En **"Permissions"** busca **"Contents"** y ponlo en **"Read and write"**.
6. Genera el token y **cópialo de inmediato** — GitHub solo lo muestra una vez.

### Paso 2 — Agrega las variables en Vercel
Ve a tu proyecto en Vercel → **Settings** → **Environment Variables** y
agrega estas 3:

| Nombre | Valor |
|---|---|
| `GITHUB_TOKEN` | El token que copiaste en el Paso 1 |
| `GITHUB_OWNER` | Tu usuario de GitHub |
| `GITHUB_REPO` | El nombre de tu repositorio |

`GITHUB_BRANCH` es opcional — solo agrégala si tu rama principal no se
llama `main`.

### Paso 3 — Redeploy
Después de agregar las variables, ve a **Deployments**, abre el último
deploy, y haz clic en los tres puntos → **"Redeploy"**. Esto es necesario
una sola vez.

### Paso 4 — Entra, cambia tu contraseña, y listo
Entra a `/admin`, usa `patagonia2026`, y ve directo a la pestaña
**"Cuenta"** para poner tu propia contraseña. Desde ahí en adelante todo
se maneja solo desde el panel — no vas a necesitar volver a entrar a
Vercel para nada relacionado a contenido o contraseña.

**Si alguna vez olvidas tu contraseña:** entra a GitHub, abre el archivo
`content/admin.json`, edítalo y deja `"passwordHash": ""` (vacío), guarda
el cambio. Eso hace que el sitio vuelva a aceptar una contraseña de
emergencia, si configuraste la variable `ADMIN_PASSWORD` en Vercel
(opcional, pero recomendada como respaldo).

---

## 4. DOMINIO PROPIO (patagoniaaldia.cl, por ejemplo)

Si ya tienes o compras un dominio, en Vercel vas a **Project → Settings →
Domains** y agregas tu dominio. Vercel te da 2 registros DNS para copiar
en el proveedor donde compraste el dominio (NIC Chile, GoDaddy, etc.).
Avísame cuando llegues a este paso y te ayudo con los valores exactos.

---

## 5. QUÉ FALTA TODAVÍA

El panel de hoy cubre: noticias (principal, destacadas, últimas),
radio en vivo, categorías, menú y contacto — editable con clave, sin
tocar código.

Todavía no incluye (lo dejamos para más adelante, cuando lo necesites):

- **Programación semanal y podcast** — necesitan su propia sección en
  el panel, las agregamos cuando quieras.
- **Publicidad y auspiciadores con estadísticas** — necesita un sistema
  más grande (clientes, campañas, clics), lo vemos como Etapa 3.
- **Subir fotos desde el panel** — hoy las imágenes son marcadores de
  espacio (los bloques de color); para subir fotos reales conviene
  agregar **Vercel Blob** o **Cloudinary**, es un paso aparte.
- **Varios usuarios con distintos permisos** (editor, periodista, etc.)
  — hoy es una sola contraseña para un solo administrador.

Pídemelo cuando quieras seguir con cualquiera de estos.
