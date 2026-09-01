import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const cars = pgTable("cars", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { ondelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { ondelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull().defaultNow(),
});
export const userRelations = relations(users, ({ many }) => ({
  products: many(products),
  comments: many(comments),
}));
export const productRelations = relations(products, ({ one, many }) => ({
  comments: many(comments),
  user: one(users, { field: [products.userId], references: [users.id] }),
}));
export const commentRelations = relations(comments, ({ one }) => ({
  user: one(users, { field: [comments.userId], references: [users.id] }),
  product: one(products, {
    field: [comments.productId],
    references: [products.id],
  }),
}));
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
