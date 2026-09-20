import type { Block } from "@/lib/types";
import { Code2 } from "lucide-react";
import { Section } from "./section";
import { resolveDesign } from "@/lib/design";
import type { ExtractBlock } from "./types";

export function CodeBlock({ block }: { block: ExtractBlock<Block, "code"> }) {
  if (!block.code.trim()) {
    return (
      <Section heading={block.heading} design={resolveDesign(block)}>
        <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--line-strong)] px-6 py-10 text-center text-sm text-[var(--fg-faint)]">
          <Code2 className="h-4 w-4" />
          HTML-код пока не добавлен.
        </p>
      </Section>
    );
  }
  return (
    <Section heading={block.heading} design={resolveDesign(block)}>
      {/* Контент вводит владелец сайта в режиме редактирования */}
      <div dangerouslySetInnerHTML={{ __html: block.code }} />
    </Section>
  );
}
