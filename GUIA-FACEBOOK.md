# Cómo activar la sincronización automática con Facebook

Esto hace que las publicaciones que subas a tu página de Facebook aparezcan
solas en "Últimas noticias" de tu sitio, sin que tengas que copiarlas a mano.

**Cómo funciona en la práctica:**
- El sitio revisa tu página de Facebook **una vez al día**, automáticamente
  (no es instantáneo — publicas hoy, aparece en el sitio dentro de las
  próximas 24 horas).
- También puedes forzarlo cuando quieras: en el panel admin → pestaña
  "Facebook" → botón "Sincronizar ahora".
- Cada publicación nueva con texto se agrega como noticia, con la
  categoría "Regional" por defecto — después puedes entrar a pulirla,
  cambiarle la categoría o destacarla, como cualquier otra noticia.
- Las publicaciones que sean solo una foto sin texto se ignoran (no hay
  de dónde sacar un título).

Esta es la parte más técnica de todo lo que hemos armado. Tómate tu
tiempo, y si te trabas en cualquier paso, mándame captura.

---

## Paso 1 — Crea una App en Meta for Developers

1. Entra a **developers.facebook.com** e inicia sesión con tu cuenta
   normal de Facebook (la misma con la que administras tu página).
2. Arriba a la derecha, haz clic en **"Mis apps"** → **"Crear app"**.
3. Cuando te pregunte el tipo de app, elige **"Otro"** y después
   **"Empresa"** (Business).
4. Ponle un nombre (ej: `patagonia-al-dia-sync`) y un correo de contacto.
   Créala.

## Paso 2 — Agrega el producto "Graph API Explorer"

1. En el panel de tu app recién creada, en el menú de la izquierda,
   busca **"Agregar producto"**.
2. Busca **"Graph API Explorer"** — no hace falta configurarlo, solo que
   esté disponible (puede que ya lo tengas por defecto).

## Paso 3 — Genera un token de acceso a TU página

1. Ve a **developers.facebook.com/tools/explorer**
2. Arriba a la derecha, en el menú desplegable **"Application"**, elige
   la app que acabas de crear.
3. Haz clic en **"Generate Access Token"** (Generar token de acceso).
4. Te va a pedir iniciar sesión y darle permiso a la app — acepta.
5. En el mismo Graph API Explorer, en el cuadro de permisos, busca y
   marca: `pages_show_list`, `pages_read_engagement`, `pages_read_user_content`.
   Vuelve a generar el token con esos permisos marcados.
6. En el cuadro de la consulta (arriba, donde dice algo como `GET /me`),
   escribe: `me/accounts` y haz clic en **"Submit"**.
7. En la respuesta va a aparecer tu página, con un campo `"access_token"`
   al lado — **ese código largo es el token de tu página**. Cópialo.
   También copia el `"id"` que aparece junto a tu página — ese es tu
   **Page ID**.

## Paso 4 — Extiende el token para que dure más

Los tokens que da el Explorer duran solo un par de horas por defecto.
Para que dure ~60 días (y no tengas que repetir esto seguido):

1. Ve a **developers.facebook.com/tools/debug/accesstoken/**
2. Pega el token que copiaste y haz clic en **"Debug"**.
3. Abajo va a aparecer un botón **"Extend Access Token"** (Extender
   token de acceso) — haz clic ahí.
4. Copia el nuevo token extendido — ese es el que vamos a usar.

*Nota honesta: incluso extendido, este tipo de token vence cada
cierto tiempo (normalmente ~60 días). Si en algún momento la
sincronización deja de traer noticias nuevas, probablemente hay que
repetir este Paso 3 y 4 para generar uno nuevo. Es la única parte de
todo el sitio que requiere mantenimiento periódico.*

## Paso 5 — Agrega las variables en Vercel

En tu proyecto de Vercel → Settings → Environment Variables, agrega 2
variables nuevas (además de las que ya tenías):

| Nombre | Valor |
|---|---|
| `FACEBOOK_PAGE_ID` | El Page ID que copiaste en el Paso 3 |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | El token extendido del Paso 4 |

## Paso 6 — Agrega también CRON_SECRET

Esta variable protege la sincronización automática para que solo Vercel
pueda activarla (nadie más puede "gatillarla" desde afuera).

1. Agrega una variable más: `CRON_SECRET`
2. Como valor, escribe cualquier texto largo y random (ej:
   `pad-cron-8f3k2m9x7q1w`) — no importa qué diga, solo que sea difícil
   de adivinar.

## Paso 7 — Redeploy

Después de agregar las 3 variables, ve a Deployments → abre el último →
tres puntos (...) → **Redeploy**.

## Paso 8 — Probalo

1. Entra a tu panel admin → pestaña **"Facebook"**.
2. Haz clic en **"Sincronizar ahora"**.
3. Si tienes publicaciones recientes con texto en tu página, deberían
   aparecer como nuevas "Últimas noticias" en 1-2 minutos (después de
   que Vercel vuelva a publicar el cambio).

---

## Si algo sale mal

- **"Facebook rechazó la solicitud"**: normalmente el token venció o le
  faltan permisos — repite el Paso 3 y 4 para generar uno nuevo.
- **"Faltan las variables..."**: revisa que hayas escrito bien los
  nombres exactos `FACEBOOK_PAGE_ID` y `FACEBOOK_PAGE_ACCESS_TOKEN` en
  Vercel, y que hayas hecho el Redeploy después.
- La sincronización automática diaria corre una vez dentro de cada
  hora programada (no es exacta al minuto) — es una limitación del
  plan gratis de Vercel, no un error.
