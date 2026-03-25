"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CUSTOM_PAGE_BLOCK_TYPES,
  type CustomPageBlock,
  emptyBlock,
} from "@/lib/custom-page-model";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

type Props = {
  blocks: CustomPageBlock[];
  onChange: (next: CustomPageBlock[]) => void;
};

export function CustomPageBlocksForm({ blocks, onChange }: Props) {
  const [addType, setAddType] = useState<CustomPageBlock["type"]>("paragraph");

  function updateAt(index: number, patch: Partial<CustomPageBlock>) {
    const next = [...blocks];
    next[index] = { ...next[index], ...patch } as CustomPageBlock;
    onChange(next);
  }

  function removeAt(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  }

  function addBlock(type: CustomPageBlock["type"]) {
    onChange([...blocks, emptyBlock(type)]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[12rem] flex-1">
          <Label htmlFor="add-block-type">Block type</Label>
          <select
            id="add-block-type"
            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={addType}
            onChange={(e) => setAddType(e.target.value as CustomPageBlock["type"])}
          >
            {CUSTOM_PAGE_BLOCK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="button" className="h-10" onClick={() => addBlock(addType)}>
          Add block
        </Button>
        <p className="w-full text-xs text-muted-foreground">
          Blocks render top-to-bottom on the public page. Use headings to structure content.
        </p>
      </div>

      {blocks.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No blocks yet. Choose a type above to add your first section.
        </p>
      ) : null}

      <div className="space-y-3">
        {blocks.map((b, i) => (
          <div
            key={i}
            className={cn(
              "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm",
              "space-y-3"
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#22C55E]">
                {CUSTOM_PAGE_BLOCK_TYPES.find((x) => x.value === b.type)?.label ?? b.type}
              </span>
              <div className="flex gap-1">
                <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => move(i, -1)} aria-label="Move up">
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => move(i, 1)} aria-label="Move down">
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeAt(i)} aria-label="Remove block">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {b.type === "h2" || b.type === "h3" ? (
              <div>
                <Label>Text</Label>
                <Input
                  className="mt-1"
                  value={b.text}
                  onChange={(e) => updateAt(i, { text: e.target.value } as Partial<CustomPageBlock>)}
                />
              </div>
            ) : null}

            {b.type === "paragraph" ? (
              <div>
                <Label>Paragraph</Label>
                <Textarea
                  className="mt-1 min-h-[120px]"
                  value={b.text}
                  onChange={(e) => updateAt(i, { text: e.target.value } as Partial<CustomPageBlock>)}
                />
              </div>
            ) : null}

            {b.type === "image" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label>Image URL</Label>
                  <Input
                    className="mt-1"
                    placeholder="https://… or /path"
                    value={b.url}
                    onChange={(e) => updateAt(i, { url: e.target.value } as Partial<CustomPageBlock>)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Alt text (required for accessibility)</Label>
                  <Input
                    className="mt-1"
                    value={b.alt}
                    onChange={(e) => updateAt(i, { alt: e.target.value } as Partial<CustomPageBlock>)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Caption (optional)</Label>
                  <Input
                    className="mt-1"
                    value={b.caption ?? ""}
                    onChange={(e) => updateAt(i, { caption: e.target.value || undefined } as Partial<CustomPageBlock>)}
                  />
                </div>
              </div>
            ) : null}

            {b.type === "video" ? (
              <div className="space-y-3">
                <div>
                  <Label>Video URL</Label>
                  <Input
                    className="mt-1"
                    placeholder="YouTube / Vimeo link, or .mp4 URL"
                    value={b.url}
                    onChange={(e) => updateAt(i, { url: e.target.value } as Partial<CustomPageBlock>)}
                  />
                </div>
                <div>
                  <Label>Poster URL (optional, for file videos)</Label>
                  <Input
                    className="mt-1"
                    value={b.posterUrl ?? ""}
                    onChange={(e) => updateAt(i, { posterUrl: e.target.value || undefined } as Partial<CustomPageBlock>)}
                  />
                </div>
                <div>
                  <Label>Caption (optional)</Label>
                  <Input
                    className="mt-1"
                    value={b.caption ?? ""}
                    onChange={(e) => updateAt(i, { caption: e.target.value || undefined } as Partial<CustomPageBlock>)}
                  />
                </div>
              </div>
            ) : null}

            {b.type === "embed" ? (
              <div className="space-y-3">
                <div>
                  <Label>YouTube or Vimeo URL</Label>
                  <Input
                    className="mt-1"
                    placeholder="https://www.youtube.com/watch?v=…"
                    value={b.embedUrl}
                    onChange={(e) => updateAt(i, { embedUrl: e.target.value } as Partial<CustomPageBlock>)}
                  />
                </div>
                <div>
                  <Label>Iframe title (accessibility)</Label>
                  <Input
                    className="mt-1"
                    value={b.title ?? ""}
                    onChange={(e) => updateAt(i, { title: e.target.value || undefined } as Partial<CustomPageBlock>)}
                  />
                </div>
              </div>
            ) : null}

            {b.type === "links" ? (
              <div className="space-y-3">
                {b.items.map((item, j) => (
                  <div key={j} className="grid gap-2 rounded-lg border border-[#F1F5F9] p-3 sm:grid-cols-2">
                    <div>
                      <Label>Label</Label>
                      <Input
                        className="mt-1"
                        value={item.label}
                        onChange={(e) => {
                          const items = [...b.items];
                          items[j] = { ...items[j], label: e.target.value };
                          updateAt(i, { items } as Partial<CustomPageBlock>);
                        }}
                      />
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        className="mt-1"
                        value={item.href}
                        onChange={(e) => {
                          const items = [...b.items];
                          items[j] = { ...items[j], href: e.target.value };
                          updateAt(i, { items } as Partial<CustomPageBlock>);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <input
                        type="checkbox"
                        id={`ext-${i}-${j}`}
                        checked={item.external ?? false}
                        onChange={(e) => {
                          const items = [...b.items];
                          items[j] = { ...items[j], external: e.target.checked };
                          updateAt(i, { items } as Partial<CustomPageBlock>);
                        }}
                      />
                      <Label htmlFor={`ext-${i}-${j}`} className="font-normal">
                        Open in new tab
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto text-destructive"
                        onClick={() => {
                          const items = b.items.filter((_, k) => k !== j);
                          updateAt(i, { items } as Partial<CustomPageBlock>);
                        }}
                      >
                        Remove link
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateAt(i, {
                      items: [...b.items, { label: "New link", href: "https://", external: true }],
                    } as Partial<CustomPageBlock>)
                  }
                >
                  Add link
                </Button>
              </div>
            ) : null}

            {b.type === "bulletList" || b.type === "numberedList" ? (
              <div>
                <Label>One item per line</Label>
                <Textarea
                  className="mt-1 min-h-[100px] font-mono text-sm"
                  value={b.items.join("\n")}
                  onChange={(e) =>
                    updateAt(i, {
                      items: e.target.value.split("\n").map((s) => s.trimEnd()),
                    } as Partial<CustomPageBlock>)
                  }
                />
              </div>
            ) : null}

            {b.type === "quote" ? (
              <div className="space-y-3">
                <div>
                  <Label>Quote</Label>
                  <Textarea
                    className="mt-1"
                    value={b.text}
                    onChange={(e) => updateAt(i, { text: e.target.value } as Partial<CustomPageBlock>)}
                  />
                </div>
                <div>
                  <Label>Attribution (optional)</Label>
                  <Input
                    className="mt-1"
                    value={b.attribution ?? ""}
                    onChange={(e) => updateAt(i, { attribution: e.target.value || undefined } as Partial<CustomPageBlock>)}
                  />
                </div>
              </div>
            ) : null}

            {b.type === "cta" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label>Title (optional)</Label>
                  <Input
                    className="mt-1"
                    value={b.title ?? ""}
                    onChange={(e) => updateAt(i, { title: e.target.value || undefined } as Partial<CustomPageBlock>)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Body (optional)</Label>
                  <Textarea
                    className="mt-1"
                    value={b.body ?? ""}
                    onChange={(e) => updateAt(i, { body: e.target.value || undefined } as Partial<CustomPageBlock>)}
                  />
                </div>
                <div>
                  <Label>Button label</Label>
                  <Input
                    className="mt-1"
                    value={b.buttonLabel}
                    onChange={(e) => updateAt(i, { buttonLabel: e.target.value } as Partial<CustomPageBlock>)}
                  />
                </div>
                <div>
                  <Label>Button URL</Label>
                  <Input
                    className="mt-1"
                    placeholder="/contact or https://…"
                    value={b.buttonHref}
                    onChange={(e) => updateAt(i, { buttonHref: e.target.value } as Partial<CustomPageBlock>)}
                  />
                </div>
              </div>
            ) : null}

            {b.type === "divider" ? (
              <p className="text-sm text-muted-foreground">A horizontal rule will appear on the page.</p>
            ) : null}

            {b.type === "spacer" ? (
              <div>
                <Label>Size</Label>
                <select
                  className="mt-1.5 flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm"
                  value={b.size}
                  onChange={(e) =>
                    updateAt(i, { size: e.target.value as "sm" | "md" | "lg" } as Partial<CustomPageBlock>)
                  }
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
