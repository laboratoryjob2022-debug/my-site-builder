import type { Block, BlockType } from "./types";

export function createBlock(type: BlockType): Block {
  const id = crypto.randomUUID();
  switch (type) {
    case "hero":
      return {
        id,
        type: "hero",
        title: "Имя артистки",
        subtitle: "Короткий подзаголовок: новый сингл, анонс или слоган",
        image: "",
        primaryLabel: "Слушать",
        primaryUrl: "",
        secondaryLabel: "",
        secondaryUrl: "",
      };
    case "text":
      return {
        id,
        type: "text",
        heading: "Заголовок раздела",
        body: "Текст абзаца. Пустая строка создаёт новый абзац.",
        align: "left",
      };
    case "audio":
      return {
        id,
        type: "audio",
        heading: "Аудио",
        title: "Название трека",
        artist: "Артистка",
        cover: "",
        src: "",
        description: "",
      };
    case "video":
      return {
        id,
        type: "video",
        heading: "Видео",
        url: "",
        caption: "",
      };
    case "releases":
      return {
        id,
        type: "releases",
        heading: "Релизы",
        items: [
          {
            title: "Название релиза",
            year: "2025",
            cover: "",
            links: [{ label: "Площадка", url: "https://" }],
          },
        ],
      };
    case "events":
      return {
        id,
        type: "events",
        heading: "Концерты",
        items: [
          { date: "1 июня", city: "Город", venue: "Площадка", url: "", soldOut: false },
        ],
      };
    case "gallery":
      return { id, type: "gallery", heading: "Галерея", images: [] };
    case "quote":
      return {
        id,
        type: "quote",
        text: "Текст цитаты или отзыва прессы.",
        author: "Источник",
        source: "",
      };
    case "links":
      return {
        id,
        type: "links",
        heading: "Полезные ссылки",
        items: [{ label: "Название ссылки", url: "https://" }],
      };
    case "code":
      return {
        id,
        type: "code",
        heading: "",
        code: "<!-- Вставьте HTML-код виджета -->\n",
      };
    default:
      return { id, type: "text", heading: "", body: "", align: "left" };
  }
}
