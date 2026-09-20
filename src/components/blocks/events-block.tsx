import type { Block } from "@/lib/types";
import { CalendarDays } from "lucide-react";
import { Section } from "./section";
import { resolveDesign } from "@/lib/design";
import type { ExtractBlock } from "./types";

export function EventsBlock({ block }: { block: ExtractBlock<Block, "events"> }) {
  if (block.items.length === 0) {
    return (
      <Section heading={block.heading} design={resolveDesign(block)}>
        <p className="rounded-2xl border border-dashed border-[var(--line-strong)] px-6 py-10 text-center text-sm text-[var(--fg-faint)]">
          Афиша пока пуста.
        </p>
      </Section>
    );
  }
  return (
    <Section heading={block.heading} design={resolveDesign(block)}>
      <div className="divide-y divide-[var(--line)] overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)]">
        {block.items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
          >
            <div className="flex w-28 shrink-0 items-center gap-2 text-[var(--brand)]">
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm font-semibold">{item.date}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-[var(--fg)] sm:text-lg">
                {item.city}
              </p>
              {item.venue ? (
                <p className="mt-0.5 text-sm text-[var(--fg-mute)]">{item.venue}</p>
              ) : null}
            </div>
            <div className="shrink-0">
              {item.soldOut ? (
                <span className="inline-block rounded-full bg-[var(--card-strong)] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--fg-mute)]">
                  Продано
                </span>
              ) : item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "var(--brand)",
                    color: "var(--brand-contrast)",
                  }}
                  className="inline-block rounded-full px-5 py-2.5 text-xs font-semibold transition-transform hover:scale-105"
                >
                  Билеты
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
