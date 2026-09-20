"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BlockType } from "@/lib/types";
import { BLOCK_META } from "./block-meta";

export function BlockPalette({
  open,
  onPick,
  onClose,
}: {
  open: boolean;
  onPick: (type: BlockType) => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-white/10 bg-[#121218] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Добавить блок</DialogTitle>
          <DialogDescription className="text-white/50">
            Выберите, что добавить на страницу
          </DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
          {(Object.keys(BLOCK_META) as BlockType[]).map((type) => {
            const meta = BLOCK_META[type];
            const Icon = meta.icon;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onPick(type)}
                className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-colors hover:border-[var(--brand)] hover:bg-white/[0.07]"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "var(--brand-soft)",
                    color: "var(--brand)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {meta.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-white/50">
                    {meta.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
