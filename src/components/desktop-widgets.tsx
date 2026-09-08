import { Megaphone } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const WIDGET_CARD = "rounded-2xl border border-white/15 bg-white/10 shadow-float backdrop-blur-xl";

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
    <div className={cn(WIDGET_CARD, "px-5 py-4 text-center text-white")}>
      <p className="text-4xl font-semibold tracking-tight tabular-nums">{time}</p>
      <p className="mt-1 text-xs text-white/70">{capitalizeFirst(date)}</p>
    </div>
  );
}

function CalendarWidget() {
  const now = new Date();
  const weekday = now.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
  const month = now.toLocaleDateString("pt-BR", { month: "long" });

  return (
    <div className={cn(WIDGET_CARD, "overflow-hidden text-center text-white")}>
      <div className="bg-destructive px-4 py-1 text-xs font-semibold tracking-wide text-destructive-foreground uppercase">
        {weekday}
      </div>
      <div className="px-4 py-3">
        <p className="text-4xl leading-none font-bold">{now.getDate()}</p>
        <p className="mt-1 text-xs text-white/70">{capitalizeFirst(month)}</p>
      </div>
    </div>
  );
}

// Espaço reservado pra imagem de promoção — quando tiver a arte definitiva,
// basta passar `imageSrc` (ver uso em DesktopWidgets logo abaixo).
function PromoWidget({ imageSrc }: { imageSrc?: string }) {
  if (imageSrc) {
    return (
      <div className={cn(WIDGET_CARD, "overflow-hidden")}>
        <img src={imageSrc} alt="Promoção" className="aspect-[4/5] w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        WIDGET_CARD,
        "flex aspect-[4/5] flex-col items-center justify-center gap-2 border-dashed p-4 text-center text-white/60",
      )}
    >
      <Megaphone className="h-6 w-6" />
      <p className="text-xs font-medium text-white/80">Promoções</p>
      <p className="text-[11px] leading-snug text-white/50">Espaço reservado pra imagem de promoção</p>
    </div>
  );
}

export function DesktopWidgets() {
  return (
    <div className="fixed top-24 right-6 z-10 flex w-44 flex-col gap-4 sm:top-28 sm:right-10 sm:w-52">
      <ClockWidget />
      <CalendarWidget />
      <PromoWidget />
    </div>
  );
}
