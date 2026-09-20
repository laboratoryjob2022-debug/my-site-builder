import type { Block } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";
import { Section } from "./section";
import { resolveDesign } from "@/lib/design";
import type { ExtractBlock } from "./types";

export function LinksBlock({ block }: { block: ExtractBlock<Block, "links"> }) {
  return (
    <Section heading={block.heading} design={resolveDesign(block)}>
      <div className="mx-auto flex max-w-xl flex-col gap-3">
        {block.items.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] px-6 py-4 text-base font-medium text-[var(--fg)] transition-colors hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
          >
            {item.label}
            <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--fg-faint)] transition-colors group-hover:text-[var(--brand)]" />
          </a>
        ))}
      </div>
    </Section>
  );
}
