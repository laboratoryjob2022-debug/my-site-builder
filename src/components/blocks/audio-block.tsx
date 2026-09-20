import type { Block } from "@/lib/types";
import { Music } from "lucide-react";
import { Section } from "./section";
import { AudioPlayer } from "./audio-player";
import { resolveDesign } from "@/lib/design";
import type { ExtractBlock } from "./types";

export function AudioBlock({ block }: { block: ExtractBlock<Block, "audio"> }) {
  return (
    <Section heading={block.heading} design={resolveDesign(block)}>
      <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)]">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
          {block.cover ? (
            <img
              src={block.cover}
              alt={block.title}
              className="h-40 w-40 shrink-0 rounded-2xl object-cover sm:h-48 sm:w-48"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-semibold text-[var(--fg)] sm:text-2xl">
              {block.title || "Название трека"}
            </h3>
            {block.artist ? (
              <p className="mt-1 text-sm text-[var(--fg-mute)]">{block.artist}</p>
            ) : null}
            <div className="mt-6">
              {block.src ? (
                <AudioPlayer src={block.src} />
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[var(--line-strong)] px-5 py-4 text-sm text-[var(--fg-faint)]">
                  <Music className="h-4 w-4 shrink-0" />
                  {block.description ||
                    "Аудиофайл пока не добавлен — загрузите его в редакторе."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
