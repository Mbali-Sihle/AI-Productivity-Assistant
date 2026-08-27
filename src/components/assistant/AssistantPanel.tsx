import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Loader2, SendHorizonal, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { TONES } from "@/lib/assistant-prompt";
import { TemplateLibrary } from "./TemplateLibrary";
import type { ChatMessage, Feature } from "./types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          toast.error("Couldn't copy — please select and copy manually.");
        }
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function AssistantPanel({ feature }: { feature: Feature }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [tone, setTone] = useState<string>("Friendly");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function insertTemplate(body: string) {
    setInput((prev) => {
      const base = prev.trim();
      return base ? `${base}\n\n${body}` : body;
    });
    setTimeout(() => inputRef.current?.focus(), 0);
    toast.success("Template added — edit the [PLACEHOLDERS] then send.");
  }

  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [feature.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || streaming) return;

    const decorated =
      feature.id === "message" ? `${text}\n\nPreferred tone: ${tone}.` : text;
    const next: ChatMessage[] = [...messages, { role: "user", content: decorated }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, mode: feature.id }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || "The assistant is unavailable right now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
      if (!acc.trim()) {
        setMessages([
          ...next,
          {
            role: "assistant",
            content: "_No answer came back. Please try rephrasing your request._",
          },
        ]);
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setMessages(next);
      } else {
        setMessages(next);
        toast.error((err as Error).message);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{feature.label}</h2>
          <p className="text-sm text-muted-foreground">{feature.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          <TemplateLibrary onInsert={insertTemplate} />
          {feature.id === "message" && (
            <div className="flex flex-wrap gap-1">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    tone === t
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={() => setMessages([])}
            >
              <RotateCcw className="size-3.5" /> Clear
            </Button>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold-soft text-accent-foreground">
              <Sparkles className="size-5" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Try one of these to get started
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {feature.examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => void send(ex)}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm shadow-soft transition-colors hover:border-gold hover:bg-secondary"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="w-full max-w-[92%] rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 shadow-soft">
                    {m.content ? (
                      <>
                        <div className="prose-chat text-sm text-card-foreground">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content}
                          </ReactMarkdown>
                        </div>
                        {!streaming && (
                          <div className="mt-2 flex justify-end border-t border-border pt-2">
                            <CopyButton text={m.content} />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" /> Thinking it through…
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-card/60 px-5 py-4">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder={feature.placeholder}
            rows={2}
            className="max-h-40 min-h-[52px] resize-none bg-background"
          />
          {streaming ? (
            <Button variant="secondary" onClick={() => abortRef.current?.abort()}>
              Stop
            </Button>
          ) : (
            <Button onClick={() => void send()} disabled={!input.trim()} className="gap-1.5">
              <SendHorizonal className="size-4" /> Send
            </Button>
          )}
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-xs text-muted-foreground">
          AI drafts only — always check prices, stock and appointment times before sending to
          a customer.
        </p>
      </div>
    </div>
  );
}
