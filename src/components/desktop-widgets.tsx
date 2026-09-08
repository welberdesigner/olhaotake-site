import { motion } from "framer-motion";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
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

// Feed "ao vivo" do que foi entregue hoje — puxa da API do cronograma
// (rota pública `public_activity_today`, sem chave: só devolve eventos crus
// {tipo, status, horário}, NUNCA nome de cliente ou título — ver
// `publicActivityToday()` em api-completo-atualizado.php). Cada linha vira
// "HH:MM  +N Tipo status" (horário primeiro, discreto; descrição depois,
// em destaque — pedido explícito). Dois itens só viram uma linha "+N"
// quando bateram status no MESMO MINUTO de verdade (pedido explícito) —
// cada `statusChangedAt` é um `Date.now()` individual, então minuto (não
// milissegundo exato) é o que captura "aconteceu junto" sem depender de
// coincidência de milissegundo. Consulta de novo a cada 45s pra parecer
// realmente ao vivo, sem precisar recarregar a página.
type ActivityItem = { type: string; status: string; at: number };
type ActivityGroup = { bucket: string; status: string; count: number; at: number };

const ACTIVITY_ENDPOINT = "https://api.olhaotake.com.br/api.php?action=public_activity_today";
const ACTIVITY_POLL_MS = 45_000;
const ACTIVITY_MAX_LINES = 10;

// Minúsculo de propósito (pedido explícito) — "arte enviada", "reels
// aprovado", não "Arte"/"Reels".
const ACTIVITY_TYPE_LABEL: Record<string, { singular: string; plural: string; gender: "m" | "f" }> = {
  reels: { singular: "reels", plural: "reels", gender: "m" },
  carrossel: { singular: "carrossel", plural: "carrosséis", gender: "m" },
  // Arte de feed e arte de story viram o mesmo rótulo (ver canonicalActivityBucket).
  image: { singular: "arte", plural: "artes", gender: "f" },
  story: { singular: "story", plural: "stories", gender: "m" },
};

// Cada status é uma frase própria, não só um adjetivo — "enviado para
// revisão" tem uma cauda fixa ("para revisão") que não pluraliza junto,
// por isso singular/plural vêm prontos aqui em vez de montar com +"s".
const ACTIVITY_STATUS_LABEL: Record<string, { m: string; f: string; mPlural: string; fPlural: string }> = {
  review: {
    m: "enviado para revisão",
    f: "enviada para revisão",
    mPlural: "enviados para revisão",
    fPlural: "enviadas para revisão",
  },
  approved: { m: "aprovado", f: "aprovada", mPlural: "aprovados", fPlural: "aprovadas" },
  published: { m: "postado", f: "postada", mPlural: "postados", fPlural: "postadas" },
};

// "storie_arte" (arte de story) e "image" (arte de feed) contam como o
// mesmo rótulo "arte" — sem isso, apareceriam duas linhas "+1 arte..."
// separadas no mesmo minuto.
function canonicalActivityBucket(type: string): string | null {
  if (type === "storie_arte") return "image";
  return ACTIVITY_TYPE_LABEL[type] ? type : null;
}

// Horário e descrição separados (não uma string só) — o horário vem
// PRIMEIRO na linha, num estilo discreto (menor, apagado), e a descrição
// depois, em destaque. Pedido explícito de deixar mais bonito em vez de só
// concatenar tudo num parágrafo corrido.
type ActivityLine = { key: string; time: string; text: string };

function formatActivityLine(group: ActivityGroup): ActivityLine | null {
  const typeInfo = ACTIVITY_TYPE_LABEL[group.bucket];
  const statusInfo = ACTIVITY_STATUS_LABEL[group.status];
  if (!typeInfo || !statusInfo) return null;
  const plural = group.count > 1;
  const noun = plural ? typeInfo.plural : typeInfo.singular;
  const phrase = plural
    ? typeInfo.gender === "f"
      ? statusInfo.fPlural
      : statusInfo.mPlural
    : typeInfo.gender === "f"
      ? statusInfo.f
      : statusInfo.m;
  const time = new Date(group.at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return {
    key: `${group.bucket}|${group.status}|${group.at}`,
    time,
    text: `+${group.count} ${noun} ${phrase}`,
  };
}

// `null` = ainda não carregou nenhuma vez (mostra "Carregando…"); depois
// disso, uma falha de rede mantém a última lista boa em vez de zerar —
// o widget nunca "quebra" por causa da API do cronograma estar fora do ar.
function useActivityToday() {
  const [lines, setLines] = useState<ActivityLine[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(ACTIVITY_ENDPOINT, { cache: "no-store" });
        if (!res.ok) throw new Error("bad status");
        const json = await res.json();
        if (cancelled || !json?.ok || !Array.isArray(json.items)) return;

        // Agrupa só quem bateu status no mesmo minuto (mesmo bucket+status).
        const groups = new Map<string, ActivityGroup>();
        for (const item of json.items as ActivityItem[]) {
          const bucket = canonicalActivityBucket(item.type);
          if (!bucket || !Number.isFinite(item.at)) continue;
          const minute = Math.floor(item.at / 60_000) * 60_000;
          const key = `${bucket}|${item.status}|${minute}`;
          const existing = groups.get(key);
          if (existing) existing.count += 1;
          else groups.set(key, { bucket, status: item.status, count: 1, at: item.at });
        }

        const formatted = Array.from(groups.values())
          .sort((a, b) => b.at - a.at) // mais recente primeiro
          .slice(0, ACTIVITY_MAX_LINES)
          .map(formatActivityLine)
          .filter((line): line is ActivityLine => Boolean(line));

        if (!cancelled) setLines(formatted);
      } catch {
        // API indisponível ou bloqueada (ex.: CORS) — mantém o estado atual.
      }
    }

    load();
    const id = setInterval(load, ACTIVITY_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return lines;
}

export function ActivityWidget() {
  const lines = useActivityToday();

  return (
    <div className={cn(WIDGET_CARD, "flex h-full flex-col px-5 py-4 text-white")}>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-white/55 uppercase">
        {/* Vermelho de propósito (pedido explícito) — é o "sinal de ao
            vivo" universal (luz de gravação), não faz sentido tentar
            encaixar no degradê da marca aqui. */}
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-red-500" />
        Agência Ao Vivo
      </p>
      <div className="mt-2.5 flex-1 overflow-y-auto">
        {lines === null ? (
          <p className="text-sm text-white/50">Carregando…</p>
        ) : lines.length === 0 ? (
          <p className="text-sm text-white/50">Nenhuma novidade ainda</p>
        ) : (
          <div className="divide-y divide-white/10">
            {lines.map((line) => (
              <div key={line.key} className="flex items-baseline gap-2.5 py-1.5 first:pt-0 last:pb-0">
                <span className="w-9 shrink-0 text-[11px] font-medium tabular-nums text-white/45">{line.time}</span>
                <span className="text-sm leading-snug font-medium">{line.text}</span>
              </div>
            ))}
          </div>
        )}
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

// Cada widget é arrastável de forma independente (dá pra soltar em
// qualquer canto do desktop) — sem salvar em lugar nenhum, então
// atualizar a página sempre volta pra essa posição empilhada aqui.
//
// O limite de arrasto usa uma "área segura" invisível (safeAreaRef) em vez
// de valores fixos em pixels: um objeto fixo não sabe onde a topbar e o
// dock realmente terminam, então ou sobrava espaço de sobra (o problema
// relatado: a margem da esquerda deixava o widget avançar demais) ou faltava
// nas outras direções. Com um elemento de referência, o framer-motion mede
// o retângulo real dessa área a cada arrasto e nunca deixa o widget sair
// dela — bloqueando os 4 lados (topo/base/esquerda/direita) de forma
// consistente, sem invadir a topbar (textos "Sobre/Galeria/Contatos") nem
// o dock (ícones), e se ajustando sozinho a qualquer tamanho de tela.
function SafeDragArea({ areaRef }: { areaRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={areaRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-4 top-20 bottom-36 sm:inset-x-6 sm:top-24 sm:bottom-40"
    />
  );
}

export function DesktopWidgets() {
  const safeAreaRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <SafeDragArea areaRef={safeAreaRef} />
      {/* Grupo mais pra baixo e afastado do canto direito (margem maior —
          pedido explícito: longe do canto, não coladinho). Relógio em
          cima, status embaixo dele, numa coluna — e o vídeo do lado dessa
          coluna.
          IMPORTANTE: a coluna tem altura FIXA, calculada pra bater exato
          com a altura do vídeo (aspect-[9/16] nas mesmas larguras w-52/
          sm:w-60 do ReelWidget: 208px*16/9 e 240px*16/9). Antes isso era
          feito com `items-stretch` (a coluna "esticava" até a altura do
          vídeo) — mas quando o feed da Agência Ao Vivo cresce (mais
          linhas), o CONTEÚDO da coluna passava a ser mais alto que o
          vídeo, e aí era o VÍDEO que esticava (sem precisar, já que ele
          tem proporção fixa) — o wrapper arrastável dele ficava mais alto
          que a área seguro permitia, e o framer-motion "corrigia"
          deslocando o vídeo pra cima pra caber, descolando os dois. Com
          altura fixa na coluna (e `items-start` na fileira, sem stretch),
          o vídeo nunca mais é esticado por causa do status — o status é
          quem se adapta (`flex-1` + rolagem interna) a essa altura fixa. */}
      <div className="fixed inset-x-0 top-40 z-10 flex items-start justify-end gap-4 pr-48 sm:top-44 sm:gap-5 sm:pr-64">
        <div className="flex h-[369.8px] w-52 flex-col gap-5 sm:h-[426.7px] sm:w-60">
          <motion.div
            drag
            dragMomentum={false}
            dragConstraints={safeAreaRef}
            dragElastic={0}
            whileDrag={{ cursor: "grabbing" }}
            className="cursor-grab"
          >
            <ClockWidget />
          </motion.div>
          <motion.div
            drag
            dragMomentum={false}
            dragConstraints={safeAreaRef}
            dragElastic={0}
            whileDrag={{ cursor: "grabbing" }}
            className="min-h-0 flex-1 cursor-grab"
          >
            <ActivityWidget />
          </motion.div>
        </div>
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={safeAreaRef}
          dragElastic={0}
          whileDrag={{ cursor: "grabbing" }}
          className="w-52 cursor-grab sm:w-60"
        >
          <ReelWidget />
        </motion.div>
      </div>
    </>
  );
}
