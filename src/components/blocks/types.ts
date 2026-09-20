import type { Block } from "@/lib/types";

export type ExtractBlock<T extends Block, K extends Block["type"]> = Extract<
  T,
  { type: K }
>;
