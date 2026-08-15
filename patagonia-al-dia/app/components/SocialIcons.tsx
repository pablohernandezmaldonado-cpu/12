interface ContactoSocial {
  whatsapp: string;
  facebook: string;
  instagram: string;
}

function soloDigitos(texto: string): string {
  return texto.replace(/[^0-9]/g, "");
}

export default function SocialIcons({
  contacto,
  className,
}: {
  contacto: ContactoSocial;
  className?: string;
}) {
  const waDigits = soloDigitos(contacto.whatsapp);

  return (
    <div className={`social-icons ${className || ""}`}>
      {waDigits && (
        <a
          href={`https://wa.me/${waDigits}`}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="social-icon-link"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.42c1.37.75 2.93 1.18 4.6 1.18h.01c5.46 0 9.91-4.45 9.91-9.91C21.93 6.45 17.5 2 12.04 2Zm5.71 14.02c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.13.11-1.83-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.19-1.58-1.19-3.02 0-1.44.75-2.14 1.02-2.44.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.83 2.01.9 2.16.07.15.12.32.02.51-.1.19-.15.32-.29.49-.14.17-.3.38-.43.51-.14.14-.29.29-.13.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.63-.14.25.1 1.6.75 1.87.89.27.14.45.21.51.32.07.11.07.63-.17 1.31Z" />
          </svg>
        </a>
      )}
      {contacto.facebook && (
        <a
          href={contacto.facebook}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className="social-icon-link"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
          </svg>
        </a>
      )}
      {contacto.instagram && (
        <a
          href={contacto.instagram}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="social-icon-link"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
          </svg>
        </a>
      )}
    </div>
  );
}
