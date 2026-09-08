import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const SESSION_KEY = "olt-booted";
const VISIBLE_MS = 1300;
const FADE_MS = 350;

/**
 * Reaproveita o mesmo tratamento visual da tela de carregamento do sistema
 * de gestão (cronograma): halo pulsando atrás da logo. Aqui não há dado
 * nenhum sendo carregado — é só a "cara de sistema iniciando" na primeira
 * visita da sessão (sessionStorage evita repetir a cada refresh).
 */
export function BootScreen() {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const fadeTimer = setTimeout(() => setFadeOut(true), VISIBLE_MS);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* sessionStorage indisponível (modo privado etc.) — sem problema, só repete o boot */
      }
    }, VISIBLE_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-[350ms]",
        fadeOut && "opacity-0",
      )}
    >
      <div className="relative h-16 w-64 sm:h-20 sm:w-80">
        <div
          aria-hidden="true"
          className="boot-halo absolute inset-0 m-auto h-[70%] w-[90%] rounded-full blur-2xl"
          style={{ background: "linear-gradient(135deg, var(--brand-cyan), var(--brand-violet) 50%, var(--brand-fuchsia))" }}
        />
        <img src={logo} alt="Olha o Take" className="boot-logo relative h-full w-full object-contain" />
      </div>
    </div>
  );
}
