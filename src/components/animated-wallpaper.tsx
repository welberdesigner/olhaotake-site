import { useMemo, type CSSProperties } from "react";

// Blobs de luz que pulsam nas cores da marca (ciano → violeta → fúcsia).
// Tamanhos e posições calibrados pra reproduzir a composição do wallpaper
// original (ciano dominando o canto superior direito, fúcsia/violeta
// tomando conta da esquerda) — só que animado, sem imagem nenhuma.
const AURORA_BLOBS = [
  { color: "var(--brand-cyan)", top: "-30%", left: "35%", size: "115vmax", duration: "12s", delay: "0s" },
  { color: "var(--brand-violet)", top: "0%", left: "-15%", size: "95vmax", duration: "14s", delay: "-5s" },
  { color: "var(--brand-fuchsia)", top: "40%", left: "-20%", size: "85vmax", duration: "11s", delay: "-9s" },
] as const;

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  minOpacity: number;
  maxOpacity: number;
}

function useStarField(count: number): Star[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 1.6 + 0.6,
        duration: Math.random() * 3 + 2.5,
        delay: Math.random() * 5,
        minOpacity: Math.random() * 0.25,
        maxOpacity: Math.random() * 0.35 + 0.65,
      })),
    [count],
  );
}

export function AnimatedWallpaper() {
  const stars = useStarField(140);

  return (
    <div data-desktop-surface className="fixed inset-0 overflow-hidden bg-[var(--sidebar)]">
      {AURORA_BLOBS.map((blob, i) => (
        <div
          key={i}
          className="aurora-blob pointer-events-none"
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            animationDuration: blob.duration,
            animationDelay: blob.delay,
          }}
        />
      ))}

      {stars.map((s) => (
        <span
          key={s.id}
          className="star pointer-events-none"
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              "--star-min": s.minOpacity,
              "--star-max": s.maxOpacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
