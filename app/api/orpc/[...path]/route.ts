import { ORPCHandler } from "@orpc/server/fetch";
import { serve } from "@orpc/server/next";
import { auth } from "@/auth";
import { db } from "@/db";
import { appRouter } from "@/lib/orpc";

const handler = new ORPCHandler(appRouter);

export const { GET, POST, PUT, PATCH, DELETE } = serve(handler, {
  prefix: "/api/orpc",
  context: async (request) => ({
    db,
    session: await auth.api.getSession({ headers: request.headers }),
  }),
});
