"use client";

import { Pencil, Plus, Settings } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BlockView } from "@/components/blocks/block-view";
import { BlockEditorSheet } from "@/components/editor/block-editor";
import { BlockPalette } from "@/components/editor/block-palette";
import { BlockToolbar } from "@/components/editor/block-toolbar";
import { EditorTopBar, type SaveState } from "@/components/editor/top-bar";
import { PublishDialog } from "@/components/editor/publish-dialog";
import { SettingsDialog } from "@/components/editor/settings-dialog";
import type { Block, BlockType, PageDoc } from "@/lib/types";
import { pageVars, readableTextColor } from "@/lib/brand";
import { DEFAULT_SETTINGS } from "@/lib/default-page";
import { createBlock } from "@/lib/create-block";

export function PageShell({ initialDoc }: { initialDoc: PageDoc }) {
  const [doc, setDoc] = useState<PageDoc>(initialDoc);
  const [editing, setEditing] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [insertAt, setInsertAt] = useState(0);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const dirtyRef = useRef(false);
  const firstRun = useRef(true);
  const docRef = useRef(doc);
  docRef.current = doc;

  // Автосохранение с задержкой
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    dirtyRef.current = true;
    setSaveState("saving");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/page", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(doc),
        });
        if (!res.ok) throw new Error("save failed");
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [doc]);

  const saveNow = useCallback(async () => {
    dirtyRef.current = false;
    try {
      const res = await fetch("/api/page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docRef.current),
      });
      if (!res.ok) throw new Error("save failed");
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  }, []);

  const exportSite = useCallback(async () => {
    const ok = await saveNow();
    if (!ok) return;
    const a = document.createElement("a");
    a.href = "/api/export";
    a.download = "landing.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [saveNow]);

  const setSettings = useCallback((settings: PageDoc["settings"]) => {
    setDoc((d) => ({ ...d, settings }));
  }, []);

  const patchBlock = useCallback((id: string, patch: Record<string, unknown>) => {
    setDoc((d) => ({
      ...d,
      blocks: d.blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)),
    }));
  }, []);

  const addBlock = useCallback(
    (type: BlockType) => {
      const block = createBlock(type);
      setDoc((d) => {
        const blocks = [...d.blocks];
        blocks.splice(insertAt, 0, block);
        return { ...d, blocks };
      });
      setPaletteOpen(false);
      setEditingBlockId(block.id);
    },
    [insertAt],
  );

  const removeBlock = useCallback((id: string) => {
    setDoc((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== id) }));
    setEditingBlockId((cur) => (cur === id ? null : cur));
  }, []);

  const duplicateBlock = useCallback((id: string) => {
    setDoc((d) => {
      const index = d.blocks.findIndex((b) => b.id === id);
      if (index === -1) return d;
      const copy = { ...d.blocks[index], id: crypto.randomUUID() } as Block;
      const blocks = [...d.blocks];
      blocks.splice(index + 1, 0, copy);
      return { ...d, blocks };
    });
  }, []);

  const moveBlock = useCallback((id: string, dir: -1 | 1) => {
    setDoc((d) => {
      const index = d.blocks.findIndex((b) => b.id === id);
      const target = index + dir;
      if (index === -1 || target < 0 || target >= d.blocks.length) return d;
      const blocks = [...d.blocks];
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...d, blocks };
    });
  }, []);

  const editingBlock =
    doc.blocks.find((b) => b.id === editingBlockId) ?? null;

  const openPaletteAt = (index: number) => {
    setInsertAt(index);
    setPaletteOpen(true);
  };

  const empty = doc.blocks.length === 0;
  const settings = { ...DEFAULT_SETTINGS, ...doc.settings };

  return (
    <div
      style={{
        ...pageVars(settings),
        background: "var(--page-bg)",
        color: "var(--fg)",
      }}
      className="min-h-screen font-sans"
    >
      {editing ? (
        <EditorTopBar
          saveState={saveState}
          onOpenSettings={() => setSettingsOpen(true)}
          onPublish={() => setPublishOpen(true)}
          onExport={exportSite}
          onExit={() => setEditing(false)}
        />
      ) : null}

      <main className={editing ? "pb-24 pt-14" : "pb-24"}>
        {empty ? (
          <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="max-w-sm text-[var(--fg-mute)]">
              Страница пока пуста. Включите режим редактирования и добавьте
              первый блок — обложку, текст, трек или что угодно ещё.
            </p>
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                style={{
                  backgroundColor: "var(--brand)",
                  color: "var(--brand-contrast)",
                }}
                className="rounded-full px-6 py-3 text-sm font-semibold"
              >
                Редактировать
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openPaletteAt(0)}
                className="rounded-full border border-[var(--line-strong)] px-6 py-3 text-sm font-semibold text-[var(--fg)] hover:border-[var(--brand)]"
              >
                Добавить блок
              </button>
            )}
          </div>
        ) : (
          doc.blocks.map((block, index) => (
            <div key={block.id} id={block.id}>
              {editing ? (
                <AddDivider onAdd={() => openPaletteAt(index)} />
              ) : null}
              {editing ? (
                <div className="relative mx-3 my-3 rounded-2xl outline outline-1 outline-white/10 transition-colors hover:outline-[var(--brand)] sm:mx-5">
                  <div className="pointer-events-none select-none">
                    <BlockView block={block} />
                  </div>
                  <BlockToolbar
                    onEdit={() => setEditingBlockId(block.id)}
                    onDelete={() => removeBlock(block.id)}
                    onDuplicate={() => duplicateBlock(block.id)}
                    onMoveUp={() => moveBlock(block.id, -1)}
                    onMoveDown={() => moveBlock(block.id, 1)}
                  />
                </div>
              ) : (
                <BlockView block={block} />
              )}
            </div>
          ))
        )}
        {editing && !empty ? (
          <AddDivider onAdd={() => openPaletteAt(doc.blocks.length)} last />
        ) : null}
      </main>

      {!empty ? (
        <footer className="border-t border-[var(--line)] px-6 py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--fg-soft)]">
            {doc.settings.artistName}
          </p>
          {doc.settings.tagline ? (
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--fg-faint)]">
              {doc.settings.tagline}
            </p>
          ) : null}
          <p className="mt-5 text-xs text-[var(--fg-ghost)]">
            © {new Date().getFullYear()} {doc.settings.artistName}
          </p>
        </footer>
      ) : null}

      {!editing ? (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-[0_12px_40px_-8px_var(--brand-glow)] transition-transform hover:scale-105"
          style={{
            backgroundColor: "var(--brand)",
            color: readableTextColor(doc.settings.accent),
          }}
        >
          <Pencil className="h-4 w-4" />
          Редактировать
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#16161d] text-white shadow-xl transition-transform hover:scale-105 sm:hidden"
          title="Настройки"
        >
          <Settings className="h-5 w-5" />
        </button>
      )}

      <BlockPalette
        open={paletteOpen}
        onPick={addBlock}
        onClose={() => setPaletteOpen(false)}
      />
      <BlockEditorSheet
        block={editingBlock}
        onPatch={patchBlock}
        onClose={() => setEditingBlockId(null)}
      />
      <SettingsDialog
        open={settingsOpen}
        settings={doc.settings}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
      />
      <PublishDialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        domain={doc.settings.customDomain ?? ""}
        onDomainChange={(value) =>
          setSettings({ ...doc.settings, customDomain: value })
        }
        onBeforePublish={saveNow}
      />
    </div>
  );
}

function AddDivider({
  onAdd,
  last,
}: {
  onAdd: () => void;
  last?: boolean;
}) {
  return (
    <div className={last ? "mx-3 sm:mx-5" : "mx-3 mt-3 sm:mx-5"}>
      <button
        type="button"
        onClick={onAdd}
        className="group flex w-full items-center gap-3 rounded-xl border border-dashed border-white/25 bg-[#121218]/85 px-4 py-2.5 text-sm text-white/50 backdrop-blur transition-colors hover:border-[var(--brand)] hover:text-white"
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full transition-colors group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand)]"
        >
          <Plus className="h-4 w-4" />
        </span>
        Добавить блок
      </button>
    </div>
  );
}
