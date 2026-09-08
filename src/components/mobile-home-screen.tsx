import iconApps from "@/assets/icons/apps.png";
import iconCalendario from "@/assets/icons/calendario.png";
import iconEmail from "@/assets/icons/email.png";
import iconGaleria from "@/assets/icons/galeria.png";
import iconInstagram from "@/assets/icons/instagram.png";
import iconPlanos from "@/assets/icons/planos.png";
import iconProjetos from "@/assets/icons/projetos.png";
import iconSobre from "@/assets/icons/sobre.png";
import iconWhatsapp from "@/assets/icons/whatsapp.png";
import logo from "@/assets/logo.png";
import { ReelWidgetFill } from "@/components/desktop-widgets";
import { CRONOGRAMA_URL, rectToOrigin, WHATSAPP_URL, type OpenWindowFn, type WindowKey } from "@/lib/windows";

// Tela inicial estilo iPhone: sem dock flutuante nem magnificação (não faz
// sentido em touch) — os apps viram uma grade fixa, como uma springboard.
// Sem status bar própria (hora/sinal/wifi/bateria) — isso é coisa do
// sistema operacional de verdade do celular, não precisa ser desenhado
// de novo aqui.
type AppEntry = { label: string; icon: string } & (
  | { kind: "launchpad" }
  | { kind: "window"; window: WindowKey }
  | { kind: "link"; href: string }
);

// Coluna da direita: 5 ícones cobrindo a altura inteira do vídeo (5
// unidades). Linha de baixo: mais 4, com "Apps" por último (canto inferior
// direito) — é o último ícone na ordem de leitura da tela toda.
const SIDE_ICONS: AppEntry[] = [
  { label: "Sobre", icon: iconSobre, kind: "window", window: "sobre" },
  { label: "Projetos", icon: iconProjetos, kind: "window", window: "projetos" },
  { label: "Galeria", icon: iconGaleria, kind: "window", window: "galeria" },
  { label: "Pacotes", icon: iconPlanos, kind: "window", window: "pacotes" },
  { label: "Calendário", icon: iconCalendario, kind: "link", href: CRONOGRAMA_URL },
];

const BOTTOM_ICONS: AppEntry[] = [
  { label: "Contato", icon: iconEmail, kind: "window", window: "contato" },
  {
    label: "WhatsApp",
    icon: iconWhatsapp,
    kind: "link",
    href: WHATSAPP_URL("Olá! Vim pelo site da Olha o Take e quero saber mais."),
  },
  { label: "Instagram", icon: iconInstagram, kind: "window", window: "instagram" },
  { label: "Apps", icon: iconApps, kind: "launchpad" },
];

function AppIcon({
  app,
  onOpenWindow,
  onOpenLaunchpad,
}: {
  app: AppEntry;
  onOpenWindow: OpenWindowFn;
  onOpenLaunchpad: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        if (app.kind === "launchpad") {
          onOpenLaunchpad();
        } else if (app.kind === "link") {
          window.open(app.href, "_blank", "noopener,noreferrer");
        } else {
          onOpenWindow(app.window, rectToOrigin(e.currentTarget.getBoundingClientRect()));
        }
      }}
      className="flex flex-col items-center justify-center gap-1.5 active:opacity-70"
    >
      <img src={app.icon} alt="" className="h-16 w-16 drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]" />
      <span className="text-[11px] font-medium text-white drop-shadow-sm">{app.label}</span>
    </button>
  );
}

// Faixa só com a logo (a mesma usada em todo o resto do site) — largura
// inteira, altura de 2 ícones (mais alta que os outros widgets, pedido
// explícito). Fundo preto translúcido (em vez do vidro claro dos outros
// widgets) — pedido explícito, só pra esse. `max-h-full` (não `h-full`) no
// <img> porque percentual de altura só resolve direito se TODA a cadeia de
// pais tiver altura definida.
function LogoBanner() {
  return (
    <div className="flex h-full min-h-0 items-center justify-center rounded-2xl border border-white/10 bg-black/45 px-6 shadow-float backdrop-blur-xl">
      <img src={logo} alt="Olha o Take" className="max-h-[28%] w-auto object-contain" />
    </div>
  );
}

// Grade de verdade (CSS Grid, 4 colunas × 8 linhas de altura IGUAL — 1fr
// cada): logo 4x2 no topo (mais alta que 1 ícone), vídeo 3x5 ao lado de
// mais 5 ícones, e uma última linha com 4 ícones. `h-svh` no container
// (altura FIXA da tela, não só mínima) + `min-h-0` em cada célula é o que
// faz o grid realmente dividir em frações iguais — sem `min-h-0`, o
// conteúdo grande (imagem/vídeo) força a célula a crescer além do 1fr
// ("grid blowout", um problema clássico do CSS Grid).
export function MobileHomeScreen({
  onOpenWindow,
  onOpenLaunchpad,
}: {
  onOpenWindow: OpenWindowFn;
  onOpenLaunchpad: () => void;
}) {
  return (
    <div
      className="mx-auto grid h-svh w-full max-w-sm grid-cols-4 gap-3 overflow-hidden px-4 pt-[max(env(safe-area-inset-top),5rem)] pb-4"
      style={{ gridTemplateRows: "repeat(8, 1fr)" }}
    >
      <div style={{ gridColumn: "1 / span 4", gridRow: "1 / span 2" }} className="min-h-0">
        <LogoBanner />
      </div>

      <div style={{ gridColumn: "1 / span 3", gridRow: "3 / span 5" }} className="min-h-0">
        <ReelWidgetFill />
      </div>

      {/* Spans as 5 linhas do vídeo como UMA célula só; por dentro, 5 divs
          com o mesmo gap-3 do grid e `flex-1` cada — matematicamente isso
          dá a cada ícone a mesma altura de 1 linha da grade (a conta do
          gap se cancela), alinhando perfeitamente com cada quinto do
          vídeo. */}
      <div style={{ gridColumn: "4", gridRow: "3 / span 5" }} className="flex min-h-0 flex-col gap-3">
        {SIDE_ICONS.map((app) => (
          <div key={app.label} className="flex min-h-0 flex-1 items-center justify-center">
            <AppIcon app={app} onOpenWindow={onOpenWindow} onOpenLaunchpad={onOpenLaunchpad} />
          </div>
        ))}
      </div>

      <div style={{ gridColumn: "1 / span 4", gridRow: "8" }} className="flex min-h-0 items-center justify-between">
        {BOTTOM_ICONS.map((app) => (
          <AppIcon key={app.label} app={app} onOpenWindow={onOpenWindow} onOpenLaunchpad={onOpenLaunchpad} />
        ))}
      </div>
    </div>
  );
}
