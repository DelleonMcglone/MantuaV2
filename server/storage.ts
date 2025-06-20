import { users, queries, transactions, type User, type InsertUser, type Query, type InsertQuery, type Transaction, type InsertTransaction } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Query operations
  createQuery(query: InsertQuery): Promise<Query>;
  getQuery(id: number): Promise<Query | undefined>;
  getUserQueries(userId: number): Promise<Query[]>;
  updateQuery(id: number, updates: Partial<Query>): Promise<Query | undefined>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Query operations
  async createQuery(insertQuery: InsertQuery): Promise<Query> {
    const [query] = await db
      .insert(queries)
      .values(insertQuery)
      .returning();
    return query;
  }

  async getQuery(id: number): Promise<Query | undefined> {
    const [query] = await db.select().from(queries).where(eq(queries.id, id));
    return query || undefined;
  }

  async getUserQueries(userId: number): Promise<Query[]> {
    return await db.select().from(queries).where(eq(queries.userId, userId));
  }

  async updateQuery(id: number, updates: Partial<Query>): Promise<Query | undefined> {
    const [query] = await db
      .update(queries)
      .set(updates)
      .where(eq(queries.id, id))
      .returning();
    return query || undefined;
  }

  // Transaction operations
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set(updates)
      .where(eq(transactions.id, id))
      .returning();
    return transaction || undefined;
  }
}

export const storage = new DatabaseStorage();
