"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Globe,
  Loader2,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, TextInput } from "./fields";

type Status = "idle" | "busy" | "ok" | "error";
type PublishConfig = { configured: boolean; repo: string | null; branch: string | null };

export function PublishDialog({
  open,
  onClose,
  domain,
  onDomainChange,
  onBeforePublish,
}: {
  open: boolean;
  onClose: () => void;
  domain: string;
  onDomainChange: (value: string) => void;
  onBeforePublish: () => Promise<boolean>;
}) {
  const [config, setConfig] = useState<PublishConfig | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    if (!open) return;
    setConfig(null);
    setStatus("idle");
    setMessage("");
    setSiteUrl("");
    setFirstTime(false);
    fetch("/api/publish")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ configured: false, repo: null, branch: null }));
  }, [open]);

  const publish = async () => {
    setStatus("busy");
    setMessage("");
    const saved = await onBeforePublish();
    if (!saved) {
      setStatus("error");
      setMessage("Не удалось сохранить изменения — проверьте соединение и попробуйте ещё раз");
      return;
    }
    try {
      const res = await fetch("/api/publish", { method: "POST" });
      const data = (await res.json()) as {
        ok?: boolean;
        url?: string;
        error?: string;
        files?: number;
        branch?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Публикация не удалась");
        return;
      }
      setSiteUrl(data.url ?? "");
      setMessage(
        `Готово: ${data.files ?? "?"} файл(ов) отправлено в ветку ${data.branch ?? "main"}. GitHub Pages обновит сайт в течение минуты-двух.`,
      );
      setFirstTime(true);
      setStatus("ok");
    } catch {
      setStatus("error");
      setMessage("Сервер не ответил — попробуйте ещё раз");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10 bg-[#121218] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Публикация на GitHub
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Сайт соберётся и закоммитится в ваш репозиторий — GitHub Pages
            опубликует его автоматически
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {config === null ? (
            <p className="flex items-center gap-2 py-6 text-sm text-white/40">
              <Loader2 className="h-4 w-4 animate-spin" /> Проверяем настройку…
            </p>
          ) : !config.configured ? (
            <div className="space-y-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] p-4 text-sm text-amber-100/90">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Публикация ещё не настроена — разовая подготовка
              </p>
              <ol className="list-decimal space-y-2 pl-5 text-xs leading-relaxed text-amber-100/70">
                <li>
                  Создайте на GitHub репозиторий для сайта (например{" "}
                  <code className="rounded bg-black/30 px-1">222</code>) и
                  поставьте галочку «Add a README».
                </li>
                <li>
                  Сделайте токен: GitHub → Settings → Developer settings →
                  Personal access tokens → Fine-grained. Выберите этот
                  репозиторий и дайте право{" "}
                  <code className="rounded bg-black/30 px-1">Contents: Read and write</code>.
                </li>
                <li>
                  Добавьте приложению переменные окружения:{" "}
                  <code className="rounded bg-black/30 px-1">GITHUB_TOKEN</code>{" "}
                  — токен,{" "}
                  <code className="rounded bg-black/30 px-1">GITHUB_REPO</code>{" "}
                  — <code className="rounded bg-black/30 px-1">ваш-ник/222</code>.
                  После этого кнопка заработает.
                </li>
              </ol>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5">
                  <Github className="mr-1.5 inline h-3.5 w-3.5" />
                  {config.repo}
                </span>
                {config.branch ? (
                  <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5">
                    ветка {config.branch}
                  </span>
                ) : null}
              </div>

              <Field
                label="Свой домен (необязательно)"
                hint="Запишем в репозиторий файл CNAME. В DNS домена добавьте A-записи 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 — или CNAME на ваш-ник.github.io для поддомена www"
              >
                <TextInput
                  value={domain}
                  placeholder="например, miravolkova.com"
                  onChange={(e) => onDomainChange(e.target.value)}
                />
              </Field>

              <Button
                type="button"
                onClick={publish}
                disabled={status === "busy"}
                className="w-full"
                style={{
                  backgroundColor: "var(--brand)",
                  color: "var(--brand-contrast)",
                }}
              >
                {status === "busy" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Публикуем…
                  </>
                ) : (
                  <>
                    <Github className="h-4 w-4" /> Опубликовать сайт
                  </>
                )}
              </Button>

              {status === "ok" ? (
                <div className="space-y-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-4 text-sm text-emerald-100">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    {message}
                  </p>
                  {siteUrl ? (
                    <a
                      href={siteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200 underline underline-offset-4"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Открыть сайт — {siteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  ) : null}
                  {firstTime ? (
                    <p className="text-xs leading-relaxed text-emerald-100/70">
                      Первый раз? Включите Pages: на GitHub откройте репозиторий
                      → Settings → Pages → Source: «Deploy from a branch» →
                      ветка main, папка / (root) → Save.{" "}
                      {domain
                        ? "Домен впишите там же в поле Custom domain."
                        : ""}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {status === "error" ? (
                <p className="flex items-start gap-2 rounded-2xl border border-red-400/25 bg-red-400/[0.07] p-4 text-sm text-red-100">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {message}
                </p>
              ) : null}
            </>
          )}

          <p className="flex items-center gap-2 text-xs text-white/35">
            <Globe className="h-3.5 w-3.5 shrink-0" />
            Каждая публикация — отдельный коммит: история изменений сохраняется
            в репозитории.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
