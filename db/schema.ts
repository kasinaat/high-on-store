import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import * as authSchema from "./auth-schema";

export const product = pgTable("product", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const schema = {
  ...authSchema,
  product,
};

export { authSchema };
