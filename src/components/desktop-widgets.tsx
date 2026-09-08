import { Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import reel1 from "@/assets/media/reel-1.mp4";
import reel2 from "@/assets/media/reel-2.mp4";
import { cn } from "@/lib/utils";

// Vidro escuro (widget-glass) em vez de branco: sobre um wallpaper tão
// colorido, um card branco opaco "brigava" com o fundo — o vidro deixa a
// cor do desktop passar por trás, mais parecido com widget nativo de
// verdade e mais coeso entre os dois cards.
const WIDGET_CARD = "widget-glass rounded-[28px] shadow-float";

// Capitaliza só a primeira letra — o utilitário `capitalize` do Tailwind
// (text-transform: capitalize) deixaria cada palavra maiúscula, incluindo
// preposições ("De Setembro"), o que não é português correto.
function capitalizeFirst(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function ClockWidget() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className={cn(WIDGET_CARD, "px-6 py-5 text-center text-white")}>
      <p className="text-4xl font-bold tracking-tight tabular-nums">{time}</p>
      <p className="mt-1.5 text-xs text-white/60">{capitalizeFirst(date)}</p>
    </div>
  );
}

// Alterna entre os dois reels em loop, sempre começando mudo (autoplay só é
// permitido assim). Reforços pra garantir que toca de verdade em qualquer
// navegador: `.muted` é setado direto no elemento (não só via prop — alguns
// navegadores só respeitam o mudo pro autoplay se ele já estiver "gravado"
// na hora do play) e `.load()` é chamado antes do `.play()`, porque trocar
// o `src` de um <video> que já existe no DOM não recarrega sozinho em todo
// navegador. Se mesmo assim o autoplay for bloqueado, some um botão de play
// manual — clique de usuário sempre libera a reprodução.
function ReelWidget() {
  const videos = [reel1, reel2];
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [needsPlayButton, setNeedsPlayButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Troca de fonte (vídeo 1 <-> 2): recarrega e toca do zero.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.load();
    video
      .play()
      .then(() => setNeedsPlayButton(false))
      .catch(() => setNeedsPlayButton(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só na troca de vídeo; mudo é tratado à parte abaixo, sem recarregar
  }, [index]);

  // Alternar o som: só atualiza a propriedade, sem recarregar (senão o
  // vídeo voltaria pro início toda vez que clicasse no ícone).
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  function handleManualPlay() {
    videoRef.current?.play().then(() => setNeedsPlayButton(false));
  }

  return (
    <div className={cn(WIDGET_CARD, "widget-glass--no-border group overflow-hidden")}>
      <div className="relative aspect-[9/16]">
        <video
          ref={videoRef}
          src={videos[index]}
          playsInline
          onEnded={() => setIndex((i) => (i + 1) % videos.length)}
          className="h-full w-full object-cover"
        />

        {needsPlayButton && (
          <button
            type="button"
            onClick={handleManualPlay}
            aria-label="Reproduzir vídeo"
            className="absolute inset-0 flex items-center justify-center bg-black/30"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Ativar som" : "Desativar som"}
          className={cn(
            "absolute right-2.5 bottom-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity duration-200",
            muted ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

export function DesktopWidgets() {
  return (
    <div className="fixed top-32 right-10 z-10 flex w-52 flex-col gap-5 sm:top-36 sm:right-14 sm:w-60">
      <ClockWidget />
      <ReelWidget />
    </div>
  );
}
