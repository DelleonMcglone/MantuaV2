import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertQuerySchema, insertTransactionSchema } from "@shared/schema";
import blockchainRoutes from "./blockchain-routes";
import rpcTestRoutes from "./rpc-test";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByWalletAddress(userData.walletAddress);
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user ID" });
    }
  });

  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const walletAddress = req.params.address;
      const user = await storage.getUserByWalletAddress(walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid wallet address" });
    }
  });

  // Query routes
  app.post("/api/queries", async (req, res) => {
    try {
      const queryData = insertQuerySchema.parse(req.body);
      const query = await storage.createQuery(queryData);
      res.json(query);
    } catch (error) {
      res.status(400).json({ error: "Invalid query data" });
    }
  });

  app.get("/api/queries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const query = await storage.getQuery(id);
      if (!query) {
        return res.status(404).json({ error: "Query not found" });
      }
      res.json(query);
    } catch (error) {
      res.status(400).json({ error: "Invalid query ID" });
    }
  });

  app.get("/api/users/:userId/queries", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const queries = await storage.getUserQueries(userId);
      res.json(queries);
    } catch (error) {
      res.status(400).json({ error: "Invalid user ID" });
    }
  });

  app.patch("/api/queries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const query = await storage.updateQuery(id, updates);
      if (!query) {
        return res.status(404).json({ error: "Query not found" });
      }
      res.json(query);
    } catch (error) {
      res.status(400).json({ error: "Invalid query update" });
    }
  });

  // Transaction routes
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransaction(id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction ID" });
    }
  });

  app.get("/api/users/:userId/transactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(400).json({ error: "Invalid user ID" });
    }
  });

  app.patch("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const transaction = await storage.updateTransaction(id, updates);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction update" });
    }
  });

  // Add blockchain routes
  app.use('/api/blockchain', blockchainRoutes);
  
  // Add RPC testing routes
  app.use('/api/rpc', rpcTestRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
