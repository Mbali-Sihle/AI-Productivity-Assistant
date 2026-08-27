import { useMemo, useState } from "react";
import { Copy, Check, LibraryBig, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  REPLY_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type ReplyTemplate,
  type TemplateCategory,
} from "@/lib/reply-templates";
import { useCustomTemplates, type CustomTemplateDraft } from "@/hooks/use-custom-templates";

const EMPTY_DRAFT: CustomTemplateDraft = {
  title: "",
  description: "",
  category: "Prices",
  body: "",
};

export function TemplateLibrary({ onInsert }: { onInsert: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<TemplateCategory | "All" | "My templates">("All");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CustomTemplateDraft | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ReplyTemplate | null>(null);

  const { templates: custom, addTemplate, updateTemplate, deleteTemplate } =
    useCustomTemplates();

  const all = useMemo(() => [...custom, ...REPLY_TEMPLATES], [custom]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter(
      (t) =>
        (category === "All" ||
          (category === "My templates" ? t.custom : t.category === category)) &&
        (!q ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q)),
    );
  }, [all, category, query]);

  function startCreate() {
    setEditingId("new");
    setDraft(EMPTY_DRAFT);
  }

  function startEdit(t: ReplyTemplate) {
    setEditingId(t.id);
    setDraft({
      title: t.title,
      description: t.description,
      category: t.category,
      body: t.body,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function saveDraft() {
    if (!draft) return;
    if (!draft.title.trim() || !draft.body.trim()) {
      toast.error("Give your template a name and some content.");
      return;
    }
    const clean: CustomTemplateDraft = {
      title: draft.title.trim(),
      description: draft.description.trim() || "My saved template",
      category: draft.category,
      body: draft.body.trim(),
    };
    if (editingId === "new") {
      addTemplate(clean);
      toast.success("Template saved.");
    } else if (editingId) {
      updateTemplate(editingId, clean);
      toast.success("Template updated.");
    }
    cancelEdit();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) cancelEdit();
      }}
    >
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
            Insert a ready-made format, then fill in the [PLACEHOLDERS] — or save your own.
          </DialogDescription>
        </DialogHeader>

        {draft ? (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="tpl-title">Template name</Label>
              <Input
                id="tpl-title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="e.g. Frontal wig price quote"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tpl-desc">Short description</Label>
              <Input
                id="tpl-desc"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="When would you use this reply?"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tpl-cat">Category</Label>
              <Select
                value={draft.category}
                onValueChange={(v) => setDraft({ ...draft, category: v as TemplateCategory })}
              >
                <SelectTrigger id="tpl-cat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tpl-body">Message</Label>
              <Textarea
                id="tpl-body"
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                rows={10}
                placeholder={"Hi [CUSTOMER NAME] 👋\n\n…"}
                className="min-h-48 font-sans text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use square brackets for anything that changes, like [PRICE] or [DATE].
              </p>
            </div>
            <div className="flex justify-end gap-2 pb-1">
              <Button variant="ghost" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button onClick={saveDraft}>
                {editingId === "new" ? "Save template" : "Save changes"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 border-b border-border px-5 py-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search templates…"
                    className="pl-9"
                  />
                </div>
                <Button className="gap-1.5" onClick={startCreate}>
                  <Plus className="size-4" /> New
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(["All", "My templates", ...TEMPLATE_CATEGORIES] as const).map((c) => (
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
                    {c === "My templates" && custom.length > 0 ? ` (${custom.length})` : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {results.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {category === "My templates"
                      ? "You haven't saved any templates yet."
                      : "No templates match that search."}
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={startCreate}>
                    <Plus className="size-4" /> Create one
                  </Button>
                </div>
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
                      <div className="flex items-center gap-1.5">
                        {t.custom && (
                          <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-[11px] text-accent-foreground">
                            Mine
                          </span>
                        )}
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground">
                          {t.category}
                        </span>
                      </div>
                    </div>
                    <pre className="mt-3 max-h-40 overflow-y-auto rounded-lg bg-secondary/60 p-3 font-sans text-xs leading-relaxed whitespace-pre-wrap text-card-foreground">
                      {t.body}
                    </pre>
                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      {t.custom && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs text-muted-foreground"
                            onClick={() => startEdit(t)}
                          >
                            <Pencil className="size-3.5" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
                            onClick={() => setPendingDelete(t)}
                          >
                            <Trash2 className="size-3.5" /> Delete
                          </Button>
                        </>
                      )}
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
          </>
        )}
      </DialogContent>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{pendingDelete?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes your saved template from this device. It can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) deleteTemplate(pendingDelete.id);
                setPendingDelete(null);
                toast.success("Template deleted.");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
