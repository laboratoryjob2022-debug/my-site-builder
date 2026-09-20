"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Block } from "@/lib/types";
import { BLOCK_META } from "./block-meta";
import { DesignForm } from "./design-form";
import {
  Field,
  LinkRowsEditor,
  MediaField,
  SwitchField,
  TextAreaInput,
  TextInput,
} from "./fields";

type Patch = Record<string, unknown>;

export function BlockEditorSheet({
  block,
  onPatch,
  onClose,
}: {
  block: Block | null;
  onPatch: (id: string, patch: Patch) => void;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!block} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-white/10 bg-[#121218] p-0 text-white sm:max-w-md"
      >
        {block ? (
          <>
            <SheetHeader className="border-b border-white/10 px-5 py-4">
              <SheetTitle className="text-base text-white">
                {BLOCK_META[block.type].label}
              </SheetTitle>
              <SheetDescription className="text-xs text-white/50">
                Изменения сохраняются автоматически
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 px-5 py-6">
              <BlockForm block={block} onPatch={onPatch} />
              <DesignForm block={block} onPatch={onPatch} />
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function BlockForm({
  block,
  onPatch,
}: {
  block: Block;
  onPatch: (id: string, patch: Patch) => void;
}) {
  const patch = (p: Patch) => onPatch(block.id, p);

  switch (block.type) {
    case "hero":
      return (
        <>
          <Field label="Имя / заголовок">
            <TextInput
              value={block.title}
              onChange={(e) => patch({ title: e.target.value })}
            />
          </Field>
          <Field label="Подзаголовок">
            <TextAreaInput
              value={block.subtitle}
              onChange={(e) => patch({ subtitle: e.target.value })}
            />
          </Field>
          <MediaField
            label="Фоновое фото"
            accept="image/*"
            value={block.image}
            onChange={(url) => patch({ image: url })}
          />
          <Field label="Кнопка 1 — надпись">
            <TextInput
              value={block.primaryLabel}
              onChange={(e) => patch({ primaryLabel: e.target.value })}
            />
          </Field>
          <Field
            label="Кнопка 1 — ссылка"
            hint="Ссылка на сайт или #id блока на этой странице (например #b-audio)"
          >
            <TextInput
              value={block.primaryUrl}
              onChange={(e) => patch({ primaryUrl: e.target.value })}
            />
          </Field>
          <Field label="Кнопка 2 — надпись">
            <TextInput
              value={block.secondaryLabel}
              onChange={(e) => patch({ secondaryLabel: e.target.value })}
            />
          </Field>
          <Field label="Кнопка 2 — ссылка">
            <TextInput
              value={block.secondaryUrl}
              onChange={(e) => patch({ secondaryUrl: e.target.value })}
            />
          </Field>
        </>
      );
    case "text":
      return (
        <>
          <Field label="Заголовок">
            <TextInput
              value={block.heading}
              onChange={(e) => patch({ heading: e.target.value })}
            />
          </Field>
          <Field label="Текст" hint="Пустая строка = новый абзац">
            <TextAreaInput
              rows={8}
              value={block.body}
              onChange={(e) => patch({ body: e.target.value })}
            />
          </Field>
          <Field label="Выравнивание">
            <div className="flex gap-2">
              {(["left", "center"] as const).map((a) => (
                <Button
                  key={a}
                  type="button"
                  variant="outline"
                  onClick={() => patch({ align: a })}
                  className={
                    "flex-1 border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white " +
                    (block.align === a ? "ring-1 ring-[var(--brand)]" : "")
                  }
                >
                  {a === "left" ? "По левому краю" : "По центру"}
                </Button>
              ))}
            </div>
          </Field>
        </>
      );
    case "audio":
      return (
        <>
          <Field label="Заголовок раздела">
            <TextInput
              value={block.heading}
              onChange={(e) => patch({ heading: e.target.value })}
            />
          </Field>
          <Field label="Название трека">
            <TextInput
              value={block.title}
              onChange={(e) => patch({ title: e.target.value })}
            />
          </Field>
          <Field label="Исполнитель">
            <TextInput
              value={block.artist}
              onChange={(e) => patch({ artist: e.target.value })}
            />
          </Field>
          <MediaField
            label="Обложка трека"
            accept="image/*"
            value={block.cover}
            onChange={(url) => patch({ cover: url })}
          />
          <MediaField
            label="Аудиофайл"
            accept="audio/*"
            value={block.src}
            onChange={(url) => patch({ src: url })}
            hint="Загрузите mp3 или вставьте прямую ссылку на аудио"
          />
        </>
      );
    case "video":
      return (
        <>
          <Field label="Заголовок раздела">
            <TextInput
              value={block.heading}
              onChange={(e) => patch({ heading: e.target.value })}
            />
          </Field>
          <MediaField
            label="Видео"
            accept="video/*"
            value={block.url}
            onChange={(url) => patch({ url: url })}
            hint="Ссылка на YouTube / VK / RuTube или загруженный файл"
          />
          <Field label="Подпись под видео">
            <TextInput
              value={block.caption}
              onChange={(e) => patch({ caption: e.target.value })}
            />
          </Field>
        </>
      );
    case "releases":
      return <ReleasesForm block={block} onPatch={patch} />;
    case "events":
      return <EventsForm block={block} onPatch={patch} />;
    case "gallery":
      return <GalleryForm block={block} onPatch={patch} />;
    case "quote":
      return (
        <>
          <Field label="Цитата">
            <TextAreaInput
              value={block.text}
              onChange={(e) => patch({ text: e.target.value })}
            />
          </Field>
          <Field label="Автор / источник">
            <TextInput
              value={block.author}
              onChange={(e) => patch({ author: e.target.value })}
            />
          </Field>
          <Field label="Уточнение (необязательно)">
            <TextInput
              value={block.source}
              onChange={(e) => patch({ source: e.target.value })}
            />
          </Field>
        </>
      );
    case "links":
      return (
        <>
          <Field label="Заголовок раздела">
            <TextInput
              value={block.heading}
              onChange={(e) => patch({ heading: e.target.value })}
            />
          </Field>
          <Field label="Ссылки-кнопки">
            <LinkRowsEditor
              items={block.items}
              onChange={(items) => patch({ items })}
              labelPlaceholder="Название (например: Telegram)"
            />
          </Field>
        </>
      );
    case "code":
      return (
        <>
          <Field label="Заголовок раздела (необязательно)">
            <TextInput
              value={block.heading}
              onChange={(e) => patch({ heading: e.target.value })}
            />
          </Field>
          <Field
            label="HTML-код"
            hint="Вставьте код виджета (плеер, кнопка доната и т.п.). Код вставляется как есть — используйте только свой код."
          >
            <TextAreaInput
              rows={10}
              className="font-mono text-xs"
              value={block.code}
              onChange={(e) => patch({ code: e.target.value })}
            />
          </Field>
        </>
      );
    default:
      return null;
  }
}

function ReleasesForm({
  block,
  onPatch,
}: {
  block: Extract<Block, { type: "releases" }>;
  onPatch: (patch: Patch) => void;
}) {
  return (
    <Field label="Релизы">
      <div className="space-y-4">
        {block.items.map((item, i) => {
          const update = (p: Partial<typeof item>) =>
            onPatch({
              items: block.items.map((it, j) => (j === i ? { ...it, ...p } : it)),
            });
          return (
            <div
              key={i}
              className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-white/40">
                  Релиз {i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/50 hover:bg-red-500/15 hover:text-red-400"
                  onClick={() =>
                    onPatch({ items: block.items.filter((_, j) => j !== i) })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <MediaField
                label="Обложка"
                accept="image/*"
                value={item.cover}
                onChange={(url) => update({ cover: url })}
              />
              <TextInput
                value={item.title}
                placeholder="Название"
                onChange={(e) => update({ title: e.target.value })}
              />
              <TextInput
                value={item.year}
                placeholder="Год"
                onChange={(e) => update({ year: e.target.value })}
              />
              <LinkRowsEditor
                items={item.links}
                onChange={(links) => update({ links })}
                labelPlaceholder="Площадка (Яндекс Музыка...)"
              />
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          className="w-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
          onClick={() =>
            onPatch({
              items: [
                ...block.items,
                { title: "", year: "", cover: "", links: [] },
              ],
            })
          }
        >
          <Plus className="h-4 w-4" /> Добавить релиз
        </Button>
      </div>
    </Field>
  );
}

function EventsForm({
  block,
  onPatch,
}: {
  block: Extract<Block, { type: "events" }>;
  onPatch: (patch: Patch) => void;
}) {
  return (
    <Field label="Концерты">
      <div className="space-y-4">
        {block.items.map((item, i) => {
          const update = (p: Partial<typeof item>) =>
            onPatch({
              items: block.items.map((it, j) => (j === i ? { ...it, ...p } : it)),
            });
          return (
            <div
              key={i}
              className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-white/40">
                  Дата {i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/50 hover:bg-red-500/15 hover:text-red-400"
                  onClick={() =>
                    onPatch({ items: block.items.filter((_, j) => j !== i) })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <TextInput
                value={item.date}
                placeholder="Дата (например: 14 марта)"
                onChange={(e) => update({ date: e.target.value })}
              />
              <TextInput
                value={item.city}
                placeholder="Город"
                onChange={(e) => update({ city: e.target.value })}
              />
              <TextInput
                value={item.venue}
                placeholder="Площадка"
                onChange={(e) => update({ venue: e.target.value })}
              />
              <TextInput
                value={item.url}
                placeholder="Ссылка на билеты (необязательно)"
                onChange={(e) => update({ url: e.target.value })}
              />
              <SwitchField
                label="Билеты проданы"
                checked={item.soldOut}
                onChange={(v) => update({ soldOut: v })}
              />
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          className="w-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
          onClick={() =>
            onPatch({
              items: [
                ...block.items,
                { date: "", city: "", venue: "", url: "", soldOut: false },
              ],
            })
          }
        >
          <Plus className="h-4 w-4" /> Добавить концерт
        </Button>
      </div>
    </Field>
  );
}

function GalleryForm({
  block,
  onPatch,
}: {
  block: Extract<Block, { type: "gallery" }>;
  onPatch: (patch: Patch) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const uploadFiles = async (files: FileList) => {
    setBusy(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = (await res.json()) as { url?: string };
        if (data.url) urls.push(data.url);
      } catch {
        // пропускаем неудавшуюся загрузку
      }
    }
    onPatch({ images: [...block.images, ...urls] });
    setBusy(false);
  };

  return (
    <Field label="Фотографии">
      <div className="grid grid-cols-3 gap-3">
        {block.images.map((src, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-xl border border-white/10"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() =>
                onPatch({ images: block.images.filter((_, j) => j !== i) })
              }
              className="absolute right-1.5 top-1.5 rounded-lg bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              title="Удалить фото"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 text-white/50 transition-colors hover:border-[var(--brand)] hover:text-white"
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span className="text-xs">Загрузить</span>
            </>
          )}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </Field>
  );
}
