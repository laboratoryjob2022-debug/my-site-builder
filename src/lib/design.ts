import type { CSSProperties } from "react";
import { fgVars } from "./brand";
import type { Block, BlockDesign } from "./types";

export const DEFAULT_DESIGN: BlockDesign = {
  bg: "none",
  bgColor: "#14141b",
  bgFrom: "#1c1c28",
  bgTo: "#0b0b10",
  bgAngle: "down",
  bgImage: "",
  overlay: 55,
  width: "normal",
  padding: "md",
  textColor: "",
};

export function resolveDesign(block: Block): BlockDesign {
  return { ...DEFAULT_DESIGN, ...block.design };
}

const WIDTH: Record<BlockDesign["width"], string> = {
  narrow: "max-w-3xl",
  normal: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-none",
};

const PAD: Record<BlockDesign["padding"], string> = {
  none: "py-0",
  sm: "py-8 md:py-10",
  md: "py-16 md:py-24",
  lg: "py-24 md:py-32",
  xl: "py-32 md:py-44",
};

const ANGLE: Record<BlockDesign["bgAngle"], string> = {
  down: "180deg",
  right: "90deg",
  diag: "135deg",
};

export function designClasses(d: BlockDesign): { width: string; pad: string } {
  return { width: WIDTH[d.width], pad: PAD[d.padding] };
}

export function designBgStyle(d: BlockDesign): CSSProperties | null {
  if (d.bg === "solid") return { backgroundColor: d.bgColor };
  if (d.bg === "gradient")
    return {
      backgroundImage: `linear-gradient(${ANGLE[d.bgAngle]}, ${d.bgFrom}, ${d.bgTo})`,
    };
  return null;
}

export function designColorVars(d: BlockDesign): CSSProperties {
  return d.textColor ? fgVars(d.textColor) : {};
}
