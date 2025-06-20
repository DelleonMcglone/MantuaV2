import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  username: text("username"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const queries = pgTable("queries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  query: text("query").notNull(),
  chain: text("chain"),
  response: jsonb("response"),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  queryId: integer("query_id").references(() => queries.id),
  txHash: text("tx_hash").unique(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address"),
  value: text("value"),
  gasUsed: text("gas_used"),
  status: text("status").notNull(), // pending, confirmed, failed
  chain: text("chain").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  queries: many(queries),
  transactions: many(transactions),
}));

export const queriesRelations = relations(queries, ({ one, many }) => ({
  user: one(users, {
    fields: [queries.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  query: one(queries, {
    fields: [transactions.queryId],
    references: [queries.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
  username: true,
});

export const insertQuerySchema = createInsertSchema(queries).pick({
  userId: true,
  query: true,
  chain: true,
  response: true,
  status: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  queryId: true,
  txHash: true,
  fromAddress: true,
  toAddress: true,
  value: true,
  gasUsed: true,
  status: true,
  chain: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuery = z.infer<typeof insertQuerySchema>;
export type Query = typeof queries.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
