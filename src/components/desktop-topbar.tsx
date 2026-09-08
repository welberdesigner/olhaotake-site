import logo from "@/assets/logo.png";
import { rectToOrigin, type WindowKey, type WindowOrigin } from "@/lib/windows";

const NAV_ITEMS: Array<{ label: string; window: WindowKey }> = [
  { label: "Sobre", window: "sobre" },
  { label: "Galeria", window: "galeria" },
  { label: "Contatos", window: "contato" },
];

export function DesktopTopbar({
  onOpenWindow,
}: {
  onOpenWindow: (key: WindowKey, origin: WindowOrigin) => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center gap-12 px-8 py-6 sm:px-14">
      {/* Degradê pra garantir contraste do texto branco em qualquer trecho do wallpaper */}
      <div className="pointer-events-none absolute inset-0 -z-10 h-40 bg-gradient-to-b from-black/35 to-transparent" />

      <img src={logo} alt="Olha o Take" className="h-6 w-auto sm:h-7" />

      <nav className="flex items-center gap-8 sm:gap-10">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.window}
            type="button"
            onClick={(e) => onOpenWindow(item.window, rectToOrigin(e.currentTarget.getBoundingClientRect()))}
            className="text-sm font-medium text-white/90 transition-colors hover:text-white sm:text-base"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
