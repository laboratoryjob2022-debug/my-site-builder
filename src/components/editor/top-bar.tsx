"use client";

import { Check, CloudOff, Download, Github, Loader2, Pencil, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SaveState = "idle" | "saving" | "saved" | "error";

export function EditorTopBar({
  saveState,
  onOpenSettings,
  onExport,
  onPublish,
  onExit,
}: {
  saveState: SaveState;
  onOpenSettings: () => void;
  onExport: () => void;
  onPublish: () => void;
  onExit: () => void;
}) {
  return (
    <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-[#0b0b10]/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: "var(--brand-soft)", color: "var(--brand)" }}
        >
          <Pencil className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Редактирование</p>
          <SaveIndicator state={saveState} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPublish}
          title="Отправить сайт в ваш репозиторий на GitHub — Pages опубликует его сам"
          className="border-white/15 bg-white/[0.06] text-white hover:bg-white/12 hover:text-white"
        >
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">Опубликовать</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onExport}
          title="Скачать готовый сайт архивом — можно залить на любой хостинг"
          className="border-white/15 bg-white/[0.06] text-white hover:bg-white/12 hover:text-white"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Экспорт</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenSettings}
          className="border-white/15 bg-white/[0.06] text-white hover:bg-white/12 hover:text-white"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Настройки</span>
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onExit}
          style={{
            backgroundColor: "var(--brand)",
            color: "var(--brand-contrast)",
          }}
        >
          Готово
        </Button>
      </div>
    </div>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "saving") {
    return (
      <p className="flex items-center gap-1 text-xs text-white/50">
        <Loader2 className="h-3 w-3 animate-spin" /> Сохранение…
      </p>
    );
  }
  if (state === "error") {
    return (
      <p className="flex items-center gap-1 text-xs text-red-400">
        <CloudOff className="h-3 w-3" /> Не сохранено
      </p>
    );
  }
  if (state === "saved") {
    return (
      <p className="flex items-center gap-1 text-xs text-emerald-400">
        <Check className="h-3 w-3" /> Сохранено
      </p>
    );
  }
  return <p className="text-xs text-white/30">Изменений пока нет</p>;
}
