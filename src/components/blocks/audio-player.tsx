"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function fmt(sec: number) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      void audio.play();
    }
  };

  const pct = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Пауза" : "Слушать"}
        style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-[0_10px_40px_-10px_var(--brand-glow)] transition-transform hover:scale-105"
      >
        {playing ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="ml-0.5 h-6 w-6" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={(e) => {
            const audio = audioRef.current;
            if (audio) audio.currentTime = Number(e.target.value);
          }}
          className="audio-range w-full"
          style={{ "--progress": `${pct}%` } as React.CSSProperties}
          aria-label="Перемотка"
        />
        <div className="mt-1.5 flex justify-between text-xs tabular-nums text-[var(--fg-mute)]">
          <span>{fmt(time)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}
