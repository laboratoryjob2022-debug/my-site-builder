"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

export function BlockToolbar({
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 2500);
    return () => clearTimeout(t);
  }, [confirming]);

  const btn =
    "flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/15 hover:text-white";

  return (
    <div className="absolute right-3 top-3 z-30 flex items-center gap-0.5 rounded-xl border border-white/10 bg-black/85 p-1 shadow-xl backdrop-blur">
      <button type="button" className={btn} title="Выше" onClick={onMoveUp}>
        <ArrowUp className="h-4 w-4" />
      </button>
      <button type="button" className={btn} title="Ниже" onClick={onMoveDown}>
        <ArrowDown className="h-4 w-4" />
      </button>
      <button type="button" className={btn} title="Дублировать" onClick={onDuplicate}>
        <Copy className="h-4 w-4" />
      </button>
      <button type="button" className={btn} title="Редактировать" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={
          "flex h-8 items-center justify-center gap-1 rounded-lg px-2 text-xs font-medium transition-colors " +
          (confirming
            ? "bg-red-500 text-white"
            : "text-white/70 hover:bg-white/15 hover:text-white")
        }
        title="Удалить блок"
        onClick={() => {
          if (confirming) {
            onDelete();
          } else {
            setConfirming(true);
          }
        }}
      >
        {confirming ? (
          <>
            <Check className="h-3.5 w-3.5" /> Точно?
          </>
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
