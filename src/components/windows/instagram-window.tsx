import { ExternalLink } from "lucide-react";
import type { OpenWindowFn } from "@/lib/windows";

const INSTAGRAM_URL = "https://www.instagram.com/olhaotake/";

export function InstagramWindow(_props: { onOpenWindow: OpenWindowFn }) {
  return (
    <div className="flex flex-col">
      {/* Embed oficial do perfil (instagram.com/<usuario>/embed) — pra
          aparecer, a conta precisa estar com "Website embeds" habilitado em
          Configurações > Compartilhamento e reutilização, no app do Instagram. */}
      <iframe
        src={`${INSTAGRAM_URL}embed`}
        title="Instagram @olhaotake"
        className="h-[520px] w-full border-0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 border-t border-border/60 bg-secondary/40 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Abrir no Instagram
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
