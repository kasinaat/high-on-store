import { ORPCHandler } from "@orpc/server/fetch";
import { serve } from "@orpc/server/next";
import { db } from "@/db";
import { appRouter } from "@/lib/orpc";

const handler = new ORPCHandler(appRouter);

export const { GET, POST, PUT, PATCH, DELETE } = serve(handler, {
  prefix: "/api/orpc",
  context: () => ({ db }),
});
