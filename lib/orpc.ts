import { os } from "@orpc/server";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { product } from "@/db/schema";
import type { db } from "@/db";

type AppContext = {
  db: typeof db;
};

export const orpc = os.context<AppContext>();

export const appRouter = {
  health: orpc
    .route({ method: "GET", path: "/health" })
    .output(z.object({ ok: z.boolean(), time: z.string() }))
    .handler(() => ({ ok: true, time: new Date().toISOString() })),
  products: orpc
    .route({ method: "GET", path: "/products" })
    .output(
      z.object({
        items: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            price: z.string(),
            createdAt: z.string(),
          }),
        ),
      }),
    )
    .handler(async ({ context }) => {
      const rows = await context.db
        .select()
        .from(product)
        .orderBy(desc(product.createdAt))
        .limit(10);

      return {
        items: rows.map((row) => ({
          id: row.id,
          name: row.name,
          price: row.price,
          createdAt: row.createdAt.toISOString(),
        })),
      };
    }),
};

export type AppRouter = typeof appRouter;
