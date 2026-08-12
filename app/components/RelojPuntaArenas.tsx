"use client";

import { useEffect, useState } from "react";

export default function RelojPuntaArenas() {
  const [hora, setHora] = useState<string>("--:--:--");

  useEffect(() => {
    function actualizar() {
      const ahora = new Date();
      const formateado = new Intl.DateTimeFormat("es-CL", {
        timeZone: "America/Punta_Arenas",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(ahora);
      setHora(formateado);
    }
    actualizar();
    const interval = setInterval(actualizar, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="reloj-widget">
      <span className="dot" style={{ background: "#7fb8a8", animation: "none" }} /> {hora} HRS · PUNTA ARENAS
    </span>
  );
}
