// Chaves das "janelas" que o desktop pode abrir. Compartilhado entre o dock,
// a topbar e o launchpad pra manter tudo em sincronia.
export type WindowKey = "sobre" | "projetos" | "contato" | "galeria" | "instagram" | "pacotes";

// Número de WhatsApp da agência, já em formato E.164 sem símbolos —
// reaproveitado em vários lugares (dock, launchpad, mobile, contato, menu).
export const WHATSAPP_NUMBER = "5585987166705";
export const WHATSAPP_URL = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// Sistema de gestão/agenda da própria agência — o ícone "Calendário" abre
// direto esse sistema (não uma janela interna do site).
export const CRONOGRAMA_URL = "https://cronograma.olhaotake.com.br";

export interface WindowOrigin {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rectToOrigin(rect: DOMRect): WindowOrigin {
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}

// Assinatura comum que todo conteúdo de janela recebe pra poder abrir outra
// janela por cima da atual (ex.: o link de Instagram dentro da janela de
// Contato). A maioria dos conteúdos simplesmente ignora essa prop.
export type OpenWindowFn = (key: WindowKey, origin: WindowOrigin) => void;
