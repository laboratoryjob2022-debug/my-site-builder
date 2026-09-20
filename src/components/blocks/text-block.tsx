import type { Block } from "@/lib/types";
import { Section } from "./section";
import { resolveDesign } from "@/lib/design";
import type { ExtractBlock } from "./types";

export function TextBlock({ block }: { block: ExtractBlock<Block, "text"> }) {
  const paragraphs = block.body.split(/\n{2,}/).filter(Boolean);
  const centered = block.align === "center";
  return (
    <Section heading={block.heading} design={resolveDesign(block)}>
      <div
        className={
          centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
        }
      >
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="mb-5 text-base leading-relaxed text-[var(--fg-soft)] sm:text-lg"
          >
            {p}
          </p>
        ))}
      </div>
    </Section>
  );
}
