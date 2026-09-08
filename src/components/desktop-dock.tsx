import { motion, Reorder, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import dockGlow from "@/assets/dock-glow.png";
import iconApps from "@/assets/icons/apps.png";
import iconCalendario from "@/assets/icons/calendario.png";
import iconEmail from "@/assets/icons/email.png";
import iconGaleria from "@/assets/icons/galeria.png";
import iconInstagram from "@/assets/icons/instagram.png";
import iconPlanos from "@/assets/icons/planos.png";
import iconProjetos from "@/assets/icons/projetos.png";
import iconWhatsapp from "@/assets/icons/whatsapp.png";
import { CRONOGRAMA_URL, rectToOrigin, WHATSAPP_URL, type WindowKey, type WindowOrigin } from "@/lib/windows";

const BASE_SIZE = 68;
const MAX_SIZE = 112;
// Raio (em px) de influência do cursor sobre os ícones vizinhos — quanto
// maior, mais ícones "abrem espaço" ao redor do que está sob o mouse.
const MAGNIFY_RADIUS = 150;

type DockItem = { label: string; icon: string } & (
  | { kind: "launchpad" }
  | { kind: "window"; window: WindowKey }
  | { kind: "link"; href: string }
);

// Ordem agrupada por função (padrão comum de organização no iOS: apps
// parecidos ficam juntos) — conteúdo/portfólio primeiro, depois negócio,
// depois contato/comunicação, e o app social (que tira a pessoa do site)
// por último. É só a ordem INICIAL: dá pra arrastar e reordenar (ver
// DesktopDock abaixo), mas isso não é salvo — atualizar a página sempre
// volta pra essa ordem aqui.
const DOCK_ITEMS: DockItem[] = [
  { label: "Apps", icon: iconApps, kind: "launchpad" },
  { label: "Projetos", icon: iconProjetos, kind: "window", window: "projetos" },
  { label: "Galeria", icon: iconGaleria, kind: "window", window: "galeria" },
  { label: "Pacotes", icon: iconPlanos, kind: "window", window: "pacotes" },
  { label: "Calendário", icon: iconCalendario, kind: "link", href: CRONOGRAMA_URL },
  { label: "Email", icon: iconEmail, kind: "window", window: "contato" },
  {
    label: "WhatsApp",
    icon: iconWhatsapp,
    kind: "link",
    href: WHATSAPP_URL("Olá! Vim pelo site da Olha o Take e quero saber mais."),
  },
  { label: "Instagram", icon: iconInstagram, kind: "window", window: "instagram" },
];

function DockIcon({
  mouseX,
  item,
  onOpenLaunchpad,
  onOpenWindow,
}: {
  mouseX: MotionValue<number>;
  item: DockItem;
  onOpenLaunchpad: () => void;
  onOpenWindow: (key: WindowKey, origin: WindowOrigin) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const distance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return value - (bounds.x + bounds.width / 2);
  });

  const sizeTarget = useTransform(
    distance,
    [-MAGNIFY_RADIUS, 0, MAGNIFY_RADIUS],
    [BASE_SIZE, MAX_SIZE, BASE_SIZE],
  );
  // Mola "devagar": stiffness/damping baixos deixam o crescimento suave em
  // vez de um salto instantâneo pro tamanho final, imitando o dock do macOS.
  const size = useSpring(sizeTarget, { mass: 0.2, stiffness: 90, damping: 16 });

  const isExternalLink = item.kind === "link";

  return (
    <motion.a
      ref={ref}
      href={isExternalLink ? item.href : "#"}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
      draggable={false}
      aria-label={item.label}
      onClick={(e) => {
        if (item.kind === "launchpad") {
          e.preventDefault();
          onOpenLaunchpad();
        } else if (item.kind === "window") {
          e.preventDefault();
          onOpenWindow(item.window, rectToOrigin(e.currentTarget.getBoundingClientRect()));
        }
      }}
      style={{ width: size, height: size }}
      className="group relative flex items-end justify-center"
    >
      <img
        src={item.icon}
        alt={item.label}
        draggable={false}
        className="h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
      />
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {item.label}
      </span>
    </motion.a>
  );
}

export function DesktopDock({
  onOpenLaunchpad,
  onOpenWindow,
}: {
  onOpenLaunchpad: () => void;
  onOpenWindow: (key: WindowKey, origin: WindowOrigin) => void;
}) {
  const mouseX = useMotionValue(Infinity);
  // Estado só local (em memória) — arrastar pra reordenar não é salvo em
  // lugar nenhum, então atualizar a página sempre volta pra ordem padrão
  // de DOCK_ITEMS.
  const [items, setItems] = useState(DOCK_ITEMS);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col items-center">
      <img
        src={dockGlow}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-auto w-full"
      />

      <Reorder.Group
        as="div"
        axis="x"
        values={items}
        onReorder={setItems}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-2 pb-2 sm:pb-3"
      >
        {items.map((item) => (
          <Reorder.Item
            key={item.label}
            value={item}
            as="div"
            className="cursor-grab active:cursor-grabbing"
          >
            <DockIcon
              mouseX={mouseX}
              item={item}
              onOpenLaunchpad={onOpenLaunchpad}
              onOpenWindow={onOpenWindow}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
