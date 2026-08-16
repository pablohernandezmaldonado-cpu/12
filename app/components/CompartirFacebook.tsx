"use client";

export default function CompartirFacebook({ titulo }: { titulo: string }) {
  function compartir() {
    const url = window.location.href;
    const texto = `${titulo} 👉👉 Lee aquí:`;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(texto)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=650");
  }

  return (
    <button type="button" onClick={compartir} className="compartir-fb-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.775-1.63 1.57v1.88h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
      </svg>
      Compartir en Facebook
    </button>
  );
}
