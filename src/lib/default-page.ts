import type { PageDoc, PageSettings } from "./types";

export const DEFAULT_SETTINGS: PageSettings = {
  artistName: "",
  tagline: "",
  accent: "#a855f7",
  bgMode: "solid",
  bgColor: "#0b0b10",
  bgFrom: "#1a1a24",
  bgTo: "#0b0b10",
  textColor: "#ffffff",
  seoTitle: "",
  seoDescription: "",
};

export const defaultPageDoc: PageDoc = {
  settings: {
    ...DEFAULT_SETTINGS,
    artistName: "Мира Волкова",
    tagline: "Певица • Автор песен",
    accent: "#a855f7",
    seoTitle: "Мира Волкова — официальный сайт",
    seoDescription:
      "Певица и автор песен Мира Волкова: новые треки, концерты, клипы и контакты для сотрудничества.",
  },
  blocks: [
    {
      id: "b-hero",
      type: "hero",
      title: "Мира Волкова",
      subtitle:
        "Новый сингл «Северный свет» — уже на всех площадках. Нажмите и послушайте.",
      image: "/demo/hero.webp",
      primaryLabel: "Слушать трек",
      primaryUrl: "#b-audio",
      secondaryLabel: "Концерты",
      secondaryUrl: "#b-events",
    },
    {
      id: "b-text",
      type: "text",
      heading: "Обо мне",
      align: "left",
      body: "Мира Волкова — певица и автор песен. На стыке электроники, соула и живого вокала она пишет о городе, ночи и людях, которые в нём ищут свет.\n\nДебютный EP «Полярная» собрал первые ротации на радиостанциях, а живые выступления сделали её заметным именем новой сцены. Сейчас Мира работает над первым альбомом.",
    },
    {
      id: "b-audio",
      type: "audio",
      heading: "Свежий трек",
      title: "Северный свет",
      artist: "Мира Волкова",
      cover: "/demo/cover-1.webp",
      src: "",
      description:
        "Загрузите mp3-файл в редакторе — и трек можно будет слушать прямо на странице.",
      design: {
        bg: "solid",
        bgColor: "#13131a",
        width: "normal",
        padding: "md",
      },
    },
    {
      id: "b-releases",
      type: "releases",
      heading: "Релизы",
      items: [
        {
          title: "Северный свет",
          year: "2025",
          cover: "/demo/cover-1.webp",
          links: [
            { label: "Яндекс Музыка", url: "https://music.yandex.ru" },
            { label: "VK", url: "https://vk.com" },
          ],
        },
        {
          title: "Полярная — EP",
          year: "2024",
          cover: "/demo/cover-2.webp",
          links: [
            { label: "Яндекс Музыка", url: "https://music.yandex.ru" },
            { label: "Spotify", url: "https://spotify.com" },
          ],
        },
        {
          title: "Таю",
          year: "2024",
          cover: "/demo/cover-3.webp",
          links: [
            { label: "YouTube", url: "https://youtube.com" },
            { label: "Apple Music", url: "https://music.apple.com" },
          ],
        },
      ],
    },
    {
      id: "b-video",
      type: "video",
      heading: "Клипы",
      url: "",
      caption: "",
    },
    {
      id: "b-events",
      type: "events",
      heading: "Концерты",
      items: [
        {
          date: "14 марта",
          city: "Москва",
          venue: "16 тонн",
          url: "https://example.com",
          soldOut: false,
        },
        {
          date: "22 марта",
          city: "Санкт-Петербург",
          venue: "Ласточка",
          url: "",
          soldOut: true,
        },
        {
          date: "5 апреля",
          city: "Казань",
          venue: "Смена",
          url: "https://example.com",
          soldOut: false,
        },
      ],
    },
    {
      id: "b-gallery",
      type: "gallery",
      heading: "Галерея",
      images: ["/demo/gallery-1.webp", "/demo/gallery-2.webp", "/demo/gallery-3.webp"],
    },
    {
      id: "b-quote",
      type: "quote",
      text:
        "Редкое чувство мелодии и текста. Имя Миры Волковой стоит запомнить прямо сейчас.",
      author: "Музыкальная пресса",
      source: "обзор новой сцены",
      design: {
        bg: "gradient",
        bgFrom: "#241436",
        bgTo: "#0b0b10",
        bgAngle: "down",
        width: "normal",
        padding: "lg",
      },
    },
    {
      id: "b-links",
      type: "links",
      heading: "Слушать и следить",
      items: [
        { label: "Яндекс Музыка", url: "https://music.yandex.ru" },
        { label: "VK", url: "https://vk.com" },
        { label: "YouTube", url: "https://youtube.com" },
        { label: "Telegram-канал", url: "https://telegram.org" },
        { label: " Booking: hello@example.com", url: "mailto:hello@example.com" },
      ],
    },
  ],
};
