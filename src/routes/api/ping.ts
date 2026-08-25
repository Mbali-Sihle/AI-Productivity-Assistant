import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ping")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        return new Response(`pong:${body.length}`);
      },
    },
  },
});
