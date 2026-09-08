import { Instagram, Mail } from "lucide-react";
import iconWhatsapp from "@/assets/icons/whatsapp.png";
import { rectToOrigin, WHATSAPP_URL, type OpenWindowFn } from "@/lib/windows";

const CONTATO_EMAIL = "contato@olhaotake.com.br";

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
          href={WHATSAPP_URL("Olá! Vim pelo site da Olha o Take e quero saber mais.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/40 p-3.5 transition-colors hover:bg-secondary/70"
        >
          <img src={iconWhatsapp} alt="" className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium">WhatsApp</p>
            <p className="truncate text-xs text-muted-foreground">Resposta mais rápida</p>
          </div>
        </a>

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
