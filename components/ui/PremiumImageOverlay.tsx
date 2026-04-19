/**
 * Gradiente unificado con HomeHero: legibilidad sobre foto/vídeo sin cambiar el layout.
 */
export default function PremiumImageOverlay({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.4) 48%, rgba(0,0,0,0.22) 100%)",
      }}
      aria-hidden
    />
  );
}
