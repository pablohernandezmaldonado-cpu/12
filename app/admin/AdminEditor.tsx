"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteData, Noticia, Categoria, MenuItem, PublicidadItem, TipoPublicidad } from "../../lib/types";
import ImageUploadField from "./ImageUploadField";

type Tab =
  | "noticias"
  | "radio"
  | "publicidad"
  | "streaming"
  | "facebook"
  | "categorias"
  | "menu"
  | "contacto"
  | "cuenta";

const TABS: { id: Tab; label: string }[] = [
  { id: "noticias", label: "Noticias" },
  { id: "radio", label: "Radio" },
  { id: "publicidad", label: "Publicidad" },
  { id: "streaming", label: "Streaming" },
  { id: "facebook", label: "Facebook" },
  { id: "categorias", label: "Categorías" },
  { id: "menu", label: "Menú" },
  { id: "contacto", label: "Contacto" },
  { id: "cuenta", label: "Cuenta" },
];

const NOTICIA_VACIA: Noticia = {
  categoria: "Regional",
  titulo: "",
  fecha: "",
  resumen: "",
  hora: "",
};

export default function AdminEditor({ initialData }: { initialData: SiteData }) {
  const router = useRouter();
  const [data, setData] = useState<SiteData>(initialData);
  const [tab, setTab] = useState<Tab>("noticias");
  const [status, setStatus] = useState<
    { type: "idle" } | { type: "saving" } | { type: "ok" } | { type: "error"; msg: string }
  >({ type: "idle" });

  async function handleSave() {
    setStatus({ type: "saving" });
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.ok) {
        setStatus({ type: "error", msg: result.error || "No se pudo guardar." });
        return;
      }
      setStatus({ type: "ok" });
    } catch {
      setStatus({ type: "error", msg: "No se pudo conectar con el servidor." });
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="logo" style={{ color: "var(--glaciar)" }}>
          Patagonia<span className="accent"> al Día</span> <small style={{ opacity: 0.6, fontWeight: 400 }}>· Panel admin</small>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/" target="_blank" rel="noreferrer" className="admin-link">
            Ver sitio ↗
          </a>
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="admin-link"
          >
            Ver estadísticas ↗
          </a>
          <button className="btn-secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="admin-body">
        <nav className="admin-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-nav-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="admin-panel">
          {tab === "noticias" && <NoticiasTab data={data} setData={setData} />}
          {tab === "radio" && <RadioTab data={data} setData={setData} />}
          {tab === "publicidad" && <PublicidadTab data={data} setData={setData} />}
          {tab === "streaming" && <StreamingTab data={data} setData={setData} />}
          {tab === "facebook" && <FacebookTab />}
          {tab === "categorias" && <CategoriasTab data={data} setData={setData} />}
          {tab === "menu" && <MenuTab data={data} setData={setData} />}
          {tab === "contacto" && <ContactoTab data={data} setData={setData} />}
          {tab === "cuenta" && <CuentaTab />}
        </div>
      </div>

      <div className="admin-savebar">
        {status.type === "error" && <span className="admin-error">{status.msg}</span>}
        {status.type === "ok" && (
          <span className="admin-ok">Guardado. El sitio se va a actualizar en 1-2 minutos.</span>
        )}
        <button className="btn-save" onClick={handleSave} disabled={status.type === "saving"}>
          {status.type === "saving" ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// NOTICIAS
// ---------------------------------------------------------------
function NoticiasTab({
  data,
  setData,
}: {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
}) {
  return (
    <div>
      <h2 className="admin-h2">Noticia principal</h2>
      <p className="admin-hint">Esta es la que aparece grande, arriba de todo en la portada.</p>
      <NoticiaForm
        noticia={data.noticiaPrincipal}
        onChange={(n) => setData({ ...data, noticiaPrincipal: n })}
        conBajada
      />

      <h2 className="admin-h2" style={{ marginTop: 36 }}>
        Noticias destacadas
      </h2>
      <p className="admin-hint">Las 3 tarjetas debajo de la noticia principal.</p>
      <NoticiaLista
        items={data.destacadas}
        onChange={(items) => setData({ ...data, destacadas: items })}
      />

      <h2 className="admin-h2" style={{ marginTop: 36 }}>
        Últimas noticias
      </h2>
      <p className="admin-hint">La lista cronológica más abajo en la página.</p>
      <NoticiaLista
        items={data.ultimasNoticias}
        onChange={(items) => setData({ ...data, ultimasNoticias: items })}
        conHora
      />
    </div>
  );
}

function NoticiaLista({
  items,
  onChange,
  conHora,
}: {
  items: Noticia[];
  onChange: (items: Noticia[]) => void;
  conHora?: boolean;
}) {
  function updateAt(i: number, n: Noticia) {
    const copy = [...items];
    copy[i] = n;
    onChange(copy);
  }
  function removeAt(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, { ...NOTICIA_VACIA, hora: conHora ? "" : undefined }]);
  }

  return (
    <div>
      {items.map((n, i) => (
        <div className="admin-card-edit" key={i}>
          <NoticiaForm noticia={n} onChange={(v) => updateAt(i, v)} conHora={conHora} />
          <button className="btn-danger" onClick={() => removeAt(i)}>
            Eliminar esta noticia
          </button>
        </div>
      ))}
      <button className="btn-secondary" onClick={add}>
        + Agregar noticia
      </button>
    </div>
  );
}

function NoticiaForm({
  noticia,
  onChange,
  conBajada,
  conHora,
}: {
  noticia: Noticia;
  onChange: (n: Noticia) => void;
  conBajada?: boolean;
  conHora?: boolean;
}) {
  return (
    <div className="admin-grid">
      <div className="admin-field admin-field-wide">
        <span>Fotografía de la noticia</span>
        <ImageUploadField
          folder="noticias"
          value={noticia.imagenUrl || ""}
          onChange={(url) => onChange({ ...noticia, imagenUrl: url })}
        />
      </div>
      <label className="admin-field">
        <span>Categoría</span>
        <input
          value={noticia.categoria}
          onChange={(e) => onChange({ ...noticia, categoria: e.target.value })}
        />
      </label>
      <label className="admin-field">
        <span>Fecha</span>
        <input value={noticia.fecha} onChange={(e) => onChange({ ...noticia, fecha: e.target.value })} />
      </label>
      {conHora && (
        <label className="admin-field">
          <span>Hora</span>
          <input value={noticia.hora || ""} onChange={(e) => onChange({ ...noticia, hora: e.target.value })} />
        </label>
      )}
      <label className="admin-field admin-field-wide">
        <span>Título</span>
        <input value={noticia.titulo} onChange={(e) => onChange({ ...noticia, titulo: e.target.value })} />
      </label>
      {conBajada && (
        <label className="admin-field admin-field-wide">
          <span>Bajada</span>
          <textarea
            value={noticia.bajada || ""}
            onChange={(e) => onChange({ ...noticia, bajada: e.target.value })}
            rows={2}
          />
        </label>
      )}
      {!conBajada && (
        <label className="admin-field admin-field-wide">
          <span>Resumen</span>
          <textarea
            value={noticia.resumen || ""}
            onChange={(e) => onChange({ ...noticia, resumen: e.target.value })}
            rows={2}
          />
        </label>
      )}
      <label className="admin-field admin-field-wide">
        <span>Contenido completo (lo que se ve al hacer clic en &quot;Leer más&quot;)</span>
        <textarea
          value={noticia.contenidoCompleto || ""}
          onChange={(e) => onChange({ ...noticia, contenidoCompleto: e.target.value })}
          rows={6}
          placeholder="Escribe acá el artículo completo. Separa los párrafos dejando una línea en blanco entre ellos. Si lo dejas vacío, se muestra la bajada o el resumen."
        />
      </label>
    </div>
  );
}

// ---------------------------------------------------------------
// RADIO
// ---------------------------------------------------------------
function RadioTab({
  data,
  setData,
}: {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
}) {
  const r = data.radio;
  function update(patch: Partial<SiteData["radio"]>) {
    setData({ ...data, radio: { ...r, ...patch } });
  }
  return (
    <div>
      <h2 className="admin-h2">Radio en vivo</h2>
      <div className="admin-grid">
        <label className="admin-field admin-toggle-field">
          <span>Estado</span>
          <label className="admin-toggle">
            <input type="checkbox" checked={r.enVivo} onChange={(e) => update({ enVivo: e.target.checked })} />
            {r.enVivo ? "En vivo" : "Fuera de aire"}
          </label>
        </label>
        <label className="admin-field">
          <span>Nombre del programa actual</span>
          <input value={r.nombrePrograma} onChange={(e) => update({ nombrePrograma: e.target.value })} />
        </label>
        <label className="admin-field">
          <span>Locutor</span>
          <input value={r.locutor} onChange={(e) => update({ locutor: e.target.value })} />
        </label>
        <label className="admin-field admin-field-wide">
          <span>URL de streaming</span>
          <input value={r.urlStreaming} onChange={(e) => update({ urlStreaming: e.target.value })} />
        </label>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// CATEGORÍAS
// ---------------------------------------------------------------
function CategoriasTab({
  data,
  setData,
}: {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
}) {
  const cats = data.categorias;
  function updateAt(i: number, c: Categoria) {
    const copy = [...cats];
    copy[i] = c;
    setData({ ...data, categorias: copy });
  }
  function removeAt(i: number) {
    setData({ ...data, categorias: cats.filter((_, idx) => idx !== i) });
  }
  function add() {
    setData({ ...data, categorias: [...cats, { nombre: "", color: "#2F4B3C" }] });
  }
  return (
    <div>
      <h2 className="admin-h2">Categorías</h2>
      <p className="admin-hint">
        El nombre debe escribirse igual en las noticias para que el color coincida (ej. &quot;Deportes&quot;).
      </p>
      {cats.map((c, i) => (
        <div className="admin-grid" key={i} style={{ marginBottom: 10, alignItems: "end" }}>
          <label className="admin-field">
            <span>Nombre</span>
            <input value={c.nombre} onChange={(e) => updateAt(i, { ...c, nombre: e.target.value })} />
          </label>
          <label className="admin-field">
            <span>Color</span>
            <input type="color" value={c.color} onChange={(e) => updateAt(i, { ...c, color: e.target.value })} />
          </label>
          <button className="btn-danger" onClick={() => removeAt(i)}>
            Eliminar
          </button>
        </div>
      ))}
      <button className="btn-secondary" onClick={add}>
        + Agregar categoría
      </button>
    </div>
  );
}

// ---------------------------------------------------------------
// MENÚ
// ---------------------------------------------------------------
function MenuTab({
  data,
  setData,
}: {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
}) {
  const items = data.menu;
  function updateAt(i: number, m: MenuItem) {
    const copy = [...items];
    copy[i] = m;
    setData({ ...data, menu: copy });
  }
  function removeAt(i: number) {
    setData({ ...data, menu: items.filter((_, idx) => idx !== i) });
  }
  function add() {
    setData({ ...data, menu: [...items, { nombre: "", href: "#" }] });
  }
  return (
    <div>
      <h2 className="admin-h2">Menú principal</h2>
      <p className="admin-hint">El orden en que los agregues acá es el orden en que aparecen en el sitio.</p>
      {items.map((m, i) => (
        <div className="admin-grid" key={i} style={{ marginBottom: 10, alignItems: "end" }}>
          <label className="admin-field">
            <span>Texto</span>
            <input value={m.nombre} onChange={(e) => updateAt(i, { ...m, nombre: e.target.value })} />
          </label>
          <label className="admin-field">
            <span>Enlace</span>
            <input value={m.href} onChange={(e) => updateAt(i, { ...m, href: e.target.value })} />
          </label>
          <button className="btn-danger" onClick={() => removeAt(i)}>
            Eliminar
          </button>
        </div>
      ))}
      <button className="btn-secondary" onClick={add}>
        + Agregar ítem al menú
      </button>
    </div>
  );
}

// ---------------------------------------------------------------
// CUENTA — cambiar contraseña
// ---------------------------------------------------------------
function CuentaTab() {
  const router = useRouter();
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [status, setStatus] = useState<
    { type: "idle" } | { type: "saving" } | { type: "ok" } | { type: "error"; msg: string }
  >({ type: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nueva.length < 6) {
      setStatus({ type: "error", msg: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (nueva !== confirmar) {
      setStatus({ type: "error", msg: "Las dos contraseñas no coinciden." });
      return;
    }
    setStatus({ type: "saving" });
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: nueva }),
      });
      const result = await res.json();
      if (!result.ok) {
        setStatus({ type: "error", msg: result.error || "No se pudo cambiar la contraseña." });
        return;
      }
      setStatus({ type: "ok" });
      // La sesión actual va a quedar inválida apenas el sitio se
      // vuelva a publicar (1-2 min). Cerramos sesión ahora para que
      // no quede confuso, y lo mandamos al login.
      await fetch("/api/admin/logout", { method: "POST" });
      setTimeout(() => {
        router.push("/admin/login");
        router.refresh();
      }, 2500);
    } catch {
      setStatus({ type: "error", msg: "No se pudo conectar con el servidor." });
    }
  }

  return (
    <div>
      <h2 className="admin-h2">Cambiar contraseña</h2>
      <p className="admin-hint">
        El cambio se publica junto con el resto del sitio, así que demora 1-2 minutos en quedar
        activo. Después de guardar vas a cerrar sesión automáticamente — espera ese tiempo y entra
        de nuevo con la contraseña nueva.
      </p>
      <form onSubmit={handleSubmit} className="admin-grid" style={{ maxWidth: 420 }}>
        <label className="admin-field admin-field-wide">
          <span>Contraseña nueva</span>
          <input type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} minLength={6} required />
        </label>
        <label className="admin-field admin-field-wide">
          <span>Confirmar contraseña nueva</span>
          <input
            type="password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            minLength={6}
            required
          />
        </label>
        {status.type === "error" && <div className="admin-error">{status.msg}</div>}
        {status.type === "ok" && (
          <div className="admin-ok">Contraseña actualizada. Cerrando sesión...</div>
        )}
        <button className="btn-save" type="submit" disabled={status.type === "saving"} style={{ width: "fit-content" }}>
          {status.type === "saving" ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------
// PUBLICIDAD
// ---------------------------------------------------------------
const TIPOS_PUBLICIDAD: { id: TipoPublicidad; label: string; hint: string }[] = [
  { id: "banner-superior", label: "Banner superior", hint: "Debajo del menú, arriba de las noticias (940×110)." },
  { id: "lateral", label: "Banner lateral", hint: "Espacio vertical junto a las últimas noticias." },
  { id: "entre-noticias", label: "Entre noticias", hint: "Bloque comercial entre secciones de noticias." },
  { id: "destacada", label: "Publicidad destacada", hint: "Espacio grande, una sola pieza grande." },
  { id: "celular", label: "Publicidad para celular", hint: "Solo se muestra en pantallas de celular." },
  { id: "auspiciador", label: "Aviso comercial (franja inferior)", hint: "Aparece en la franja \"Aviso Comercial\", con logo y descripción." },
];

function nuevoIdPublicidad() {
  return `pub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function PublicidadTab({
  data,
  setData,
}: {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
}) {
  const items = data.publicidad || [];

  function updateAt(i: number, p: PublicidadItem) {
    const copy = [...items];
    copy[i] = p;
    setData({ ...data, publicidad: copy });
  }
  function removeAt(i: number) {
    setData({ ...data, publicidad: items.filter((_, idx) => idx !== i) });
  }
  function add() {
    const nuevo: PublicidadItem = {
      id: nuevoIdPublicidad(),
      tipo: "banner-superior",
      cliente: "",
      descripcion: "",
      imagenUrl: "",
      enlace: "",
    };
    setData({ ...data, publicidad: [...items, nuevo] });
  }

  return (
    <div>
      <h2 className="admin-h2">Publicidad y auspiciadores</h2>
      <p className="admin-hint">
        Cada aviso aparece automáticamente en su espacio correspondiente en el sitio (banner
        superior, lateral, entre noticias, destacada, celular o auspiciador). Si un tipo no tiene
        ningún aviso cargado, el sitio muestra el cuadro de espacio disponible.
      </p>

      {items.map((p, i) => (
        <div className="admin-card-edit" key={p.id}>
          <div className="admin-grid">
            <label className="admin-field">
              <span>Tipo de espacio</span>
              <select
                value={p.tipo}
                onChange={(e) => updateAt(i, { ...p, tipo: e.target.value as TipoPublicidad })}
              >
                {TIPOS_PUBLICIDAD.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Cliente / Empresa</span>
              <input value={p.cliente} onChange={(e) => updateAt(i, { ...p, cliente: e.target.value })} />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Descripción</span>
              <input
                value={p.descripcion || ""}
                onChange={(e) => updateAt(i, { ...p, descripcion: e.target.value })}
                placeholder="Ej: 20% de descuento en repuestos, agosto 2026"
              />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Enlace (a dónde va si hacen clic)</span>
              <input
                value={p.enlace || ""}
                onChange={(e) => updateAt(i, { ...p, enlace: e.target.value })}
                placeholder="https://wa.me/56900000000"
              />
            </label>
            <div className="admin-field admin-field-wide">
              <span>Fotografía</span>
              <ImageUploadField
                folder="publicidad"
                value={p.imagenUrl || ""}
                onChange={(url) => updateAt(i, { ...p, imagenUrl: url })}
              />
            </div>
          </div>
          <p className="admin-hint" style={{ margin: "8px 0 0" }}>
            {TIPOS_PUBLICIDAD.find((t) => t.id === p.tipo)?.hint}
          </p>
          <button className="btn-danger" onClick={() => removeAt(i)}>
            Eliminar este aviso
          </button>
        </div>
      ))}

      <button className="btn-secondary" onClick={add}>
        + Agregar espacio comercial
      </button>
    </div>
  );
}

// ---------------------------------------------------------------
// STREAMING TV (varias señales)
// ---------------------------------------------------------------
function nuevoIdCanal() {
  return `canal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function StreamingTab({
  data,
  setData,
}: {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
}) {
  const canales = data.streamingCanales || [];

  function updateAt(i: number, patch: Partial<SiteData["streamingCanales"][number]>) {
    const copy = [...canales];
    copy[i] = { ...copy[i], ...patch };
    setData({ ...data, streamingCanales: copy });
  }
  function removeAt(i: number) {
    setData({ ...data, streamingCanales: canales.filter((_, idx) => idx !== i) });
  }
  function add() {
    setData({
      ...data,
      streamingCanales: [...canales, { id: nuevoIdCanal(), titulo: `Canal ${canales.length + 1}`, url: "", logoUrl: "" }],
    });
  }

  return (
    <div>
      <h2 className="admin-h2">Streaming de TV en vivo</h2>
      <p className="admin-hint">
        Agrega las señales que quieras mostrar en la portada (parten con 4, pero puedes agregar
        más o borrar las que no uses). Para cada una, pega el link para <strong>insertar</strong>{" "}
        (embed) — por ejemplo un video de YouTube en vivo: entra al video → Compartir → Insertar →
        copia solo la URL que está dentro de <code>src=&quot;...&quot;</code> (algo como{" "}
        <code>https://www.youtube.com/embed/XXXXXXXXXXX</code>).
      </p>
      <p className="admin-hint">
        ⚠️ Ojo: algunos canales (Mega, Canal 13, TVN, Chilevisión, etc.) bloquean a propósito que
        su señal se inserte en otras páginas — no hay forma de evitar eso desde acá. Para esos
        casos, agrega el &quot;Enlace oficial de respaldo&quot; de cada canal: aunque el video no se
        vea adentro de tu sitio, va a aparecer un botón para que la gente lo vea en la página
        oficial del canal, en una pestaña nueva.
      </p>

      {canales.map((canal, i) => (
        <div className="admin-card-edit" key={canal.id}>
          <div className="admin-grid">
            <label className="admin-field">
              <span>Nombre del canal</span>
              <input value={canal.titulo} onChange={(e) => updateAt(i, { titulo: e.target.value })} />
            </label>
            <label className="admin-field admin-field-wide">
              <span>URL para insertar (embed)</span>
              <input
                value={canal.url}
                onChange={(e) => updateAt(i, { url: e.target.value })}
                placeholder="https://www.youtube.com/embed/XXXXXXXXXXX"
              />
            </label>
            <label className="admin-field admin-field-wide">
              <span>Enlace oficial de respaldo (opcional, pero muy recomendado)</span>
              <input
                value={canal.enlaceOficial || ""}
                onChange={(e) => updateAt(i, { enlaceOficial: e.target.value })}
                placeholder="https://www.mega.cl/en-vivo"
              />
            </label>
            <div className="admin-field admin-field-wide">
              <span>Logo del canal (opcional)</span>
              <ImageUploadField
                folder="canales"
                value={canal.logoUrl || ""}
                onChange={(url) => updateAt(i, { logoUrl: url })}
              />
            </div>
          </div>
          <button className="btn-danger" onClick={() => removeAt(i)}>
            Eliminar este canal
          </button>
        </div>
      ))}

      <button className="btn-secondary" onClick={add}>
        + Agregar señal
      </button>
    </div>
  );
}

// ---------------------------------------------------------------
// FACEBOOK — sincronización automática de publicaciones
// ---------------------------------------------------------------
function FacebookTab() {
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "cargando" }
    | { type: "ok"; nuevos: number }
    | { type: "error"; msg: string }
  >({ type: "idle" });

  async function sincronizarAhora() {
    setStatus({ type: "cargando" });
    try {
      const res = await fetch("/api/admin/facebook-sync", { method: "POST" });
      const result = await res.json();
      if (!result.ok) {
        setStatus({ type: "error", msg: result.error || "No se pudo sincronizar." });
        return;
      }
      setStatus({ type: "ok", nuevos: result.nuevos });
      if (result.nuevos > 0) {
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch {
      setStatus({ type: "error", msg: "No se pudo conectar con el servidor." });
    }
  }

  return (
    <div>
      <h2 className="admin-h2">Sincronización con Facebook</h2>
      <p className="admin-hint">
        El sitio revisa tu página de Facebook <strong>una vez al día, automáticamente</strong>, y
        agrega como &quot;Última noticia&quot; cualquier publicación nueva que tenga texto. Vos
        después puedes entrar a la pestaña &quot;Noticias&quot; para pulirla, cambiarle la
        categoría, o destacarla.
      </p>
      <p className="admin-hint">
        Esto requiere haber configurado <code>FACEBOOK_PAGE_ID</code> y{" "}
        <code>FACEBOOK_PAGE_ACCESS_TOKEN</code> en Vercel — si no lo has hecho, pídele a quien te
        armó el sitio la guía de configuración.
      </p>

      <button className="btn-secondary" onClick={sincronizarAhora} disabled={status.type === "cargando"}>
        {status.type === "cargando" ? "Sincronizando..." : "Sincronizar ahora"}
      </button>

      {status.type === "ok" && (
        <p className="admin-ok" style={{ marginTop: 12 }}>
          {status.nuevos === 0
            ? "No hay publicaciones nuevas por ahora."
            : `Se agregaron ${status.nuevos} noticia${status.nuevos === 1 ? "" : "s"} nueva${
                status.nuevos === 1 ? "" : "s"
              }. Recargando la página...`}
        </p>
      )}
      {status.type === "error" && (
        <p className="admin-error" style={{ marginTop: 12 }}>
          {status.msg}
        </p>
      )}
    </div>
  );
}

function ContactoTab({
  data,
  setData,
}: {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
}) {
  const c = data.contacto;
  function update(patch: Partial<SiteData["contacto"]>) {
    setData({ ...data, contacto: { ...c, ...patch } });
  }
  return (
    <div>
      <h2 className="admin-h2">Datos de contacto</h2>
      <div className="admin-grid">
        <label className="admin-field admin-field-wide">
          <span>Dirección</span>
          <input value={c.direccion} onChange={(e) => update({ direccion: e.target.value })} />
        </label>
        <label className="admin-field">
          <span>Teléfono</span>
          <input value={c.telefono} onChange={(e) => update({ telefono: e.target.value })} />
        </label>
        <label className="admin-field">
          <span>WhatsApp</span>
          <input value={c.whatsapp} onChange={(e) => update({ whatsapp: e.target.value })} />
        </label>
        <label className="admin-field">
          <span>Email</span>
          <input value={c.email} onChange={(e) => update({ email: e.target.value })} />
        </label>
        <label className="admin-field">
          <span>Facebook</span>
          <input value={c.facebook} onChange={(e) => update({ facebook: e.target.value })} />
        </label>
        <label className="admin-field">
          <span>Instagram</span>
          <input value={c.instagram} onChange={(e) => update({ instagram: e.target.value })} />
        </label>
      </div>
    </div>
  );
}
