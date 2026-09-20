"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_DESIGN,
  designBgStyle,
  designClasses,
  designColorVars,
} from "@/lib/design";
import type { BlockDesign } from "@/lib/types";

export function Section({
  heading,
  design,
  className,
  children,
}: {
  heading?: string;
  design?: BlockDesign;
  className?: string;
  children: React.ReactNode;
}) {
  const d = design ?? DEFAULT_DESIGN;
  const bg = designBgStyle(d);
  const { width, pad } = designClasses(d);
  const style: CSSProperties = { ...bg, ...designColorVars(d) };

  return (
    <section className={cn("relative w-full overflow-hidden", className)} style={style}>
      {d.bg === "image" && d.bgImage ? (
        <>
          <img
            src={d.bgImage}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0, 0, 0, ${d.overlay / 100})` }}
          />
        </>
      ) : null}
      <div
        className={cn(
          "relative mx-auto w-full px-5 sm:px-8",
          width,
          pad,
          d.width === "full" && "px-0 sm:px-0",
        )}
      >
        {heading ? (
          <div className={cn("mb-10 md:mb-14", d.width === "full" && "px-5 sm:px-8")}>
            <span className="mb-4 block h-1 w-10 rounded-full bg-[var(--brand)]" />
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--fg)] sm:text-3xl md:text-4xl">
              {heading}
            </h2>
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
