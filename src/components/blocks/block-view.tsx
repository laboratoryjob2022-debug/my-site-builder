import type { Block } from "@/lib/types";
import { HeroBlock } from "./hero-block";
import { TextBlock } from "./text-block";
import { AudioBlock } from "./audio-block";
import { VideoBlock } from "./video-block";
import { ReleasesBlock } from "./releases-block";
import { EventsBlock } from "./events-block";
import { GalleryBlock } from "./gallery-block";
import { QuoteBlock } from "./quote-block";
import { LinksBlock } from "./links-block";
import { CodeBlock } from "./code-block";

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} />;
    case "text":
      return <TextBlock block={block} />;
    case "audio":
      return <AudioBlock block={block} />;
    case "video":
      return <VideoBlock block={block} />;
    case "releases":
      return <ReleasesBlock block={block} />;
    case "events":
      return <EventsBlock block={block} />;
    case "gallery":
      return <GalleryBlock block={block} />;
    case "quote":
      return <QuoteBlock block={block} />;
    case "links":
      return <LinksBlock block={block} />;
    case "code":
      return <CodeBlock block={block} />;
    default:
      return null;
  }
}
