import { useMemo, useState } from "react";
import { Copy, Check, LibraryBig, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  REPLY_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type TemplateCategory,
} from "@/lib/reply-templates";

export function TemplateLibrary({ onInsert }: { onInsert: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<TemplateCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REPLY_TEMPLATES.filter(
      (t) =>
        (category === "All" || t.category === category) &&
        (!q ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q)),
    );
  }, [category, query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <LibraryBig className="size-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle>Reply templates</DialogTitle>
          <DialogDescription>
            Insert a ready-made format, then fill in the [PLACEHOLDERS] or let the assistant
            do it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 border-b border-border px-5 py-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...TEMPLATE_CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  category === c
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No templates match that search.
            </p>
          ) : (
            results.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-border bg-card p-4 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground">
                    {t.category}
                  </span>
                </div>
                <pre className="mt-3 max-h-40 overflow-y-auto rounded-lg bg-secondary/60 p-3 font-sans text-xs leading-relaxed whitespace-pre-wrap text-card-foreground">
                  {t.body}
                </pre>
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-xs text-muted-foreground"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(t.body);
                        setCopiedId(t.id);
                        setTimeout(() => setCopiedId(null), 1600);
                      } catch {
                        toast.error("Couldn't copy — please select and copy manually.");
                      }
                    }}
                  >
                    {copiedId === t.id ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {copiedId === t.id ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      onInsert(t.body);
                      setOpen(false);
                    }}
                  >
                    Use template
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
