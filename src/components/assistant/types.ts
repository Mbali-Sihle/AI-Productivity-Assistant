import type { ModeId } from "@/lib/assistant-prompt";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type Feature = {
  id: ModeId;
  label: string;
  tagline: string;
  placeholder: string;
  examples: string[];
};

export const FEATURES: Feature[] = [
  {
    id: "chat",
    label: "Assistant Chat",
    tagline: "Ask anything about running your hair business.",
    placeholder: "e.g. Give me five ideas to attract new customers this month",
    examples: [
      "What should I post on WhatsApp today?",
      "Help me organise my hair stock",
      "Give me five ideas to attract new customers",
    ],
  },
  {
    id: "message",
    label: "Customer Messages",
    tagline: "Turn any customer situation into a ready-to-send reply.",
    placeholder:
      "Describe the situation, e.g. Customer asking if I have a 24 inch body wave wig in stock",
    examples: [
      "Customer asking about braid prices",
      "Customer cancelling an appointment last minute",
      "Customer complaining her install didn't last",
      "Customer asking about delivery to Durban",
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    tagline: "Captions, status ads and promos that sound like your brand.",
    placeholder:
      "e.g. Instagram caption for a new arrival: raw Vietnamese bone straight bundles",
    examples: [
      "WhatsApp Status ad for month-end braid special",
      "Instagram caption for new wig arrivals",
      "Facebook post inviting bookings for December",
    ],
  },
  {
    id: "planner",
    label: "Booking & Tasks",
    tagline: "A prioritised plan for your day or week.",
    placeholder:
      "e.g. Plan my week: 6 clients, stock order due, need photos for Instagram",
    examples: [
      "Help me plan my business week",
      "Plan a Saturday with 4 knotless braid clients",
      "Plan my admin and stock-check day",
    ],
  },
  {
    id: "research",
    label: "Research",
    tagline: "Trends, competitors and growth ideas — clearly sourced.",
    placeholder: "e.g. What hair trends are popular with SA customers right now?",
    examples: [
      "Hair trends South African customers are asking for",
      "How do I price against nearby salons?",
      "Social media strategy for a home-based hair business",
    ],
  },
];
