import { Clapperboard, PencilRuler, Radar, Sparkles } from "lucide-react";
import type { OpenWindowFn } from "@/lib/windows";

// Copy provisória — ajustar com o cliente antes de publicar.
const PILARES = [
  {
    icon: Radar,
    title: "Estratégia",
    text: "Planejamento editorial pensado pro seu público e pros seus objetivos, não só pro algoritmo.",
  },
  {
    icon: Clapperboard,
    title: "Produção audiovisual",
    text: "Filmagem e edição de reels, vídeos e conteúdo — do roteiro ao take final.",
  },
  {
    icon: PencilRuler,
    title: "Identidade visual",
    text: "Artes, stories e templates com a cara da sua marca em cada publicação.",
  },
  {
    icon: Sparkles,
    title: "Gestão do dia a dia",
    text: "Calendário, aprovações e publicação — sua rede social rodando sem depender de você lembrar.",
  },
];

export function AboutWindow(_props: { onOpenWindow: OpenWindowFn }) {
  return (
    <div className="space-y-6 p-6 sm:p-8">
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">
          <span className="text-gradient">Olha o Take</span>
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Agência de gestão de redes sociais e produção audiovisual. Cuidamos do que a sua marca
          grava, edita e publica — do planejamento estratégico ao take final.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PILARES.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex gap-3 rounded-xl border border-border/60 bg-secondary/40 p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
