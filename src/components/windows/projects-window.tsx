import { Play } from "lucide-react";
import type { OpenWindowFn } from "@/lib/windows";

// Placeholders — trocar pelos cases reais (thumbnail, cliente, categoria)
// assim que estiverem definidos.
const PROJETOS = [
  { cliente: "Cliente A", categoria: "Reels", gradient: "from-[var(--brand-cyan)] to-[var(--brand-violet)]" },
  { cliente: "Cliente B", categoria: "Gestão mensal", gradient: "from-[var(--brand-violet)] to-[var(--brand-fuchsia)]" },
  { cliente: "Cliente C", categoria: "Campanha", gradient: "from-[var(--brand-fuchsia)] to-[var(--brand-cyan)]" },
  { cliente: "Cliente D", categoria: "Reels", gradient: "from-[var(--brand-cyan)] to-[var(--brand-fuchsia)]" },
  { cliente: "Cliente E", categoria: "Fotografia", gradient: "from-[var(--brand-violet)] to-[var(--brand-cyan)]" },
  { cliente: "Cliente F", categoria: "Gestão mensal", gradient: "from-[var(--brand-fuchsia)] to-[var(--brand-violet)]" },
];

export function ProjectsWindow(_props: { onOpenWindow: OpenWindowFn }) {
  return (
    <div className="p-6 sm:p-8">
      <p className="mb-5 text-sm text-muted-foreground">
        Uma amostra dos trabalhos em andamento — cases completos em breve.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {PROJETOS.map((p) => (
          <button
            key={p.cliente}
            type="button"
            className={`group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${p.gradient} text-left shadow-soft transition-transform hover:scale-[1.03]`}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                <Play className="h-4 w-4 fill-white text-white" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-xs font-semibold text-white">{p.cliente}</p>
              <p className="text-[11px] text-white/80">{p.categoria}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
