"use client";

import { Check, Loader2, Plus, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { LinkItem } from "@/lib/types";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-white/90">{label}</Label>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-white/40">{hint}</p> : null}
    </div>
  );
}

export function TextInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className="border-white/15 bg-white/[0.06] text-white placeholder:text-white/30 focus-visible:ring-[var(--brand)]"
    />
  );
}

export function TextAreaInput(props: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      {...props}
      className="min-h-28 border-white/15 bg-white/[0.06] text-white placeholder:text-white/30 focus-visible:ring-[var(--brand)]"
    />
  );
}

export function MediaField({
  label,
  value,
  onChange,
  accept,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept: string;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Не удалось загрузить файл");
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Не удалось загрузить файл");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Field label={label} hint={hint || "Загрузите файл или вставьте ссылку"}>
      <div className="flex gap-2">
        <TextInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https:// или /uploads/..."
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="shrink-0 border-white/15 bg-white/[0.06] text-white hover:bg-white/10 hover:text-white"
          title="Загрузить файл"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = "";
        }}
      />
      {value && accept.startsWith("image") ? (
        <img
          src={value}
          alt=""
          className="h-24 w-24 rounded-xl border border-white/10 object-cover"
        />
      ) : null}
    </Field>
  );
}

export const COLOR_SWATCHES = [
  "#0b0b10",
  "#14141b",
  "#1c1c28",
  "#23232e",
  "#a855f7",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#f4f1ec",
  "#ffffff",
];

export function SegmentedField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={
              "rounded-lg border px-3 py-2 text-xs font-medium text-white transition-colors " +
              (value === o.value
                ? "border-[var(--brand)] bg-white/10 ring-1 ring-[var(--brand)]"
                : "border-white/15 bg-transparent hover:bg-white/10")
            }
          >
            {o.label}
          </button>
        ))}
      </div>
    </Field>
  );
}

export function ColorField({
  label,
  value,
  onChange,
  allowEmpty,
  emptyLabel = "Авто",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap items-center gap-2">
        {allowEmpty ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className={
              "flex h-9 items-center rounded-full border px-3 text-xs font-medium transition-colors " +
              (!value
                ? "border-[var(--brand)] text-white ring-1 ring-[var(--brand)]"
                : "border-white/15 text-white/60 hover:text-white")
            }
          >
            {emptyLabel}
          </button>
        ) : null}
        {COLOR_SWATCHES.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Цвет ${c}`}
            onClick={() => onChange(c)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-transform hover:scale-110"
            style={{ backgroundColor: c }}
          >
            {value.toLowerCase() === c ? (
              <Check className="h-4 w-4 text-white drop-shadow" />
            ) : null}
          </button>
        ))}
        <label className="flex h-9 cursor-pointer items-center gap-2 rounded-full border border-white/20 px-3 text-xs text-white/70">
          Свой
          <input
            type="color"
            value={value || "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
          />
        </label>
      </div>
    </Field>
  );
}

export function RangeField({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  return (
    <Field label={`${label}: ${value}${unit}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--brand)]"
      />
    </Field>
  );
}

export function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-white/90">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function LinkRowsEditor({
  items,
  onChange,
  labelPlaceholder,
}: {
  items: LinkItem[];
  onChange: (items: LinkItem[]) => void;
  labelPlaceholder: string;
}) {
  const update = (i: number, patch: Partial<LinkItem>) => {
    onChange(items.map((item, j) => (j === i ? { ...item, ...patch } : item)));
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex gap-2">
            <TextInput
              value={item.label}
              placeholder={labelPlaceholder}
              onChange={(e) => update(i, { label: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-white/50 hover:bg-red-500/15 hover:text-red-400"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              title="Удалить ссылку"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <TextInput
            value={item.url}
            placeholder="https://"
            onChange={(e) => update(i, { url: e.target.value })}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...items, { label: "", url: "" }])}
        className="w-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
      >
        <Plus className="h-4 w-4" /> Добавить
      </Button>
    </div>
  );
}
