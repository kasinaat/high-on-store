import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import * as authSchema from "./auth-schema";

export const outlet = pgTable(
  "outlet",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    address: text("address"),
    pincode: text("pincode").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("outlet_pincode_idx").on(table.pincode)],
);

export const menuItem = pgTable(
  "menu_item",
  {
    id: text("id").primaryKey(),
    outletId: text("outlet_id")
      .notNull()
      .references(() => outlet.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    isAvailable: boolean("is_available").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("menu_item_outlet_idx").on(table.outletId)],
);

export const inventoryItem = pgTable(
  "inventory_item",
  {
    id: text("id").primaryKey(),
    menuItemId: text("menu_item_id")
      .notNull()
      .references(() => menuItem.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(0).notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("inventory_item_menu_uidx").on(table.menuItemId),
  ],
);

export const schema = {
  ...authSchema,
  outlet,
  menuItem,
  inventoryItem,
};

export { authSchema };
