import type { Block, BlockDesign } from "@/lib/types";
import { resolveDesign } from "@/lib/design";
import {
  ColorField,
  Field,
  MediaField,
  RangeField,
  SegmentedField,
} from "./fields";

type Patch = Record<string, unknown>;

const STYLE_PRESETS: { label: string; design: Partial<BlockDesign> }[] = [
  { label: "Прозрачный", design: { bg: "none" } },
  { label: "Тёмная карточка", design: { bg: "solid", bgColor: "#14141b" } },
  {
    label: "Светлая карточка",
    design: { bg: "solid", bgColor: "#f4f1ec", textColor: "#17171c" },
  },
  { label: "Градиент", design: { bg: "gradient", bgFrom: "#2a1a4a", bgTo: "#0b0b10" } },
  {
    label: "Фиолетовый",
    design: { bg: "solid", bgColor: "#a855f7", textColor: "#ffffff" },
  },
];

export function DesignForm({
  block,
  onPatch,
}: {
  block: Block;
  onPatch: (id: string, patch: Patch) => void;
}) {
  const d = resolveDesign(block);
  const set = (p: Partial<BlockDesign>) =>
    onPatch(block.id, { design: { ...d, ...p } });

  return (
    <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
        Оформление блока
      </p>

      <Field label="Быстрый стиль">
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => set(preset.design)}
              className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </Field>

      <SegmentedField
        label="Фон"
        value={d.bg}
        options={[
          { value: "none", label: "Прозрачный" },
          { value: "solid", label: "Цвет" },
          { value: "gradient", label: "Градиент" },
          { value: "image", label: "Картинка" },
        ]}
        onChange={(v) => set({ bg: v })}
      />
      {d.bg === "solid" ? (
        <ColorField
          label="Цвет фона"
          value={d.bgColor}
          onChange={(v) => set({ bgColor: v })}
        />
      ) : null}
      {d.bg === "gradient" ? (
        <>
          <ColorField
            label="Градиент — от"
            value={d.bgFrom}
            onChange={(v) => set({ bgFrom: v })}
          />
          <ColorField
            label="Градиент — до"
            value={d.bgTo}
            onChange={(v) => set({ bgTo: v })}
          />
          <SegmentedField
            label="Направление градиента"
            value={d.bgAngle}
            options={[
              { value: "down", label: "Сверху вниз" },
              { value: "right", label: "Сбоку" },
              { value: "diag", label: "По диагонали" },
            ]}
            onChange={(v) => set({ bgAngle: v })}
          />
        </>
      ) : null}
      {d.bg === "image" ? (
        <>
          <MediaField
            label="Фоновая картинка"
            accept="image/*"
            value={d.bgImage}
            onChange={(v) => set({ bgImage: v })}
          />
          <RangeField
            label="Затемнение картинки"
            value={d.overlay}
            onChange={(v) => set({ overlay: v })}
            unit="%"
          />
        </>
      ) : null}

      <SegmentedField
        label="Ширина содержимого"
        value={d.width}
        options={[
          { value: "narrow", label: "Узкая" },
          { value: "normal", label: "Обычная" },
          { value: "wide", label: "Широкая" },
          { value: "full", label: "Во всю ширину" },
        ]}
        onChange={(v) => set({ width: v })}
      />

      <SegmentedField
        label="Отступы сверху и снизу"
        value={d.padding}
        options={[
          { value: "none", label: "Нет" },
          { value: "sm", label: "Малые" },
          { value: "md", label: "Средние" },
          { value: "lg", label: "Большие" },
          { value: "xl", label: "Огромные" },
        ]}
        onChange={(v) => set({ padding: v })}
      />

      <ColorField
        label="Цвет текста"
        value={d.textColor}
        onChange={(v) => set({ textColor: v })}
        allowEmpty
        emptyLabel="Как на странице"
      />
    </div>
  );
}
