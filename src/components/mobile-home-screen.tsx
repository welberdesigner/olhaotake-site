import { BatteryFull, Info, Signal, Wifi } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import iconCalendario from "@/assets/icons/calendario.png";
import iconEmail from "@/assets/icons/email.png";
import iconGaleria from "@/assets/icons/galeria.png";
import iconInstagram from "@/assets/icons/instagram.png";
import iconPlanos from "@/assets/icons/planos.png";
import iconProjetos from "@/assets/icons/projetos.png";
import iconWhatsapp from "@/assets/icons/whatsapp.png";
import logo from "@/assets/logo.png";
import { rectToOrigin, WHATSAPP_URL, type OpenWindowFn, type WindowKey } from "@/lib/windows";

// Tela inicial estilo iPhone: sem dock flutuante nem magnificação (não faz
// sentido em touch) — os apps viram uma grade fixa, como uma springboard.
// "Sobre" não tem ícone PNG próprio (só existe hoje no menu do desktop), por
// isso usa um ícone Lucide num quadrado com o degradê da marca, mesmo
// tratamento visual dos outros.
type AppEntry = { label: string; icon?: string; Icon?: ComponentType<{ className?: string }> } & (
  | { window: WindowKey }
  | { href: string }
);

// Mesmo agrupamento por função do dock (ver desktop-dock.tsx).
const APPS: AppEntry[] = [
  { label: "Sobre", window: "sobre", Icon: Info },
  { label: "Projetos", window: "projetos", icon: iconProjetos },
  { label: "Galeria", window: "galeria", icon: iconGaleria },
  { label: "Pacotes", window: "pacotes", icon: iconPlanos },
  { label: "Calendário", window: "calendario", icon: iconCalendario },
  { label: "Contato", window: "contato", icon: iconEmail },
  { label: "WhatsApp", href: WHATSAPP_URL("Olá! Vim pelo site da Olha o Take e quero saber mais."), icon: iconWhatsapp },
  { label: "Instagram", window: "instagram", icon: iconInstagram },
];

function MobileStatusBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-1 text-white">
      <span className="text-sm font-semibold tabular-nums">
        {now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
      </span>
      <div className="flex items-center gap-1.5 opacity-90">
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-4 w-4" />
      </div>
    </div>
  );
}

function AppIcon({ app, onOpenWindow }: { app: AppEntry; onOpenWindow: OpenWindowFn }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        if ("href" in app) {
          window.open(app.href, "_blank", "noopener,noreferrer");
          return;
        }
        onOpenWindow(app.window, rectToOrigin(e.currentTarget.getBoundingClientRect()));
      }}
      className="flex flex-col items-center gap-1.5 active:opacity-70"
    >
      {app.icon ? (
        <img src={app.icon} alt="" className="h-14 w-14 drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]" />
      ) : app.Icon ? (
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
          <app.Icon className="h-6 w-6" />
        </span>
      ) : null}
      <span className="text-[11px] font-medium text-white drop-shadow-sm">{app.label}</span>
    </button>
  );
}

export function MobileHomeScreen({ onOpenWindow }: { onOpenWindow: OpenWindowFn }) {
  return (
    <div className="flex min-h-svh flex-col">
      <MobileStatusBar />

      <img src={logo} alt="Olha o Take" className="mx-auto mt-3 h-5 w-auto" />

      <div className="mt-8 grid grid-cols-4 gap-x-4 gap-y-7 px-6">
        {APPS.map((app) => (
          <AppIcon key={app.label} app={app} onOpenWindow={onOpenWindow} />
        ))}
      </div>
    </div>
  );
}
