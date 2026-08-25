import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquareHeart, Megaphone, CalendarCheck, Search, Bot, Scissors } from "lucide-react";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { FEATURES } from "@/components/assistant/types";
import type { ModeId } from "@/lib/assistant-prompt";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hair Business AI Assistant | Messages, Marketing & Planning" },
      {
        name: "description",
        content:
          "An AI assistant for South African hair businesses: write customer replies, create marketing posts, plan bookings and research trends in seconds.",
      },
      { property: "og:title", content: "Hair Business AI Assistant" },
      {
        property: "og:description",
        content:
          "Write customer replies, create marketing content, plan your week and research hair trends — built for small SA hair businesses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ICONS: Record<ModeId, typeof Bot> = {
  chat: Bot,
  message: MessageSquareHeart,
  marketing: Megaphone,
  planner: CalendarCheck,
  research: Search,
};

function Index() {
  const [active, setActive] = useState<ModeId>("chat");
  const feature = FEATURES.find((f) => f.id === active)!;

  return (
    <div className="surface-luxe min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:py-10">
        <aside className="lg:w-72 lg:shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-sidebar text-sidebar-primary">
              <Scissors className="size-5" />
            </div>
            <div>
              <h1 className="text-xl leading-tight font-semibold tracking-tight">
                Hair Business <span className="text-gradient-gold">AI</span>
              </h1>
              <p className="text-xs text-muted-foreground">Your salon back-office assistant</p>
            </div>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {FEATURES.map((f) => {
              const Icon = ICONS[f.id];
              const isActive = f.id === active;
              return (
                <button
                  key={f.id}
                  onClick={() => setActive(f.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                    isActive
                      ? "border-transparent bg-sidebar text-sidebar-foreground shadow-luxe"
                      : "border-border bg-card/70 text-foreground hover:border-gold"
                  }`}
                >
                  <Icon
                    className={`size-4 shrink-0 ${isActive ? "text-sidebar-primary" : "text-muted-foreground"}`}
                  />
                  <span className="whitespace-nowrap lg:whitespace-normal">{f.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 hidden rounded-xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground shadow-soft lg:block">
            <p className="font-medium text-foreground">Good to know</p>
            <p className="mt-1.5">
              The assistant never guesses your prices, stock or bookings. Give it the details
              and it does the writing.
            </p>
          </div>
        </aside>

        <main className="flex min-h-[70vh] flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card/80 shadow-luxe backdrop-blur-sm lg:h-[calc(100vh-5rem)]">
          <AssistantPanel key={feature.id} feature={feature} />
        </main>
      </div>
    </div>
  );
}
