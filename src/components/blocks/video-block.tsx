import type { Block } from "@/lib/types";
import { Clapperboard } from "lucide-react";
import { Section } from "./section";
import { resolveDesign } from "@/lib/design";
import type { ExtractBlock } from "./types";

function toEmbedUrl(url: string): string | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  const rutube = url.match(/rutube\.ru\/video\/([\w]+)/);
  if (rutube) return `https://rutube.ru/play/embed/${rutube[1]}`;
  const vk = url.match(/vk\.com\/video(-?\d+)_(\d+)/);
  if (vk)
    return `https://vk.com/video_ext.php?oid=${vk[1]}&id=${vk[2]}&hd=2`;
  return null;
}

export function VideoBlock({ block }: { block: ExtractBlock<Block, "video"> }) {
  const url = block.url.trim();
  const embed = url ? toEmbedUrl(url) : null;
  const isFile = /\.(mp4|webm|ogv|ogg|mov)(\?.*)?$/i.test(url);

  return (
    <Section heading={block.heading} design={resolveDesign(block)}>
      <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-black">
        <div className="aspect-video w-full">
          {!url ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-[var(--fg-faint)]">
              <Clapperboard className="h-8 w-8" />
              <p className="px-6 text-center text-sm">
                Видео пока не добавлено — вставьте ссылку (YouTube, VK, RuTube)
                или загрузите файл в редакторе.
              </p>
            </div>
          ) : isFile ? (
            <video
              src={url}
              controls
              playsInline
              className="h-full w-full"
            />
          ) : (
            <iframe
              src={embed ?? url}
              title="Видео"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              className="h-full w-full"
            />
          )}
        </div>
      </div>
      {block.caption ? (
        <p className="mt-4 text-sm text-[var(--fg-mute)]">{block.caption}</p>
      ) : null}
    </Section>
  );
}
