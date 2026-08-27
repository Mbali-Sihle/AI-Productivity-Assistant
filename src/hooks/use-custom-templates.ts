import { useCallback, useEffect, useState } from "react";
import type { ReplyTemplate, TemplateCategory } from "@/lib/reply-templates";

const STORAGE_KEY = "hair-assistant:custom-templates:v1";

export type CustomTemplateDraft = {
  title: string;
  description: string;
  category: TemplateCategory;
  body: string;
};

function read(): ReplyTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ReplyTemplate[]) : [];
  } catch {
    return [];
  }
}

export function useCustomTemplates() {
  const [templates, setTemplates] = useState<ReplyTemplate[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTemplates(read());
    setLoaded(true);
  }, []);

  const persist = useCallback((next: ReplyTemplate[]) => {
    setTemplates(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const addTemplate = useCallback(
    (draft: CustomTemplateDraft) => {
      const item: ReplyTemplate = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        custom: true,
        ...draft,
      };
      persist([item, ...read()]);
      return item;
    },
    [persist],
  );

  const updateTemplate = useCallback(
    (id: string, draft: CustomTemplateDraft) => {
      persist(read().map((t) => (t.id === id ? { ...t, ...draft } : t)));
    },
    [persist],
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      persist(read().filter((t) => t.id !== id));
    },
    [persist],
  );

  return { templates, loaded, addTemplate, updateTemplate, deleteTemplate };
}
