import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Instagram, MessageCircle, Share2, User } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { WHATSAPP_URL, type OpenWindowFn } from "@/lib/windows";

interface MenuPosition {
  x: number;
  y: number;
}

const MENU_WIDTH = 224;
const MENU_HEIGHT = 200;

// Só abre quando o clique direito acontece em cima da própria superfície do
// desktop (data-desktop-surface) — dentro de uma janela ou do launchpad,
// por exemplo, o alvo do clique é outro elemento e o menu não aparece,
// deixando o menu nativo do navegador livre pra copiar texto etc.
export function DesktopContextMenu({ onOpenWindow }: { onOpenWindow: OpenWindowFn }) {
  const [menu, setMenu] = useState<MenuPosition | null>(null);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-desktop-surface]")) return;
      e.preventDefault();
      setCopied(false);
      const x = Math.min(e.clientX, window.innerWidth - MENU_WIDTH - 12);
      const y = Math.min(e.clientY, window.innerHeight - MENU_HEIGHT - 12);
      setMenu({ x: Math.max(12, x), y: Math.max(12, y) });
    }
    function handlePointerDown(e: MouseEvent) {
      if (menuRef.current?.contains(e.target as Node)) return;
      setMenu(null);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenu(null);
    }
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function handleShare() {
    const shareData = {
      title: "Olha o Take",
      text: "Gestão de redes sociais e produção audiovisual",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setMenu(null);
        return;
      }
    } catch {
      /* usuário cancelou o compartilhamento — não faz nada */
      return;
    }
    await handleCopyLink();
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setMenu(null), 900);
    } catch {
      /* clipboard indisponível — fecha o menu sem feedback */
      setMenu(null);
    }
  }

  if (!menu) return null;

  const items: Array<{ label: string; icon: ComponentType<{ className?: string }>; action: () => void }> = [
    {
      label: "Falar no WhatsApp",
      icon: MessageCircle,
      action: () => {
        window.open(WHATSAPP_URL("Olá! Vim pelo site da Olha o Take e quero saber mais."), "_blank", "noopener,noreferrer");
        setMenu(null);
      },
    },
    {
      label: "Ver Instagram",
      icon: Instagram,
      action: () => {
        onOpenWindow("instagram", { x: menu.x, y: menu.y, width: 0, height: 0 });
        setMenu(null);
      },
    },
    {
      label: "Sobre a Olha o Take",
      icon: User,
      action: () => {
        onOpenWindow("sobre", { x: menu.x, y: menu.y, width: 0, height: 0 });
        setMenu(null);
      },
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.12 }}
        style={{ left: menu.x, top: menu.y }}
        className="fixed z-50 w-56 overflow-hidden rounded-xl border border-border/60 bg-popover/95 p-1.5 text-popover-foreground shadow-float backdrop-blur-xl"
      >
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            {item.label}
          </button>
        ))}

        <div className="my-1 h-px bg-border/60" />

        <button
          type="button"
          onClick={handleShare}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
        >
          <Share2 className="h-4 w-4 text-muted-foreground" />
          Compartilhar
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
        >
          {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
          {copied ? "Link copiado!" : "Copiar link do site"}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
