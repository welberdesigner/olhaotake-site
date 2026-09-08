import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import iconInstagram from "@/assets/icons/instagram.png";
import { rectToOrigin, type OpenWindowFn } from "@/lib/windows";

const SESSION_KEY = "olt-ig-notification-shown";
const SHOW_AFTER_MS = 9000;
const AUTO_DISMISS_MS = 7000;

// Notificação simulada — não puxa o post mais recente de verdade (isso
// exigiria a API do Instagram com token, fora do escopo agora), só um
// teaser genérico convidando a abrir a janela do Instagram.
export function InstagramNotificationToast({ onOpenWindow }: { onOpenWindow: OpenWindowFn }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* ignora */
    }
    if (alreadyShown) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignora */
      }
    }, SHOW_AFTER_MS);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const dismissTimer = setTimeout(() => setVisible(false), AUTO_DISMISS_MS);
    return () => clearTimeout(dismissTimer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="fixed top-20 left-4 right-4 z-30 flex items-center gap-2 rounded-2xl border border-white/15 bg-black/70 p-3 shadow-float backdrop-blur-xl sm:left-6 sm:right-auto sm:top-24 sm:w-80"
        >
          <button
            type="button"
            onClick={(e) => {
              setVisible(false);
              onOpenWindow("instagram", rectToOrigin(e.currentTarget.getBoundingClientRect()));
            }}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <img src={iconInstagram} alt="" className="h-10 w-10 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white">Instagram · agora</p>
              <p className="truncate text-xs text-white/80">Novo post no feed — vem ver 📸</p>
            </div>
          </button>
          <button
            type="button"
            aria-label="Fechar notificação"
            onClick={() => setVisible(false)}
            className="shrink-0 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
