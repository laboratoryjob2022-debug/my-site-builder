import type { CSSProperties } from "react";
import { pageVars } from "@/lib/brand";
import { designBgStyle, designColorVars } from "@/lib/design";
import type { Block, BlockDesign, PageDoc } from "@/lib/types";

// ---------- утилиты ----------

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function kebab(k: string): string {
  return k.startsWith("--") ? k : k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}

function css(obj: Record<string, string | number | undefined> | CSSProperties): string {
  return Object.entries(obj as Record<string, string | number | undefined>)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${kebab(k)}: ${v}`)
    .join("; ");
}

function attr(name: string, style: Record<string, string | number | undefined> | CSSProperties) {
  const s = css(style);
  return s ? ` ${name}="${esc(s)}"` : "";
}

function fmtTime(sec: number): string {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ---------- стили экспортируемой страницы ----------

const CSS = `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:'Geist',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;background:var(--page-bg);color:var(--fg);-webkit-font-smoothing:antialiased}
img{display:block}
a{color:inherit}
.ex-sec{position:relative;width:100%;overflow:hidden}
.ex-bgimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ex-bgdim{position:absolute;inset:0}
.ex-inner{position:relative;margin:0 auto;width:100%;padding-left:20px;padding-right:20px}
@media(min-width:640px){.ex-inner{padding-left:32px;padding-right:32px}}
.w-narrow{max-width:48rem}.w-normal{max-width:64rem}.w-wide{max-width:80rem}.w-full{max-width:none}
.p-none{padding-top:0;padding-bottom:0}
.p-sm{padding-top:32px;padding-bottom:32px}
.p-md{padding-top:64px;padding-bottom:64px}
.p-lg{padding-top:96px;padding-bottom:96px}
.p-xl{padding-top:128px;padding-bottom:128px}
@media(min-width:768px){.p-sm{padding-top:40px;padding-bottom:40px}.p-md{padding-top:96px;padding-bottom:96px}.p-lg{padding-top:128px;padding-bottom:128px}.p-xl{padding-top:176px;padding-bottom:176px}}
.ex-head{margin-bottom:40px}
@media(min-width:768px){.ex-head{margin-bottom:56px}}
.ex-head .bar{display:block;width:40px;height:4px;border-radius:9999px;background:var(--brand);margin-bottom:16px}
.ex-head h2{margin:0;font-size:1.5rem;font-weight:600;letter-spacing:-.02em;color:var(--fg)}
@media(min-width:640px){.ex-head h2{font-size:1.875rem}}
@media(min-width:768px){.ex-head h2{font-size:2.25rem}}
.ex-hero{position:relative;display:flex;min-height:100vh;min-height:100svh;align-items:flex-end;overflow:hidden}
.ex-hero .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ex-hero .fallback{position:absolute;inset:0;background:radial-gradient(80% 60% at 70% 20%,var(--brand-soft),transparent 70%)}
.ex-hero .shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7),rgba(0,0,0,.4),transparent)}
.ex-hero .inner{position:relative;z-index:10;margin:0 auto;width:100%;max-width:72rem;padding:176px 20px 64px}
@media(min-width:640px){.ex-hero .inner{padding-left:32px;padding-right:32px}}
@media(min-width:768px){.ex-hero .inner{padding-bottom:96px}}
.ex-hero h1{margin:0;max-width:56rem;font-size:3rem;font-weight:700;text-transform:uppercase;line-height:.95;letter-spacing:-.02em;color:var(--fg)}
@media(min-width:640px){.ex-hero h1{font-size:4.5rem}}
@media(min-width:768px){.ex-hero h1{font-size:6rem}}
.ex-hero .sub{margin:24px 0 0;max-width:36rem;font-size:1rem;line-height:1.625;color:var(--fg-soft)}
@media(min-width:640px){.ex-hero .sub{font-size:1.125rem}}
.ex-ctas{margin-top:36px;display:flex;flex-wrap:wrap;gap:12px}
.btn-primary{display:inline-flex;align-items:center;border-radius:9999px;padding:14px 28px;font-size:.875rem;font-weight:600;background:var(--brand);color:var(--brand-contrast);box-shadow:0 10px 40px -10px var(--brand-glow);text-decoration:none;transition:transform .15s}
.btn-primary:hover{transform:scale(1.03)}
.btn-ghost{display:inline-flex;align-items:center;border-radius:9999px;border:1px solid var(--line-strong);background:var(--card);padding:14px 28px;font-size:.875rem;font-weight:600;color:var(--fg);backdrop-filter:blur(8px);text-decoration:none;transition:all .15s}
.btn-ghost:hover{border-color:var(--fg-half);background:var(--card-strong)}
.ex-text{max-width:42rem}
.ex-text.center{margin:0 auto;text-align:center}
.ex-text p{margin:0 0 20px;font-size:1rem;line-height:1.625;color:var(--fg-soft)}
@media(min-width:640px){.ex-text p{font-size:1.125rem}}
.ex-audio{overflow:hidden;border-radius:24px;border:1px solid var(--line);background:var(--card)}
.ex-audio .row{display:flex;flex-direction:column;gap:24px;padding:24px}
@media(min-width:640px){.ex-audio .row{flex-direction:row;align-items:center;gap:32px;padding:32px}}
.ex-audio .cover{height:160px;width:160px;flex-shrink:0;border-radius:16px;object-fit:cover}
@media(min-width:640px){.ex-audio .cover{height:192px;width:192px}}
.ex-audio .meta{min-width:0;flex:1}
.ex-audio h3{margin:0;font-size:1.25rem;font-weight:600;color:var(--fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(min-width:640px){.ex-audio h3{font-size:1.5rem}}
.ex-audio .artist{margin:4px 0 0;font-size:.875rem;color:var(--fg-mute)}
.ex-audio .empty{display:flex;align-items:center;gap:12px;border-radius:16px;border:1px dashed var(--line-strong);padding:16px 20px;font-size:.875rem;color:var(--fg-faint)}
.ex-player{display:flex;align-items:center;gap:16px}
.ex-player audio{display:none}
.ex-play{display:flex;height:56px;width:56px;flex-shrink:0;align-items:center;justify-content:center;border:0;border-radius:9999px;cursor:pointer;background:var(--brand);color:var(--brand-contrast);box-shadow:0 10px 40px -10px var(--brand-glow);transition:transform .15s}
.ex-play:hover{transform:scale(1.05)}
.ex-play svg{width:24px;height:24px;fill:currentColor}
.ex-play .ic-pause{display:none}
.ex-play.playing .ic-pause{display:block}
.ex-play.playing .ic-play{display:none}
.ex-track{min-width:0;flex:1}
.ex-range{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:9999px;outline:none;cursor:pointer;background:linear-gradient(to right,var(--brand) var(--progress,0%),var(--card-strong) var(--progress,0%))}
.ex-range::-webkit-slider-thumb{-webkit-appearance:none;height:14px;width:14px;border-radius:50%;background:var(--brand);border:0}
.ex-range::-moz-range-thumb{height:14px;width:14px;border-radius:50%;background:var(--brand);border:0}
.ex-times{margin-top:6px;display:flex;justify-content:space-between;font-size:.75rem;font-variant-numeric:tabular-nums;color:var(--fg-mute)}
.ex-video{overflow:hidden;border-radius:24px;border:1px solid var(--line);background:#000}
.ex-video .box{aspect-ratio:16/9;width:100%}
.ex-video iframe,.ex-video video{display:block;width:100%;height:100%;border:0}
.ex-video .ph{display:flex;height:100%;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:0 24px;text-align:center;font-size:.875rem;color:var(--fg-faint)}
.ex-caption{margin:16px 0 0;font-size:.875rem;color:var(--fg-mute)}
.ex-rel{display:grid;grid-template-columns:1fr;gap:24px}
@media(min-width:640px){.ex-rel{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.ex-rel{grid-template-columns:repeat(3,1fr)}}
.ex-rel .card{overflow:hidden;border-radius:24px;border:1px solid var(--line);background:var(--card)}
.ex-rel .cover{aspect-ratio:1/1;overflow:hidden}
.ex-rel .cover img{width:100%;height:100%;object-fit:cover}
.ex-rel .body{padding:20px}
.ex-rel .top{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.ex-rel h3{margin:0;font-size:1.125rem;font-weight:600;color:var(--fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ex-rel .year{flex-shrink:0;font-size:.75rem;font-variant-numeric:tabular-nums;color:var(--fg-faint)}
.ex-rel .links{margin-top:16px;display:flex;flex-wrap:wrap;gap:8px}
.chip{display:inline-flex;align-items:center;gap:6px;border-radius:9999px;border:1px solid var(--line);padding:6px 12px;font-size:.75rem;font-weight:500;color:var(--fg-soft);text-decoration:none;transition:all .15s}
.chip:hover{border-color:var(--brand);color:var(--fg)}
.chip svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.empty-note{border-radius:16px;border:1px dashed var(--line-strong);padding:40px 24px;text-align:center;font-size:.875rem;color:var(--fg-faint)}
.ex-ev{overflow:hidden;border-radius:24px;border:1px solid var(--line);background:var(--card)}
.ex-ev .item{display:flex;flex-direction:column;gap:16px;padding:20px}
.ex-ev .item+.item{border-top:1px solid var(--line)}
@media(min-width:640px){.ex-ev .item{flex-direction:row;align-items:center;gap:24px;padding:24px}}
.ex-ev .date{display:flex;width:112px;flex-shrink:0;align-items:center;gap:8px;color:var(--brand);font-size:.875rem;font-weight:600}
.ex-ev .date svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ex-ev .mid{min-width:0;flex:1}
.ex-ev .city{margin:0;font-size:1rem;font-weight:600;color:var(--fg)}
@media(min-width:640px){.ex-ev .city{font-size:1.125rem}}
.ex-ev .venue{margin:2px 0 0;font-size:.875rem;color:var(--fg-mute)}
.ex-ev .act{flex-shrink:0}
.ex-ev .sold{display:inline-block;border-radius:9999px;background:var(--card-strong);padding:10px 20px;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--fg-mute)}
.ex-ev .buy{display:inline-block;border-radius:9999px;padding:10px 20px;font-size:.75rem;font-weight:600;background:var(--brand);color:var(--brand-contrast);text-decoration:none;transition:transform .15s}
.ex-ev .buy:hover{transform:scale(1.05)}
.ex-gal{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media(min-width:640px){.ex-gal{gap:16px}}
@media(min-width:768px){.ex-gal{grid-template-columns:repeat(3,1fr)}}
.ex-gal .cell{aspect-ratio:4/5;overflow:hidden;border-radius:16px;border:1px solid var(--line);background:var(--card)}
.ex-gal img{width:100%;height:100%;object-fit:cover}
.ex-quote{text-align:center}
.ex-quote .mark{user-select:none;font-size:4.5rem;font-weight:700;line-height:1;color:var(--brand)}
.ex-quote blockquote{margin:8px 0 0;font-size:1.25rem;font-weight:500;font-style:italic;line-height:1.625;color:var(--fg-soft)}
@media(min-width:640px){.ex-quote blockquote{font-size:1.5rem}}
@media(min-width:768px){.ex-quote blockquote{font-size:1.875rem}}
.ex-quote .src{margin:24px 0 0;font-size:.875rem;text-transform:uppercase;letter-spacing:.2em;color:var(--fg-mute)}
.ex-links{margin:0 auto;max-width:36rem;display:flex;flex-direction:column;gap:12px}
.ex-links a{display:flex;align-items:center;justify-content:space-between;gap:16px;border-radius:16px;border:1px solid var(--line);background:var(--card);padding:16px 24px;font-size:1rem;font-weight:500;color:var(--fg);text-decoration:none;transition:all .15s}
.ex-links a:hover{border-color:var(--brand);background:var(--brand-soft)}
.ex-links .arr{flex-shrink:0;color:var(--fg-faint)}
.ex-links .arr svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ex-footer{border-top:1px solid var(--line);padding:40px 24px;text-align:center}
.ex-footer .name{margin:0;font-size:.875rem;font-weight:600;text-transform:uppercase;letter-spacing:.25em;color:var(--fg-soft)}
.ex-footer .tag{margin:8px 0 0;font-size:.75rem;text-transform:uppercase;letter-spacing:.2em;color:var(--fg-faint)}
.ex-footer .copy{margin:20px 0 0;font-size:.75rem;color:var(--fg-ghost)}
`;

const AUDIO_JS = `
document.querySelectorAll(".ex-player").forEach(function(p){
  var a=p.querySelector("audio"),b=p.querySelector(".ex-play"),
      r=p.querySelector(".ex-range"),t1=p.querySelector(".t-cur"),t2=p.querySelector(".t-dur");
  if(!a||!b||!r)return;
  function fmt(s){if(!isFinite(s))return"0:00";var m=Math.floor(s/60),x=Math.floor(s%60);return m+":"+(x<10?"0":"")+x;}
  function pct(){return a.duration?a.currentTime/a.duration*100:0;}
  b.addEventListener("click",function(){a.paused?a.play():a.pause();});
  a.addEventListener("play",function(){b.classList.add("playing");});
  a.addEventListener("pause",function(){b.classList.remove("playing");});
  a.addEventListener("ended",function(){b.classList.remove("playing");});
  a.addEventListener("timeupdate",function(){
    r.value=a.currentTime;r.style.setProperty("--progress",pct()+"%");t1.textContent=fmt(a.currentTime);
  });
  a.addEventListener("loadedmetadata",function(){r.max=a.duration||0;t2.textContent=fmt(a.duration);});
  r.addEventListener("input",function(){a.currentTime=Number(r.value);});
});
`;

// ---------- сборка секций ----------

const WIDTH_CLS: Record<BlockDesign["width"], string> = {
  narrow: "w-narrow",
  normal: "w-normal",
  wide: "w-wide",
  full: "w-full",
};

const PAD_CLS: Record<BlockDesign["padding"], string> = {
  none: "p-none",
  sm: "p-sm",
  md: "p-md",
  lg: "p-lg",
  xl: "p-xl",
};

function sectionStyle(d: BlockDesign): Record<string, string> {
  const bg = designBgStyle(d) as Record<string, string> | null;
  const vars = designColorVars(d) as Record<string, string>;
  return { ...(bg ?? {}), ...vars };
}

function openSection(d: BlockDesign, heading: string): string {
  const img =
    d.bg === "image" && d.bgImage
      ? `<img class="ex-bgimg" src="${esc(d.bgImage)}" alt="" aria-hidden="true">` +
        `<div class="ex-bgdim" style="background-color:rgba(0,0,0,${d.overlay / 100})"></div>`
      : "";
  const head = heading
    ? `<div class="ex-head"><span class="bar"></span><h2>${esc(heading)}</h2></div>`
    : "";
  return (
    `<section class="ex-sec ${WIDTH_CLS[d.width]} ${PAD_CLS[d.padding]}"${attr("style", sectionStyle(d))}>` +
    img +
    `<div class="ex-inner">` +
    head
  );
}

const CLOSE_SECTION = `</div></section>`;

const ICON_EXT =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';
const ICON_ARR =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="7" x2="17" y1="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
const ICON_CAL =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';

function toEmbedUrl(url: string): string | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  const rutube = url.match(/rutube\.ru\/video\/([\w]+)/);
  if (rutube) return `https://rutube.ru/play/embed/${rutube[1]}`;
  const vk = url.match(/vk\.com\/video(-?\d+)_(\d+)/);
  if (vk) return `https://vk.com/video_ext.php?oid=${vk[1]}&id=${vk[2]}&hd=2`;
  return null;
}

function renderBlock(block: Block): string {
  switch (block.type) {
    case "hero": {
      const style = sectionStyle(mergeDesign(block));
      const media = block.image
        ? `<img class="bg" src="${esc(block.image)}" alt="${esc(block.title)}">` +
          `<div class="shade"></div>`
        : `<div class="fallback"></div>`;
      const btn = (label: string, url: string, variant: "primary" | "ghost") =>
        label && url
          ? `<a class="${variant === "primary" ? "btn-primary" : "btn-ghost"}" href="${esc(url)}"${url.startsWith("#") ? "" : ' target="_blank" rel="noopener noreferrer"'}>${esc(label)}</a>`
          : "";
      return (
        `<section class="ex-hero"${attr("style", style)}>` +
        media +
        `<div class="inner"><h1>${esc(block.title)}</h1>` +
        (block.subtitle ? `<p class="sub">${esc(block.subtitle)}</p>` : "") +
        `<div class="ex-ctas">${btn(block.primaryLabel, block.primaryUrl, "primary")}${btn(block.secondaryLabel, block.secondaryUrl, "ghost")}</div>` +
        `</div></section>`
      );
    }
    case "text": {
      const paras = block.body
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((p) => `<p>${esc(p)}</p>`)
        .join("");
      return (
        openSection(mergeDesign(block), block.heading) +
          `<div class="ex-text${block.align === "center" ? " center" : ""}">${paras}</div>` +
          CLOSE_SECTION
      );
    }
    case "audio": {
      const d = mergeDesign(block);
      const player = block.src
        ? `<div class="ex-player">` +
          `<audio src="${esc(block.src)}" preload="metadata"></audio>` +
          `<button class="ex-play" type="button" aria-label="Слушать">` +
          `<svg class="ic-play" viewBox="0 0 24 24" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>` +
          `<svg class="ic-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>` +
          `</button>` +
          `<div class="ex-track"><input class="ex-range" type="range" min="0" max="0" step="0.1" value="0" aria-label="Перемотка">` +
          `<div class="ex-times"><span class="t-cur">0:00</span><span class="t-dur">0:00</span></div></div>` +
          `</div>`
        : `<div class="empty">${esc(block.description || "Аудиофайл пока не добавлен.")}</div>`;
      return (
        openSection(d, block.heading) +
        `<div class="ex-audio"><div class="row">` +
        (block.cover
          ? `<img class="cover" src="${esc(block.cover)}" alt="${esc(block.title)}">`
          : "") +
        `<div class="meta"><h3>${esc(block.title || "Название трека")}</h3>` +
        (block.artist ? `<p class="artist">${esc(block.artist)}</p>` : "") +
        `<div style="margin-top:24px">${player}</div></div>` +
        `</div></div>` +
        CLOSE_SECTION
      );
    }
    case "video": {
      const url = block.url.trim();
      const embed = url ? toEmbedUrl(url) : null;
      const isFile = /\.(mp4|webm|ogv|ogg|mov)(\?.*)?$/i.test(url);
      const inner = !url
        ? `<div class="ph">Видео пока не добавлено — вставьте ссылку (YouTube, VK, RuTube) или загрузите файл в редакторе.</div>`
        : isFile
          ? `<video src="${esc(url)}" controls playsinline></video>`
          : `<iframe src="${esc(embed ?? url)}" title="Видео" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe>`;
      return (
        openSection(mergeDesign(block), block.heading) +
        `<div class="ex-video"><div class="box">${inner}</div></div>` +
        (block.caption ? `<p class="ex-caption">${esc(block.caption)}</p>` : "") +
        CLOSE_SECTION
      );
    }
    case "releases": {
      const d = mergeDesign(block);
      if (block.items.length === 0) {
        return openSection(d, block.heading) + `<p class="empty-note">Релизы пока не добавлены.</p>` + CLOSE_SECTION;
      }
      const cards = block.items
        .map(
          (item) =>
            `<div class="card">` +
            (item.cover
              ? `<div class="cover"><img src="${esc(item.cover)}" alt="${esc(item.title)}"></div>`
              : `<div class="cover"></div>`) +
            `<div class="body"><div class="top"><h3>${esc(item.title || "Без названия")}</h3>` +
            (item.year ? `<span class="year">${esc(item.year)}</span>` : "") +
            `</div>` +
            (item.links.length
              ? `<div class="links">${item.links
                  .map(
                    (l) =>
                      `<a class="chip" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}${ICON_EXT}</a>`,
                  )
                  .join("")}</div>`
              : "") +
            `</div></div>`,
        )
        .join("");
      return openSection(d, block.heading) + `<div class="ex-rel">${cards}</div>` + CLOSE_SECTION;
    }
    case "events": {
      const d = mergeDesign(block);
      if (block.items.length === 0) {
        return openSection(d, block.heading) + `<p class="empty-note">Афиша пока пуста.</p>` + CLOSE_SECTION;
      }
      const rows = block.items
        .map(
          (item) =>
            `<div class="item">` +
            `<div class="date">${ICON_CAL}<span>${esc(item.date)}</span></div>` +
            `<div class="mid"><p class="city">${esc(item.city)}</p>` +
            (item.venue ? `<p class="venue">${esc(item.venue)}</p>` : "") +
            `</div>` +
            `<div class="act">${
              item.soldOut
                ? `<span class="sold">Продано</span>`
                : item.url
                  ? `<a class="buy" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Билеты</a>`
                  : ""
            }</div></div>`,
        )
        .join("");
      return openSection(d, block.heading) + `<div class="ex-ev">${rows}</div>` + CLOSE_SECTION;
    }
    case "gallery": {
      const d = mergeDesign(block);
      if (block.images.length === 0) {
        return openSection(d, block.heading) + `<p class="empty-note">Фотографии пока не добавлены.</p>` + CLOSE_SECTION;
      }
      const cells = block.images
        .map(
          (src, i) =>
            `<div class="cell"><img src="${esc(src)}" alt="Фото ${i + 1}" loading="lazy"></div>`,
        )
        .join("");
      return openSection(d, block.heading) + `<div class="ex-gal">${cells}</div>` + CLOSE_SECTION;
    }
    case "quote": {
      const d = mergeDesign(block);
      return (
        openSection(d, "") +
        `<div class="ex-quote"><div class="mark" aria-hidden="true">&ldquo;</div>` +
        `<blockquote>${esc(block.text)}</blockquote>` +
        ((block.author || block.source)
          ? `<p class="src">${esc(block.author)}${block.author && block.source ? " · " : ""}${esc(block.source)}</p>`
          : "") +
        `</div>` +
        CLOSE_SECTION
      );
    }
    case "links": {
      const d = mergeDesign(block);
      const items = block.items
        .map(
          (item) =>
            `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(item.label)}</span><span class="arr">${ICON_ARR}</span></a>`,
        )
        .join("");
      return openSection(d, block.heading) + `<div class="ex-links">${items}</div>` + CLOSE_SECTION;
    }
    case "code": {
      const d = mergeDesign(block);
      return (
        openSection(d, block.heading) +
        (block.code.trim() ? block.code : `<p class="empty-note">HTML-код пока не добавлен.</p>`) +
        CLOSE_SECTION
      );
    }
    default:
      return "";
  }
}

function mergeDesign(block: Block): BlockDesign {
  return {
    bg: "none",
    bgColor: "#14141b",
    bgFrom: "#1c1c28",
    bgTo: "#0b0b10",
    bgAngle: "down",
    bgImage: "",
    overlay: 55,
    width: "normal",
    padding: "md",
    textColor: "",
    ...block.design,
  };
}

// ---------- сборка документа ----------

export function renderExportHtml(doc: PageDoc): string {
  const s = doc.settings;
  const title = s.seoTitle || s.artistName || "Лендинг";
  const blocksHtml = doc.blocks.map((b) => `<div id="${esc(b.id)}">${renderBlock(b)}</div>`).join("");
  const emptyHtml = doc.blocks.length
    ? ""
    : `<section class="ex-sec w-normal p-md"><div class="ex-inner"><p class="empty-note">Страница пока пуста.</p></div></section>`;
  const footer = s.artistName
    ? `<footer class="ex-footer"><p class="name">${esc(s.artistName)}</p>` +
      (s.tagline ? `<p class="tag">${esc(s.tagline)}</p>` : "") +
      `<p class="copy">© ${new Date().getFullYear()} ${esc(s.artistName)}</p></footer>`
    : "";

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
${s.seoDescription ? `<meta name="description" content="${esc(s.seoDescription)}">` : ""}
${s.seoTitle ? `<meta property="og:title" content="${esc(s.seoTitle)}">` : ""}
${s.seoDescription ? `<meta property="og:description" content="${esc(s.seoDescription)}">` : ""}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body${attr("style", {
    ...(pageVars(s) as Record<string, string>),
    background: "var(--page-bg)",
    color: "var(--fg)",
  })}>
${emptyHtml}
${blocksHtml}
${footer}
<script>${AUDIO_JS}</script>
</body>
</html>`;
}

export function renderReadme(doc: PageDoc): string {
  return `Готовый лендинг${doc.settings.artistName ? `: ${doc.settings.artistName}` : ""}

КАК РАЗМЕСТИТЬ В ИНТЕРНЕТЕ
1. Распакуйте архив.
2. Загрузите ВСЕ файлы (index.html и папку assets) в корневую папку хостинга.
   Важно: файлы нужно заливать вместе — index.html ссылается на папку assets.

ГДЕ МОЖНО РАЗМЕСТИТЬ (любой статический хостинг):
- Netlify Drop: перетащите папку на https://app.netlify.com/drop — сайт заработает сразу.
- Vercel, Cloudflare Pages, GitHub Pages.
- Обычный хостинг с FTP/панелью (timeweb, reg.ru и т.п.) — загрузите файлы в папку сайта
  (обычно public_html).

СОБСТВЕННЫЙ ДОМЕН
В настройках хостинга привяжите домен к сайту — инструкции есть у каждого хостинга.

ВНЕШНИЕ ССЫЛКИ
Ссылки на YouTube-видео, сторонние плееры и площадки (Яндекс Музыка и т.п.) работают
через интернет — они подгружаются с серверов этих сервисов.
`;
}
