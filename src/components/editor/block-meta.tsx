import {
  AudioLines,
  CalendarDays,
  Clapperboard,
  Code2,
  Disc3,
  Images,
  Link2,
  Quote,
  Sparkles,
  Type,
} from "lucide-react";
import type { BlockType } from "@/lib/types";

export const BLOCK_META: Record<
  BlockType,
  { label: string; description: string; icon: typeof Sparkles }
> = {
  hero: {
    label: "Обложка (Hero)",
    description: "Первый экран: фото, имя артистки, кнопки",
    icon: Sparkles,
  },
  text: {
    label: "Текст",
    description: "Заголовок и абзацы — биография, история, новости",
    icon: Type,
  },
  audio: {
    label: "Аудио",
    description: "Трек с плеером — слушается прямо на странице",
    icon: AudioLines,
  },
  video: {
    label: "Видео",
    description: "Клип с YouTube, VK, RuTube или загруженный файл",
    icon: Clapperboard,
  },
  releases: {
    label: "Релизы",
    description: "Обложки треков и ссылки на площадки",
    icon: Disc3,
  },
  events: {
    label: "Афиша",
    description: "Даты, города, площадки и кнопки билетов",
    icon: CalendarDays,
  },
  gallery: {
    label: "Галерея",
    description: "Сетка фотографий",
    icon: Images,
  },
  quote: {
    label: "Цитата",
    description: "Отзыв прессы или важная цитата",
    icon: Quote,
  },
  links: {
    label: "Ссылки",
    description: "Кнопки на соцсети и музыкальные площадки",
    icon: Link2,
  },
  code: {
    label: "Код / виджет",
    description: "Свой HTML-код или вставка виджета",
    icon: Code2,
  },
};
