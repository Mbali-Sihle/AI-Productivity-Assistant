import { createFileRoute } from "@tanstack/react-router";
import { MASTER_PROMPT, MODE_PROMPTS, type ModeId } from "@/lib/assistant-prompt";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response("AI is not configured for this app.", { status: 500 });
        }

        const body = (await request.json()) as { messages?: Msg[]; mode?: ModeId };
        const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
        const mode: ModeId = body.mode && body.mode in MODE_PROMPTS ? body.mode : "chat";
        if (messages.length === 0) {
          return new Response("No message provided.", { status: 400 });
        }

        console.log("[chat] calling gateway", mode);
        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": apiKey,
            "X-Lovable-AIG-SDK": "fetch",
          },
          body: JSON.stringify({
            model: "openai/gpt-5.6-sol",
            stream: true,
            store: false,
            reasoning: { effort: "low", summary: "auto" },
            input: [
              {
                role: "system",
                content: `${MASTER_PROMPT}\n\n${MODE_PROMPTS[mode]}`,
              },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
        });

        console.log("[chat] upstream status", upstream.status);
        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text().catch(() => "");
          let message = "The assistant is unavailable right now. Please try again.";
          if (upstream.status === 429)
            message = "Too many requests right now — please wait a moment and try again.";
          if (upstream.status === 402)
            message = "AI credits are exhausted. Please add credits in Lovable to continue.";
          if (upstream.status === 403)
            message = "AI access is blocked for this workspace.";
          console.error("AI gateway error", upstream.status, detail);
          return new Response(message, { status: upstream.status });
        }

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const reader = upstream.body.getReader();

        let buffer = "";

        const stream = new ReadableStream<Uint8Array>({
          async pull(controller) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const payload = line.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const evt = JSON.parse(payload);
                if (evt.type === "response.output_text.delta" && evt.delta) {
                  controller.enqueue(encoder.encode(evt.delta));
                }
              } catch {
                /* ignore partial frames */
              }
            }
          },
          cancel() {
            void reader.cancel();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
