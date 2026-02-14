import { ORPCError, os } from "@orpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { inventoryItem, menuItem, outlet } from "@/db/schema";
import type { db } from "@/db";
import { ROLES } from "@/lib/roles";

type AppSession = {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  } & Record<string, unknown>;
  user: {
    id: string;
    role?: string | null;
    outletId?: string | null;
    name?: string | null;
    email?: string | null;
  } & Record<string, unknown>;
} | null;

type AppContext = {
  db: typeof db;
  session: AppSession;
};

export const orpc = os.context<AppContext>();

const requireOutletAdmin = orpc.middleware(async ({ context }) => {
  const session = context.session;
  if (!session?.user) {
    throw new ORPCError({
      code: "UNAUTHORIZED",
      message: "Sign in required",
    });
  }

  const role = session.user.role ?? ROLES.customer;
  if (role !== ROLES.outletAdmin && role !== ROLES.superAdmin) {
    throw new ORPCError({
      code: "FORBIDDEN",
      message: "Outlet admin access required",
    });
  }

  return { actor: session.user };
});

const menuItemOutput = z.object({
  id: z.string(),
  outletId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.string(),
  isAvailable: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const appRouter = {
  health: orpc
    .route({ method: "GET", path: "/health" })
    .output(z.object({ ok: z.boolean(), time: z.string() }))
    .handler(() => ({ ok: true, time: new Date().toISOString() })),
  outlets: orpc
    .route({ method: "GET", path: "/outlets" })
    .input(z.object({ pincode: z.string() }))
    .output(
      z.object({
        items: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            address: z.string().nullable(),
            pincode: z.string(),
          }),
        ),
      }),
    )
    .handler(async ({ context, input }) => {
      const rows = await context.db
        .select()
        .from(outlet)
        .where(eq(outlet.pincode, input.pincode))
        .orderBy(desc(outlet.createdAt));

      return {
        items: rows.map((row) => ({
          id: row.id,
          name: row.name,
          address: row.address ?? null,
          pincode: row.pincode,
        })),
      };
    }),
  menuByOutlet: orpc
    .route({ method: "GET", path: "/menu" })
    .input(z.object({ outletId: z.string() }))
    .output(z.object({ items: z.array(menuItemOutput) }))
    .handler(async ({ context, input }) => {
      const rows = await context.db
        .select()
        .from(menuItem)
        .where(eq(menuItem.outletId, input.outletId))
        .orderBy(desc(menuItem.createdAt));

      return {
        items: rows.map((row) => ({
          id: row.id,
          outletId: row.outletId,
          name: row.name,
          description: row.description ?? null,
          price: row.price,
          isAvailable: row.isAvailable,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        })),
      };
    }),
  adminMenuList: orpc
    .route({ method: "GET", path: "/admin/menu" })
    .input(z.object({ outletId: z.string().optional() }))
    .output(z.object({ items: z.array(menuItemOutput) }))
    .use(requireOutletAdmin)
    .handler(async ({ context, input, actor }) => {
      const role = actor.role ?? ROLES.customer;
      const outletId =
        role === ROLES.superAdmin ? input.outletId : actor.outletId;

      if (!outletId) {
        throw new ORPCError({
          code: "BAD_REQUEST",
          message: "Outlet id is required",
        });
      }

      const rows = await context.db
        .select()
        .from(menuItem)
        .where(eq(menuItem.outletId, outletId))
        .orderBy(desc(menuItem.createdAt));

      return {
        items: rows.map((row) => ({
          id: row.id,
          outletId: row.outletId,
          name: row.name,
          description: row.description ?? null,
          price: row.price,
          isAvailable: row.isAvailable,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        })),
      };
    }),
  adminMenuCreate: orpc
    .route({ method: "POST", path: "/admin/menu" })
    .input(
      z.object({
        outletId: z.string().optional(),
        name: z.string().min(2),
        description: z.string().optional(),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/),
        isAvailable: z.boolean().optional(),
      }),
    )
    .output(menuItemOutput)
    .use(requireOutletAdmin)
    .handler(async ({ context, input, actor }) => {
      const role = actor.role ?? ROLES.customer;
      const outletId =
        role === ROLES.superAdmin ? input.outletId : actor.outletId;

      if (!outletId) {
        throw new ORPCError({
          code: "BAD_REQUEST",
          message: "Outlet id is required",
        });
      }

      const id = crypto.randomUUID();
      const [created] = await context.db
        .insert(menuItem)
        .values({
          id,
          outletId,
          name: input.name,
          description: input.description,
          price: input.price,
          isAvailable: input.isAvailable ?? true,
        })
        .returning();

      if (!created) {
        throw new ORPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create menu item",
        });
      }

      return {
        id: created.id,
        outletId: created.outletId,
        name: created.name,
        description: created.description ?? null,
        price: created.price,
        isAvailable: created.isAvailable,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
    }),
  adminMenuUpdate: orpc
    .route({ method: "PATCH", path: "/admin/menu/:id" })
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
        isAvailable: z.boolean().optional(),
      }),
    )
    .output(menuItemOutput)
    .use(requireOutletAdmin)
    .handler(async ({ context, input, actor }) => {
      const role = actor.role ?? ROLES.customer;
      const [existing] = await context.db
        .select()
        .from(menuItem)
        .where(eq(menuItem.id, input.id))
        .limit(1);

      if (!existing) {
        throw new ORPCError({ code: "NOT_FOUND", message: "Item not found" });
      }

      if (
        role !== ROLES.superAdmin &&
        actor.outletId &&
        existing.outletId !== actor.outletId
      ) {
        throw new ORPCError({ code: "FORBIDDEN" });
      }

      const [updated] = await context.db
        .update(menuItem)
        .set({
          name: input.name ?? existing.name,
          description: input.description ?? existing.description,
          price: input.price ?? existing.price,
          isAvailable: input.isAvailable ?? existing.isAvailable,
        })
        .where(eq(menuItem.id, input.id))
        .returning();

      if (!updated) {
        throw new ORPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update menu item",
        });
      }

      return {
        id: updated.id,
        outletId: updated.outletId,
        name: updated.name,
        description: updated.description ?? null,
        price: updated.price,
        isAvailable: updated.isAvailable,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    }),
  adminInventorySet: orpc
    .route({ method: "PUT", path: "/admin/menu/:id/inventory" })
    .input(z.object({ id: z.string(), quantity: z.number().int().min(0) }))
    .output(
      z.object({
        menuItemId: z.string(),
        quantity: z.number(),
        updatedAt: z.string(),
      }),
    )
    .use(requireOutletAdmin)
    .handler(async ({ context, input, actor }) => {
      const role = actor.role ?? ROLES.customer;
      const [existing] = await context.db
        .select()
        .from(menuItem)
        .where(eq(menuItem.id, input.id))
        .limit(1);

      if (!existing) {
        throw new ORPCError({ code: "NOT_FOUND", message: "Item not found" });
      }

      if (
        role !== ROLES.superAdmin &&
        actor.outletId &&
        existing.outletId !== actor.outletId
      ) {
        throw new ORPCError({ code: "FORBIDDEN" });
      }

      const [saved] = await context.db
        .insert(inventoryItem)
        .values({
          id: crypto.randomUUID(),
          menuItemId: input.id,
          quantity: input.quantity,
        })
        .onConflictDoUpdate({
          target: inventoryItem.menuItemId,
          set: { quantity: input.quantity },
        })
        .returning();

      if (!saved) {
        throw new ORPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update inventory",
        });
      }

      return {
        menuItemId: saved.menuItemId,
        quantity: saved.quantity,
        updatedAt: saved.updatedAt.toISOString(),
      };
    }),
};

export type AppRouter = typeof appRouter;
