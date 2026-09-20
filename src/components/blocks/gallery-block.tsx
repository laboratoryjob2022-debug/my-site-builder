import type { Block } from "@/lib/types";
import { Section } from "./section";
import { resolveDesign } from "@/lib/design";
import type { ExtractBlock } from "./types";

export function GalleryBlock({
  block,
}: {
  block: ExtractBlock<Block, "gallery">;
}) {
  if (block.images.length === 0) {
    return (
      <Section heading={block.heading} design={resolveDesign(block)}>
        <p className="rounded-2xl border border-dashed border-[var(--line-strong)] px-6 py-10 text-center text-sm text-[var(--fg-faint)]">
          Фотографии пока не добавлены.
        </p>
      </Section>
    );
  }
  return (
    <Section heading={block.heading} design={resolveDesign(block)}>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {block.images.map((src, i) => (
          <div
            key={i}
            className="group aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)]"
          >
            <img
              src={src}
              alt={`Фото ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
