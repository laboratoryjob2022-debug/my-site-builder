export type LinkItem = { label: string; url: string };

export type ReleaseItem = {
  title: string;
  year: string;
  cover: string;
  links: LinkItem[];
};

export type EventItem = {
  date: string;
  city: string;
  venue: string;
  url: string;
  soldOut: boolean;
};

export type BlockBg = "none" | "solid" | "gradient" | "image";
export type BlockWidth = "narrow" | "normal" | "wide" | "full";
export type BlockPad = "none" | "sm" | "md" | "lg" | "xl";
export type BgAngle = "down" | "right" | "diag";

export type BlockDesign = {
  bg: BlockBg;
  bgColor: string;
  bgFrom: string;
  bgTo: string;
  bgAngle: BgAngle;
  bgImage: string;
  overlay: number;
  width: BlockWidth;
  padding: BlockPad;
  textColor: string;
};

type HeroBlock = {
  id: string;
  type: "hero";
  title: string;
  subtitle: string;
  image: string;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel: string;
  secondaryUrl: string;
};

type TextBlock = {
  id: string;
  type: "text";
  heading: string;
  body: string;
  align: "left" | "center";
};

type AudioBlock = {
  id: string;
  type: "audio";
  heading: string;
  title: string;
  artist: string;
  cover: string;
  src: string;
  description: string;
};

type VideoBlock = {
  id: string;
  type: "video";
  heading: string;
  url: string;
  caption: string;
};

type ReleasesBlock = {
  id: string;
  type: "releases";
  heading: string;
  items: ReleaseItem[];
};

type EventsBlock = {
  id: string;
  type: "events";
  heading: string;
  items: EventItem[];
};

type GalleryBlock = {
  id: string;
  type: "gallery";
  heading: string;
  images: string[];
};

type QuoteBlock = {
  id: string;
  type: "quote";
  text: string;
  author: string;
  source: string;
};

type LinksBlock = {
  id: string;
  type: "links";
  heading: string;
  items: LinkItem[];
};

type CodeBlock = {
  id: string;
  type: "code";
  heading: string;
  code: string;
};

type WithDesign = { design?: Partial<BlockDesign> };

export type Block =
  | (HeroBlock & WithDesign)
  | (TextBlock & WithDesign)
  | (AudioBlock & WithDesign)
  | (VideoBlock & WithDesign)
  | (ReleasesBlock & WithDesign)
  | (EventsBlock & WithDesign)
  | (GalleryBlock & WithDesign)
  | (QuoteBlock & WithDesign)
  | (LinksBlock & WithDesign)
  | (CodeBlock & WithDesign);

export type BlockType = Block["type"];

export type PageSettings = {
  artistName: string;
  tagline: string;
  accent: string;
  bgMode: "solid" | "gradient";
  bgColor: string;
  bgFrom: string;
  bgTo: string;
  textColor: string;
  seoTitle: string;
  seoDescription: string;
  // Домен для GitHub Pages — уезжает в репозиторий файлом CNAME
  customDomain?: string;
};

export type PageDoc = {
  settings: PageSettings;
  blocks: Block[];
};
