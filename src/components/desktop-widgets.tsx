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
export function capitalizeFirst(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function ClockWidget() {
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

// Alterna entre os dois reels em loop contínuo, sempre começando mudo
// (autoplay só é permitido assim). Reforços pra garantir que toca de
// verdade e NUNCA trava a sequência:
// - `.muted` é setado direto no elemento (não só via prop — alguns
//   navegadores só respeitam o mudo pro autoplay se ele já estiver
//   "gravado" na hora do play) e `.load()` é chamado antes do `.play()`,
//   porque trocar o `src` de um <video> que já existe no DOM não recarrega
//   sozinho em todo navegador.
// - Se a pessoa tinha ativado o som e o vídeo termina, a troca automática
//   pro próximo vídeo NÃO tem gesto do usuário — o navegador bloqueia
//   autoplay com som nesse caso. Por isso, se o play falhar, força mudo e
//   tenta de novo: a sequência nunca pode parar, mesmo que isso signifique
//   voltar a ficar mudo no próximo vídeo.
function useReelPlayback() {
  const videos = [reel1, reel2];
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [needsPlayButton, setNeedsPlayButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Troca de fonte (vídeo 1 <-> 2): recarrega e toca do zero. `cancelled`
  // evita chamar .play() de novo num elemento que já foi desmontado nesse
  // meio tempo — sem isso, o navegador acusa "no supported sources" porque
  // o <video> desmontado perde o src.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;

    video.muted = muted;
    video.load();
    video
      .play()
      .then(() => {
        if (!cancelled) setNeedsPlayButton(false);
      })
      .catch(() => {
        if (cancelled) return;
        video.muted = true;
        setMuted(true);
        video
          .play()
          .then(() => {
            if (!cancelled) setNeedsPlayButton(false);
          })
          .catch(() => {
            if (!cancelled) setNeedsPlayButton(true);
          });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só na troca de vídeo; mudo é tratado à parte abaixo, sem recarregar
  }, [index]);

  // Alternar o som: só atualiza a propriedade, sem recarregar (senão o
  // vídeo voltaria pro início toda vez que clicasse no ícone).
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  return {
    videoRef,
    src: videos[index],
    muted,
    toggleMuted: () => setMuted((m) => !m),
    needsPlayButton,
    handleEnded: () => setIndex((i) => (i + 1) % videos.length),
    handleManualPlay: () => videoRef.current?.play().then(() => setNeedsPlayButton(false)),
  };
}

function MuteButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? "Ativar som" : "Desativar som"}
      className={cn(
        "absolute right-2.5 bottom-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity duration-200",
        muted ? "opacity-100" : "opacity-0 group-hover:opacity-100",
      )}
    >
      {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
    </button>
  );
}

function PlayButton({ onPlay }: { onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label="Reproduzir vídeo"
      className="absolute inset-0 flex items-center justify-center bg-black/30"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black">
        <Play className="ml-0.5 h-5 w-5 fill-current" />
      </span>
    </button>
  );
}

export function ReelWidget() {
  const { videoRef, src, muted, toggleMuted, needsPlayButton, handleEnded, handleManualPlay } = useReelPlayback();

  return (
    <div className={cn(WIDGET_CARD, "widget-glass--no-border group overflow-hidden")}>
      <div className="relative aspect-[9/16]">
        <video ref={videoRef} src={src} playsInline onEnded={handleEnded} className="h-full w-full object-cover" />
        {needsPlayButton && <PlayButton onPlay={handleManualPlay} />}
        <MuteButton muted={muted} onToggle={toggleMuted} />
      </div>
    </div>
  );
}

// Igual ao ReelWidget, mas ocupando 100% da altura do pai em vez de manter
// a proporção 9:16 fixa — usado no mobile, onde a altura do vídeo precisa
// corresponder exatamente a 4 "unidades" da grade (ver mobile-home-screen).
// `object-cover` continua cortando o vídeo pra preencher qualquer altura
// sem distorcer.
export function ReelWidgetFill() {
  const { videoRef, src, muted, toggleMuted, needsPlayButton, handleEnded, handleManualPlay } = useReelPlayback();

  return (
    <div className="widget-glass widget-glass--no-border group relative h-full overflow-hidden rounded-2xl shadow-float">
      <video ref={videoRef} src={src} playsInline onEnded={handleEnded} className="h-full w-full object-cover" />
      {needsPlayButton && <PlayButton onPlay={handleManualPlay} />}
      <MuteButton muted={muted} onToggle={toggleMuted} />
    </div>
  );
}

export function DesktopWidgets() {
  return (
    <div className="fixed top-28 right-24 z-10 flex w-52 flex-col gap-5 sm:top-32 sm:right-28 sm:w-60">
      <ClockWidget />
      <ReelWidget />
    </div>
  );
}
