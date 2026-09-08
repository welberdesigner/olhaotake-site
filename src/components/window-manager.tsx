import { AnimatePresence } from "framer-motion";
import type { ComponentType } from "react";
import iconCalendario from "@/assets/icons/calendario.png";
import iconEmail from "@/assets/icons/email.png";
import iconGaleria from "@/assets/icons/galeria.png";
import iconInstagram from "@/assets/icons/instagram.png";
import iconPlanos from "@/assets/icons/planos.png";
import iconProjetos from "@/assets/icons/projetos.png";
import { AppWindow } from "@/components/desktop-window";
import { AboutWindow } from "@/components/windows/about-window";
import { CalendarWindow } from "@/components/windows/calendar-window";
import { ContactWindow } from "@/components/windows/contact-window";
import { GalleryWindow } from "@/components/windows/gallery-window";
import { InstagramWindow } from "@/components/windows/instagram-window";
import { PackagesWindow } from "@/components/windows/packages-window";
import { ProjectsWindow } from "@/components/windows/projects-window";
import type { OpenWindowFn, WindowKey, WindowOrigin } from "@/lib/windows";

const WINDOW_REGISTRY: Record<
  WindowKey,
  { title: string; icon?: string; className?: string; Content: ComponentType<{ onOpenWindow: OpenWindowFn }> }
> = {
  sobre: { title: "Sobre", Content: AboutWindow, className: "max-w-lg" },
  projetos: { title: "Projetos", icon: iconProjetos, Content: ProjectsWindow, className: "max-w-2xl" },
  calendario: { title: "Calendário", icon: iconCalendario, Content: CalendarWindow, className: "max-w-sm" },
  contato: { title: "Contato", icon: iconEmail, Content: ContactWindow, className: "max-w-sm" },
  galeria: { title: "Galeria", icon: iconGaleria, Content: GalleryWindow, className: "max-w-xl" },
  instagram: { title: "Instagram", icon: iconInstagram, Content: InstagramWindow, className: "max-w-md" },
  pacotes: { title: "Pacotes", icon: iconPlanos, Content: PackagesWindow, className: "max-w-lg" },
};

export function WindowManager({
  openWindow,
  origin,
  onClose,
  onOpenWindow,
}: {
  openWindow: WindowKey | null;
  origin: WindowOrigin | null;
  onClose: () => void;
  onOpenWindow: OpenWindowFn;
}) {
  return (
    <AnimatePresence>
      {openWindow &&
        (() => {
          const { title, icon, className, Content } = WINDOW_REGISTRY[openWindow];
          return (
            <AppWindow key={openWindow} title={title} icon={icon} origin={origin} onClose={onClose} className={className}>
              <Content onOpenWindow={onOpenWindow} />
            </AppWindow>
          );
        })()}
    </AnimatePresence>
  );
}
