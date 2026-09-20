import type { CSSProperties } from "react";
import type { Block } from "@/lib/types";
import { designBgStyle, designColorVars, resolveDesign } from "@/lib/design";
import type { ExtractBlock } from "@/components/blocks/types";

function Cta({
  label,
  url,
  variant,
}: {
  label: string;
  url: string;
  variant: "primary" | "ghost";
}) {
  if (!label || !url) return null;
  if (variant === "primary") {
    return (
      <a
        href={url}
        style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
        className="inline-flex items-center rounded-full px-7 py-3.5 text-sm font-semibold shadow-[0_10px_40px_-10px_var(--brand-glow)] transition-transform hover:scale-[1.03]"
      >
        {label}
      </a>
    );
  }
  return (
    <a
      href={url}
      className="inline-flex items-center rounded-full border border-[var(--line-strong)] bg-[var(--card)] px-7 py-3.5 text-sm font-semibold text-[var(--fg)] backdrop-blur transition-colors hover:border-[var(--fg-half)] hover:bg-[var(--card-strong)]"
    >
      {label}
    </a>
  );
}

export function HeroBlock({ block }: { block: ExtractBlock<Block, "hero"> }) {
  const d = resolveDesign(block);
  const bg = designBgStyle(d);
  const style: CSSProperties = { ...bg, ...designColorVars(d) };

  return (
    <section
      className="relative flex min-h-[100svh] items-end overflow-hidden"
      style={style}
    >
      {block.image ? (
        <img
          src={block.image}
          alt={block.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 70% 20%, var(--brand-soft), transparent 70%)",
          }}
        />
      )}
      {block.image ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      ) : null}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-44 sm:px-8 md:pb-24">
        <h1 className="max-w-4xl text-5xl font-bold uppercase leading-[0.95] tracking-tight text-[var(--fg)] sm:text-7xl md:text-8xl">
          {block.title}
        </h1>
        {block.subtitle ? (
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--fg-soft)] sm:text-lg">
            {block.subtitle}
          </p>
        ) : null}
        <div className="mt-9 flex flex-wrap gap-3">
          <Cta label={block.primaryLabel} url={block.primaryUrl} variant="primary" />
          <Cta
            label={block.secondaryLabel}
            url={block.secondaryUrl}
            variant="ghost"
          />
        </div>
      </div>
    </section>
  );
}
