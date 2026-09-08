import { CalendarClock } from "lucide-react";
import type { OpenWindowFn } from "@/lib/windows";

// TODO: confirmar com o cliente o e-mail/WhatsApp de agendamento definitivo.
const CONTATO_EMAIL = "olhaotake2024@gmail.com";

export function CalendarWindow(_props: { onOpenWindow: OpenWindowFn }) {
  return (
    <div className="flex flex-col items-center gap-4 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
        <CalendarClock className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Vamos marcar uma conversa?</h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          Conta pra gente sobre a sua marca e a gente encontra o melhor horário pra apresentar uma
          proposta.
        </p>
      </div>

      <a
        href={`mailto:${CONTATO_EMAIL}?subject=${encodeURIComponent("Quero agendar uma conversa")}`}
        className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-105"
      >
        Agendar por e-mail
      </a>
    </div>
  );
}
