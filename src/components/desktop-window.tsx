import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { WindowOrigin } from "@/lib/windows";

export function AppWindow({
  title,
  icon,
  origin,
  onClose,
  children,
  className,
}: {
  title: string;
  icon?: string;
  origin: WindowOrigin | null;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Anima a janela "crescendo" a partir do ícone/link que a abriu, tipo o
  // efeito genie do macOS (versão simplificada: escala + posição, sem
  // deformar o caminho).
  const dx = origin ? origin.x + origin.width / 2 - window.innerWidth / 2 : 0;
  const dy = origin ? origin.y + origin.height / 2 - window.innerHeight / 2 : 0;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.15, x: dx, y: dy }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.15, x: dx, y: dy }}
        transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.6 }}
        className={cn(
          "relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/95 text-card-foreground shadow-float backdrop-blur-xl outline-none",
          className,
        )}
      >
        <div className="flex items-center gap-4 border-b border-border/60 bg-secondary/60 px-4 py-3">
          <div className="group flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[8px] leading-none text-destructive-foreground/0 group-hover:text-destructive-foreground/70"
            >
              ×
            </button>
            <span className="h-3.5 w-3.5 rounded-full bg-warning" />
            <span className="h-3.5 w-3.5 rounded-full bg-success" />
          </div>

          <div className="flex flex-1 items-center justify-center gap-2 pr-14">
            {icon && <img src={icon} alt="" className="h-4 w-4" />}
            <span className="text-sm font-medium">{title}</span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
}
