import { motion } from "framer-motion";
import { useEffect } from "react";
import iconCalendario from "@/assets/icons/calendario.png";
import iconEmail from "@/assets/icons/email.png";
import iconGaleria from "@/assets/icons/galeria.png";
import iconInstagram from "@/assets/icons/instagram.png";
import iconPlanos from "@/assets/icons/planos.png";
import iconProjetos from "@/assets/icons/projetos.png";
import iconSobre from "@/assets/icons/sobre.png";
import iconWhatsapp from "@/assets/icons/whatsapp.png";
import { rectToOrigin, WHATSAPP_URL, type WindowKey } from "@/lib/windows";

// Mesmo agrupamento por função do dock (ver desktop-dock.tsx). "Sobre" só
// existe aqui e no menu do topo (não tem ícone próprio no dock).
const LAUNCHPAD_APPS: Array<{ label: string; icon: string } & ({ window: WindowKey } | { href: string })> = [
  { label: "Sobre", icon: iconSobre, window: "sobre" },
  { label: "Projetos", icon: iconProjetos, window: "projetos" },
  { label: "Galeria", icon: iconGaleria, window: "galeria" },
  { label: "Pacotes", icon: iconPlanos, window: "pacotes" },
  { label: "Calendário", icon: iconCalendario, window: "calendario" },
  { label: "Contato", icon: iconEmail, window: "contato" },
  { label: "WhatsApp", icon: iconWhatsapp, href: WHATSAPP_URL("Olá! Vim pelo site da Olha o Take e quero saber mais.") },
  { label: "Instagram", icon: iconInstagram, window: "instagram" },
];

export function LaunchpadOverlay({
  onClose,
  onOpenWindow,
}: {
  onClose: () => void;
  onOpenWindow: (key: WindowKey, origin: ReturnType<typeof rectToOrigin>) => void;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-8 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-10"
      >
        {LAUNCHPAD_APPS.map((app) => (
          <button
            key={app.label}
            type="button"
            onClick={(e) => {
              if ("href" in app) {
                window.open(app.href, "_blank", "noopener,noreferrer");
                onClose();
                return;
              }
              const rect = e.currentTarget.getBoundingClientRect();
              onOpenWindow(app.window, rectToOrigin(rect));
            }}
            className="flex flex-col items-center gap-2 transition-transform duration-150 hover:scale-110"
          >
            <img src={app.icon} alt="" className="h-16 w-16 drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] sm:h-20 sm:w-20" />
            <span className="text-xs font-medium text-white/90 sm:text-sm">{app.label}</span>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}
