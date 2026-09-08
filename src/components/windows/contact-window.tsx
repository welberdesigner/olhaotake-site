import { Instagram, Mail } from "lucide-react";
import { rectToOrigin, type OpenWindowFn } from "@/lib/windows";

// TODO: confirmar com o cliente o e-mail definitivo de contato.
const CONTATO_EMAIL = "olhaotake2024@gmail.com";

export function ContactWindow({ onOpenWindow }: { onOpenWindow: OpenWindowFn }) {
  return (
    <div className="space-y-5 p-6 sm:p-8">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Fale com a gente</h2>
        <p className="text-sm text-muted-foreground">
          Escolha o canal que preferir — respondemos o mais rápido possível.
        </p>
      </div>

      <div className="space-y-3">
        <a
          href={`mailto:${CONTATO_EMAIL}`}
          className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/40 p-3.5 transition-colors hover:bg-secondary/70"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
            <Mail className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">E-mail</p>
            <p className="truncate text-xs text-muted-foreground">{CONTATO_EMAIL}</p>
          </div>
        </a>

        <button
          type="button"
          onClick={(e) => onOpenWindow("instagram", rectToOrigin(e.currentTarget.getBoundingClientRect()))}
          className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-secondary/40 p-3.5 text-left transition-colors hover:bg-secondary/70"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
            <Instagram className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">Instagram</p>
            <p className="truncate text-xs text-muted-foreground">Direct ou comentário — a gente vê</p>
          </div>
        </button>
      </div>
    </div>
  );
}
