"use client";

import { useEffect, useState } from "react";

// Coordenadas de Coyhaique
const LAT = -45.5752;
const LON = -72.0662;

interface DiaClima {
  fecha: string;
  max: number;
  min: number;
  codigo: number;
}

interface ClimaData {
  hoy: DiaClima;
  manana: DiaClima;
}

function describirCodigo(codigo: number): { texto: string; icono: string } {
  if (codigo === 0) return { texto: "Despejado", icono: "☀️" };
  if ([1, 2].includes(codigo)) return { texto: "Parcial nublado", icono: "🌤️" };
  if (codigo === 3) return { texto: "Nublado", icono: "☁️" };
  if ([45, 48].includes(codigo)) return { texto: "Niebla", icono: "🌫️" };
  if ([51, 53, 55, 56, 57].includes(codigo)) return { texto: "Llovizna", icono: "🌦️" };
  if ([61, 63, 65, 66, 67].includes(codigo)) return { texto: "Lluvia", icono: "🌧️" };
  if ([71, 73, 75, 77].includes(codigo)) return { texto: "Nieve", icono: "❄️" };
  if ([80, 81, 82].includes(codigo)) return { texto: "Chubascos", icono: "🌦️" };
  if ([95, 96, 99].includes(codigo)) return { texto: "Tormenta", icono: "⛈️" };
  return { texto: "Variable", icono: "🌥️" };
}

function formatearFecha(iso: string, etiqueta: string): string {
  const d = new Date(iso + "T00:00:00");
  const dia = d.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });
  return `${etiqueta} · ${dia}`;
}

export default function ClimaWidget() {
  const [data, setData] = useState<ClimaData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=America%2FSantiago&forecast_days=2`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("no ok");
        const json = await res.json();
        if (!activo) return;
        setData({
          hoy: {
            fecha: json.daily.time[0],
            max: Math.round(json.daily.temperature_2m_max[0]),
            min: Math.round(json.daily.temperature_2m_min[0]),
            codigo: json.daily.weathercode[0],
          },
          manana: {
            fecha: json.daily.time[1],
            max: Math.round(json.daily.temperature_2m_max[1]),
            min: Math.round(json.daily.temperature_2m_min[1]),
            codigo: json.daily.weathercode[1],
          },
        });
        setError(false);
      } catch {
        if (activo) setError(true);
      }
    }

    cargar();
    // se refresca solo cada 30 minutos
    const interval = setInterval(cargar, 30 * 60 * 1000);
    return () => {
      activo = false;
      clearInterval(interval);
    };
  }, []);

  if (error) {
    return (
      <div className="clima-widget clima-error">No se pudo cargar el clima en este momento.</div>
    );
  }

  if (!data) {
    return <div className="clima-widget clima-loading">Cargando clima de Coyhaique...</div>;
  }

  const hoy = describirCodigo(data.hoy.codigo);
  const manana = describirCodigo(data.manana.codigo);

  return (
    <div className="clima-widget">
      <div className="clima-titulo">Clima en Coyhaique</div>
      <div className="clima-grid">
        <div className="clima-dia">
          <span className="clima-etiqueta">{formatearFecha(data.hoy.fecha, "Hoy")}</span>
          <span className="clima-icono">{hoy.icono}</span>
          <span className="clima-temp">
            {data.hoy.max}° <small>/ {data.hoy.min}°</small>
          </span>
          <span className="clima-desc">{hoy.texto}</span>
        </div>
        <div className="clima-dia">
          <span className="clima-etiqueta">{formatearFecha(data.manana.fecha, "Mañana")}</span>
          <span className="clima-icono">{manana.icono}</span>
          <span className="clima-temp">
            {data.manana.max}° <small>/ {data.manana.min}°</small>
          </span>
          <span className="clima-desc">{manana.texto}</span>
        </div>
      </div>
      <div className="clima-fuente">Se actualiza solo · Open-Meteo</div>
    </div>
  );
}
