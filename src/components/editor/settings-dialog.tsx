"use client";

import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PageSettings } from "@/lib/types";
import { ColorField, Field, SegmentedField, TextAreaInput, TextInput } from "./fields";

const PRESETS = [
  "#a855f7",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
];

const THEMES: { name: string; colors: string[]; patch: Partial<PageSettings> }[] = [
  {
    name: "Полночь",
    colors: ["#0b0b10", "#a855f7"],
    patch: {
      accent: "#a855f7",
      bgMode: "solid",
      bgColor: "#0b0b10",
      bgFrom: "#1a1a24",
      bgTo: "#0b0b10",
      textColor: "#ffffff",
    },
  },
  {
    name: "Неон",
    colors: ["#05060a", "#06b6d4"],
    patch: {
      accent: "#06b6d4",
      bgMode: "gradient",
      bgColor: "#05060a",
      bgFrom: "#0a1a22",
      bgTo: "#05060a",
      textColor: "#e8f6ff",
    },
  },
  {
    name: "Закат",
    colors: ["#3b1024", "#f97316"],
    patch: {
      accent: "#f97316",
      bgMode: "gradient",
      bgColor: "#3b1024",
      bgFrom: "#3b1024",
      bgTo: "#0d0509",
      textColor: "#ffe9dc",
    },
  },
  {
    name: "Светлая",
    colors: ["#faf7f2", "#ec4899"],
    patch: {
      accent: "#ec4899",
      bgMode: "solid",
      bgColor: "#faf7f2",
      bgFrom: "#ffffff",
      bgTo: "#f0ebe2",
      textColor: "#1a1520",
    },
  },
  {
    name: "Пудра",
    colors: ["#f6e7e9", "#d4467a"],
    patch: {
      accent: "#d4467a",
      bgMode: "gradient",
      bgColor: "#f6e7e9",
      bgFrom: "#f6e7e9",
      bgTo: "#fdfbf8",
      textColor: "#402a33",
    },
  },
  {
    name: "Лес",
    colors: ["#0c1f18", "#10b981"],
    patch: {
      accent: "#10b981",
      bgMode: "gradient",
      bgColor: "#0c1f18",
      bgFrom: "#0c1f18",
      bgTo: "#050a08",
      textColor: "#e3f5ec",
    },
  },
];

export function SettingsDialog({
  open,
  settings,
  onChange,
  onClose,
}: {
  open: boolean;
  settings: PageSettings;
  onChange: (settings: PageSettings) => void;
  onClose: () => void;
}) {
  const patch = (p: Partial<PageSettings>) => onChange({ ...settings, ...p });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10 bg-[#121218] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Настройки страницы</DialogTitle>
          <DialogDescription className="text-white/50">
            Имя артистки, цвета, фон и данные для поиска
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          <Field label="Имя артистки">
            <TextInput
              value={settings.artistName}
              onChange={(e) => patch({ artistName: e.target.value })}
            />
          </Field>
          <Field label="Подпись (роль, жанр)">
            <TextInput
              value={settings.tagline}
              onChange={(e) => patch({ tagline: e.target.value })}
            />
          </Field>
          <Field label="Тема — один клик и всё подобрано">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => patch(t.patch)}
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2.5 text-left text-xs font-medium text-white transition-colors hover:border-[var(--brand)]"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/20"
                    style={{
                      background:
                        t.patch.bgMode === "gradient"
                          ? `linear-gradient(135deg, ${t.patch.bgFrom}, ${t.patch.bgTo})`
                          : t.patch.bgColor,
                    }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: t.patch.accent }}
                    />
                  </span>
                  {t.name}
                </button>
              ))}
            </div>
          </Field>
          <SegmentedField
            label="Фон страницы"
            value={settings.bgMode}
            options={[
              { value: "solid", label: "Один цвет" },
              { value: "gradient", label: "Градиент" },
            ]}
            onChange={(v) => patch({ bgMode: v })}
          />
          {settings.bgMode === "gradient" ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ColorField
                label="Градиент — от"
                value={settings.bgFrom}
                onChange={(v) => patch({ bgFrom: v })}
              />
              <ColorField
                label="Градиент — до"
                value={settings.bgTo}
                onChange={(v) => patch({ bgTo: v })}
              />
            </div>
          ) : (
            <ColorField
              label="Цвет фона страницы"
              value={settings.bgColor}
              onChange={(v) => patch({ bgColor: v })}
            />
          )}
          <ColorField
            label="Цвет текста страницы"
            value={settings.textColor}
            onChange={(v) => patch({ textColor: v })}
          />
          <Field label="Цвет акцента">
            <div className="flex flex-wrap items-center gap-2">
              {PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Цвет ${c}`}
                  onClick={() => patch({ accent: c })}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                >
                  {settings.accent.toLowerCase() === c ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : null}
                </button>
              ))}
              <label className="flex h-9 cursor-pointer items-center gap-2 rounded-full border border-white/20 px-3 text-xs text-white/70">
                Свой
                <input
                  type="color"
                  value={settings.accent}
                  onChange={(e) => patch({ accent: e.target.value })}
                  className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
                />
              </label>
            </div>
          </Field>
          <Field label="Заголовок для поиска (title)">
            <TextInput
              value={settings.seoTitle}
              onChange={(e) => patch({ seoTitle: e.target.value })}
            />
          </Field>
          <Field
            label="Описание для поиска (description)"
            hint="Коротко о том, кто вы — это видит Google и соцсети при отправке ссылки"
          >
            <TextAreaInput
              value={settings.seoDescription}
              onChange={(e) => patch({ seoDescription: e.target.value })}
            />
          </Field>
          <p className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white/50">
            <X className="h-3.5 w-3.5 shrink-0" />
            Закройте окно — изменения сохранятся автоматически.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
