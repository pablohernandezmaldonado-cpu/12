import type { ReactNode } from "react";

// Convierte texto con marcas simples **negrita** y *cursiva* en
// elementos reales <strong>/<em>. Si no hay marcas, devuelve el texto
// tal cual.
export function conFormato(texto: string | undefined): ReactNode {
  if (!texto) return texto;

  const partes: ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let ultimoIndice = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(texto)) !== null) {
    if (match.index > ultimoIndice) {
      partes.push(texto.slice(ultimoIndice, match.index));
    }
    if (match[1] !== undefined) {
      partes.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      partes.push(<em key={key++}>{match[2]}</em>);
    }
    ultimoIndice = regex.lastIndex;
  }

  if (ultimoIndice < texto.length) {
    partes.push(texto.slice(ultimoIndice));
  }

  return partes;
}
