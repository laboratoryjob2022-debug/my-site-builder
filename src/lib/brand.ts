import type { CSSProperties } from "react";

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full || "a855f7", 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function readableTextColor(hex: string): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full || "a855f7", 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65 ? "#101014" : "#ffffff";
}

export function brandVars(accent: string): CSSProperties {
  return {
    "--brand": accent,
    "--brand-contrast": readableTextColor(accent),
    "--brand-soft": hexToRgba(accent, 0.16),
    "--brand-glow": hexToRgba(accent, 0.45),
  } as CSSProperties;
}

export function fgVars(fg: string): CSSProperties {
  return {
    "--fg": fg,
    "--fg-soft": hexToRgba(fg, 0.75),
    "--fg-mute": hexToRgba(fg, 0.55),
    "--fg-faint": hexToRgba(fg, 0.4),
    "--fg-ghost": hexToRgba(fg, 0.28),
    "--fg-half": hexToRgba(fg, 0.5),
    "--line": hexToRgba(fg, 0.13),
    "--line-strong": hexToRgba(fg, 0.26),
    "--card": hexToRgba(fg, 0.045),
    "--card-strong": hexToRgba(fg, 0.1),
  } as CSSProperties;
}

export type PageBgSettings = {
  bgMode: "solid" | "gradient";
  bgColor: string;
  bgFrom: string;
  bgTo: string;
  textColor: string;
  accent?: string;
};

export function pageVars(s: PageBgSettings): CSSProperties {
  const pageBg =
    s.bgMode === "gradient"
      ? `linear-gradient(160deg, ${s.bgFrom}, ${s.bgTo})`
      : s.bgColor;
  return {
    ...fgVars(s.textColor),
    ...brandVars(s.accent ?? "#a855f7"),
    "--page-bg": pageBg,
  } as CSSProperties;
}
