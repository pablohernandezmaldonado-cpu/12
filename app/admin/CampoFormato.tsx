"use client";

import { useRef } from "react";

function insertarMarcador(
  valor: string,
  selStart: number,
  selEnd: number,
  marca: string
): { nuevo: string; nuevoStart: number; nuevoEnd: number } {
  const seleccion = valor.slice(selStart, selEnd) || "texto";
  const nuevo = valor.slice(0, selStart) + marca + seleccion + marca + valor.slice(selEnd);
  return {
    nuevo,
    nuevoStart: selStart + marca.length,
    nuevoEnd: selStart + marca.length + seleccion.length,
  };
}

function quitarMarcadores(valor: string, selStart: number, selEnd: number): string {
  const seleccion = valor.slice(selStart, selEnd);
  const limpio = seleccion.replace(/\*\*/g, "").replace(/\*/g, "");
  return valor.slice(0, selStart) + limpio + valor.slice(selEnd);
}

function Toolbar({ onNegrita, onCursiva, onNormal }: { onNegrita: () => void; onCursiva: () => void; onNormal: () => void }) {
  return (
    <div className="formato-toolbar">
      <button type="button" className="fmt-btn" onClick={onNegrita} title="Negrita">
        <strong>N</strong>
      </button>
      <button type="button" className="fmt-btn" onClick={onCursiva} title="Cursiva">
        <em>I</em>
      </button>
      <button type="button" className="fmt-btn" onClick={onNormal} title="Quitar formato">
        Normal
      </button>
    </div>
  );
}

// Selecciona texto y aprieta Negrita/Cursiva para resaltarlo. Si no
// seleccionas nada, inserta la marca en el cursor con la palabra
// "texto" de ejemplo, lista para reemplazar.
export function CampoTituloFormato({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  function aplicar(marca: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const { nuevo, nuevoStart, nuevoEnd } = insertarMarcador(value, start, end, marca);
    onChange(nuevo);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(nuevoStart, nuevoEnd);
    });
  }

  function quitar() {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? value.length;
    onChange(quitarMarcadores(value, start, end));
  }

  return (
    <div>
      <Toolbar onNegrita={() => aplicar("**")} onCursiva={() => aplicar("*")} onNormal={quitar} />
      <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function AreaTextoFormato({
  value,
  onChange,
  rows,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function aplicar(marca: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const { nuevo, nuevoStart, nuevoEnd } = insertarMarcador(value, start, end, marca);
    onChange(nuevo);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(nuevoStart, nuevoEnd);
    });
  }

  function quitar() {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? value.length;
    onChange(quitarMarcadores(value, start, end));
  }

  return (
    <div>
      <Toolbar onNegrita={() => aplicar("**")} onCursiva={() => aplicar("*")} onNormal={quitar} />
      <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} />
    </div>
  );
}
