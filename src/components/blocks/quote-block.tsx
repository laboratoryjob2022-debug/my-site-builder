import type { Block } from "@/lib/types";
import { Section } from "./section";
import { resolveDesign } from "@/lib/design";
import type { ExtractBlock } from "./types";

export function QuoteBlock({ block }: { block: ExtractBlock<Block, "quote"> }) {
  return (
    <Section design={resolveDesign(block)} className="text-center">
      <div
        aria-hidden
        className="select-none text-7xl font-bold leading-none text-[var(--brand)]"
      >
        &ldquo;
      </div>
      <blockquote className="mt-2 text-xl font-medium italic leading-relaxed text-[var(--fg-soft)] sm:text-2xl md:text-3xl">
        {block.text}
      </blockquote>
      {(block.author || block.source) && (
        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[var(--fg-mute)]">
          {block.author}
          {block.author && block.source ? " · " : ""}
          {block.source}
        </p>
      )}
    </Section>
  );
}
