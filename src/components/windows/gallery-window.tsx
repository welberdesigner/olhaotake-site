import { Image as ImageIcon, Play } from "lucide-react";
import type { OpenWindowFn } from "@/lib/windows";

// Placeholders — substituir por thumbnails reais de fotos/vídeos.
const ITENS = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  tipo: i % 3 === 0 ? "video" : "foto",
}));

export function GalleryWindow(_props: { onOpenWindow: OpenWindowFn }) {
  return (
    <div className="p-6 sm:p-8">
      <p className="mb-5 text-sm text-muted-foreground">
        Prévia de fotos e vídeos produzidos — galeria completa em breve.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {ITENS.map((item) => (
          <div
            key={item.id}
            className="flex aspect-square items-center justify-center rounded-lg bg-gradient-soft text-muted-foreground"
          >
            {item.tipo === "video" ? (
              <Play className="h-5 w-5 opacity-50" />
            ) : (
              <ImageIcon className="h-5 w-5 opacity-50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
