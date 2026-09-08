# Identidade visual do Olha o Take — pra levar pro site novo

Esses dois arquivos são o design system inteiro do sistema atual
(cronograma.olhaotake.com.br). Copiando eles pro projeto novo, qualquer
site/componente criado ali já nasce com a mesma cara.

## O que tem aqui

- **styles.css** → cores (formato oklch), degradê da marca (ciano → violeta
  → fúcsia), sombras, cantos arredondados, tema claro/escuro completo,
  fonte (Inter) e várias animações/microinterações já prontas (pulso,
  brilho, "cobrinha" neon, etc.).
- **components.json** → configuração do shadcn/ui (estilo "new-york",
  ícones Lucide). Faz componentes novos (botão, card, modal...) nascerem
  já no padrão visual certo.

## Como usar no projeto novo

1. Copie os dois arquivos pro projeto novo, nos mesmos caminhos:
   - `styles.css` → `src/styles.css`
   - `components.json` → raiz do projeto
2. Instale Tailwind (v4) e, se for usar shadcn/ui, rode a inicialização
   dele — como o `components.json` já existe, ele vai puxar o mesmo
   estilo automaticamente.
3. Na primeira mensagem pro Claude nesse projeto novo, diga algo como:
   > "Esse projeto deve seguir exatamente a identidade visual do
   > styles.css anexado — mesmas cores, mesmo degradê, mesma fonte
   > (Inter). Não inventar cores novas."
4. Se puder, anexe também 2–3 prints do sistema atual (painel, login,
   algum modal) — ajuda a calibrar espaçamento e "sensação" do layout,
   coisa que o CSS sozinho não mostra tão bem.

## Coisas pra saber sobre o styles.css

- Usa Tailwind v4 com config em CSS (`@theme inline`), não
  `tailwind.config.js`.
- Todas as cores são em **oklch** — se for pedir uma cor nova ao Claude,
  peça nesse mesmo formato pra ficar consistente.
- Tem duas seções de cor: `:root` (tema claro) e `.dark` (tema escuro) —
  os dois já existem e são usados juntos.
- Boa parte do arquivo (a partir de "Continents + clouds rotation...") são
  animações específicas de telas do sistema de gestão (ticker de notícias,
  planeta girando, etc.) — pra um site institucional, provavelmente só as
  primeiras ~130 linhas (cores, sombras, fonte) e a classe `.text-gradient`
  / `.bg-gradient-primary` já bastam. O resto pode ficar de fora ou servir
  só de referência.
