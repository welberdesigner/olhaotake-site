import { Check } from "lucide-react";
import { WHATSAPP_URL, type OpenWindowFn } from "@/lib/windows";

// Copy provisória — ajustar com o cliente. Propositalmente sem valores: a
// ideia é mostrar escopo/entregáveis de cada pacote e levar pra uma
// conversa (WhatsApp) em vez de negociar preço direto na tela.
const PACOTES = [
  {
    nome: "Essencial",
    resumo: "Pra quem quer presença consistente sem pensar no dia a dia.",
    itens: ["Calendário editorial mensal", "Artes e stories no padrão da marca", "Publicação e agendamento"],
  },
  {
    nome: "Completo",
    resumo: "Gestão + produção de conteúdo próprio, mês a mês.",
    itens: [
      "Tudo do Essencial",
      "Gravação e edição de reels",
      "Cobertura de eventos/rotina",
      "Relatório mensal de resultados",
    ],
    destaque: true,
  },
  {
    nome: "Audiovisual",
    resumo: "Produção sob demanda — para campanhas e projetos pontuais.",
    itens: ["Roteiro e direção", "Filmagem e edição profissional", "Entrega em formatos pra todas as redes"],
  },
];

export function PackagesWindow(_props: { onOpenWindow: OpenWindowFn }) {
  return (
    <div className="space-y-5 p-6 sm:p-8">
      <p className="text-sm text-muted-foreground">
        Cada marca tem uma necessidade diferente — veja o que entra em cada pacote e vamos conversar
        pra montar o que faz sentido pra você.
      </p>

      <div className="space-y-3">
        {PACOTES.map((p) => (
          <div
            key={p.nome}
            className={
              p.destaque
                ? "rounded-xl border-2 border-primary bg-primary-soft p-4"
                : "rounded-xl border border-border/60 bg-secondary/40 p-4"
            }
          >
            <p className="text-sm font-semibold">{p.nome}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{p.resumo}</p>
            <ul className="mt-3 space-y-1.5">
              {p.itens.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <a
        href={WHATSAPP_URL("Olá! Vi os pacotes no site e quero saber qual encaixa melhor pra mim.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-105"
      >
        Conversar no WhatsApp
      </a>
    </div>
  );
}
