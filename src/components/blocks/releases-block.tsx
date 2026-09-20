import type { Block } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { Section } from "./section";
import { resolveDesign } from "@/lib/design";
import type { ExtractBlock } from "./types";

export function ReleasesBlock({
  block,
}: {
  block: ExtractBlock<Block, "releases">;
}) {
  if (block.items.length === 0) {
    return (
      <Section heading={block.heading} design={resolveDesign(block)}>
        <p className="rounded-2xl border border-dashed border-[var(--line-strong)] px-6 py-10 text-center text-sm text-[var(--fg-faint)]">
          Релизы пока не добавлены.
        </p>
      </Section>
    );
  }
  return (
    <Section heading={block.heading} design={resolveDesign(block)}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {block.items.map((item, i) => (
          <div
            key={i}
            className="group overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] transition-colors hover:border-[var(--line-strong)]"
          >
            {item.cover ? (
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-square bg-[var(--card)]" />
            )}
            <div className="p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="truncate text-lg font-semibold text-[var(--fg)]">
                  {item.title || "Без названия"}
                </h3>
                {item.year ? (
                  <span className="shrink-0 text-xs tabular-nums text-[var(--fg-faint)]">
                    {item.year}
                  </span>
                ) : null}
              </div>
              {item.links.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.links.map((l, j) => (
                    <a
                      key={j}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-medium text-[var(--fg-soft)] transition-colors hover:border-[var(--brand)] hover:text-[var(--fg)]"
                    >
                      {l.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
