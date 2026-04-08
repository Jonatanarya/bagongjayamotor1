# 🛠️ Backend Implementation Details & Code Patterns

## Table of Contents
1. [Database Schema (Drizzle ORM)](#database-schema)
2. [Service Layer Examples](#service-layer-examples)
3. [Route Examples](#route-examples)
4. [Middleware Patterns](#middleware-patterns)
5. [Error Handling](#error-handling)
6. [Validation Schemas](#validation-schemas)

---

## 🗄️ Database Schema

### **Drizzle Schema Files**

#### **schema/users.ts** (via Better Auth)
```typescript
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: text("name").notNull(),
  password: text("password"), // Managed by Better Auth
  role: varchar("role", { length: 50 }).default("ADMIN"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  receipts: many(receipts),
}));

export type User = typeof users.$inferSelect;
export type CreateUserInput = typeof users.$inferInsert;
```

#### **schema/motors.ts**
```typescript
import { pgTable, text, integer, bigint, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { transactions } from "./transactions";

export const motors = pgTable(
  "motors",
  {
    id: text("id").primaryKey(), // MTR-001
    merk: varchar("merk", { length: 100 }).notNull(),
    tipe: varchar("tipe", { length: 100 }).notNull(),
    tahun: integer("tahun").notNull(),
    harga: bigint("harga", { mode: "number" }).notNull(),
    kilometer: integer("kilometer"), // NEW FIELD
    status: varchar("status", { length: 50 }).default("Tersedia"), // Tersedia | Terjual
    imageUrl: text("image_url"),
    deskripsi: text("deskripsi"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    // Unique constraint to prevent duplicates
    uniqueMotor: unique().on(table.merk, table.tipe, table.tahun),
  })
);

export const motorsRelations = relations(motors, ({ many }) => ({
  transactions: many(transactions),
}));

export type Motor = typeof motors.$inferSelect;
export type CreateMotorInput = Omit<typeof motors.$inferInsert, "id" | "createdAt" | "updatedAt">;
export type UpdateMotorInput = Partial<CreateMotorInput>;
```

#### **schema/transactions.ts**
```typescript
import { pgTable, text, bigint, date, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { motors } from "./motors";
import { users } from "./users";

export const transactions = pgTable(
  "transactions",
  {
    id: text("id").primaryKey(), // TRX-001
    type: text("type", { enum: ["Jual", "Beli"] }).notNull(),
    motorId: text("motor_id"),
    clientName: text("client_name").notNull(),
    clientWa: text("client_wa"),
    amount: bigint("amount", { mode: "number" }).notNull(),
    date: date("date").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    motorFk: foreignKey({
      columns: [table.motorId],
      foreignColumns: [motors.id],
    }),
  })
);

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  motor: one(motors, {
    fields: [transactions.motorId],
    references: [motors.id],
  }),
  receipt: one(receipts),
}));

export type Transaction = typeof transactions.$inferSelect;
export type CreateTransactionInput = Omit<typeof transactions.$inferInsert, "id" | "createdAt" | "updatedAt">;
```

#### **schema/sellRequests.ts**
```typescript
import { pgTable, text, bigint, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const sellRequests = pgTable("sell_requests", {
  id: text("id").primaryKey(), // REQ-001
  customerName: text("customer_name").notNull(),
  customerWa: text("customer_wa").notNull(),
  customerAddress: text("customer_address").notNull(),
  merk: varchar("merk", { length: 100 }).notNull(),
  tipe: varchar("tipe", { length: 100 }).notNull(),
  tahun: integer("tahun").notNull(),
  hargaPenawaran: bigint("harga_penawaran", { mode: "number" }).notNull(),
  deskripsi: text("deskripsi"),
  imageUrl: text("image_url"),
  status: varchar("status", { length: 50 }).default("Pending"), // Pending | Contacted | Rejected | Accepted
  createdByAdminId: text("created_by_admin_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type SellRequest = typeof sellRequests.$inferSelect;
export type CreateSellRequestInput = Omit<typeof sellRequests.$inferInsert, "id" | "createdAt" | "updatedAt">;
```

#### **schema/suggestions.ts**
```typescript
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const suggestions = pgTable("suggestions", {
  id: text("id").primaryKey(), // SGT-001
  customerName: text("customer_name"),
  message: text("message").notNull(),
  email: text("email"),
  status: varchar("status", { length: 50 }).default("Unread"), // Unread | Read | Archived
  createdAt: timestamp("created_at").defaultNow(),
});

export type Suggestion = typeof suggestions.$inferSelect;
export type CreateSuggestionInput = Omit<typeof suggestions.$inferInsert, "id" | "createdAt">;
```

#### **schema/receipts.ts**
```typescript
import { pgTable, text, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { transactions } from "./transactions";
import { users } from "./users";

export const receipts = pgTable(
  "receipts",
  {
    id: text("id").primaryKey(), // RCP-001
    transactionId: text("transaction_id").notNull().unique(),
    companyName: text("company_name").default("BAGONG JAYA MOTOR"),
    companyAddress: text("company_address"),
    printedAt: timestamp("printed_at"),
    printedByAdminId: text("printed_by_admin_id"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    transactionFk: foreignKey({
      columns: [table.transactionId],
      references: [transactions.id],
    }),
    adminFk: foreignKey({
      columns: [table.printedByAdminId],
      references: [users.id],
    }),
  })
);

export const receiptsRelations = relations(receipts, ({ one }) => ({
  transaction: one(transactions),
  admin: one(users),
}));

export type Receipt = typeof receipts.$inferSelect;
```

---

## 🔧 Service Layer Examples

### **Motor Service** (`services/motor.service.ts`)
```typescript
import { db } from "../config/database";
import { motors } from "../schema/motors";
import { eq, like, and, desc } from "drizzle-orm";
import { generateId } from "../utils/id-generator";

export class MotorService {
  async getAllMotors(filters: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const { search = "", status, limit = 10, offset = 0 } = filters;

    const conditions = [];
    if (search) {
      conditions.push(
        like(motors.merk, `%${search}%`) ||
        like(motors.tipe, `%${search}%`)
      );
    }
    if (status) {
      conditions.push(eq(motors.status, status));
    }

    const [data, [{ count }]] = await Promise.all([
      db
        .select()
        .from(motors)
        .where(and(...conditions))
        .orderBy(desc(motors.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: motors.id }).from(motors).where(and(...conditions)),
    ]);

    return { motors: data, total: count };
  }

  async getMotorById(id: string) {
    const [motor] = await db.select().from(motors).where(eq(motors.id, id));
    if (!motor) throw new Error("Motor tidak ditemukan");
    return motor;
  }

  async createMotor(data: CreateMotorInput) {
    const id = await generateId("MTR");
    const [motor] = await db
      .insert(motors)
      .values({ ...data, id })
      .returning();
    return motor;
  }

  async updateMotor(id: string, data: UpdateMotorInput) {
    const [motor] = await db
      .update(motors)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(motors.id, id))
      .returning();
    if (!motor) throw new Error("Motor tidak ditemukan");
    return motor;
  }

  async deleteMotor(id: string) {
    await db.delete(motors).where(eq(motors.id, id));
  }

  async toggleStatus(id: string, status: "Tersedia" | "Terjual") {
    return this.updateMotor(id, { status });
  }

  async getMotorStats() {
    const [result] = await db.execute(
      db.raw(
        `SELECT 
          COUNT(*) FILTER (WHERE status = 'Tersedia') as available,
          COUNT(*) FILTER (WHERE status = 'Terjual') as sold,
          COALESCE(SUM(harga), 0) as total_value
        FROM motors`
      )
    );
    return result;
  }
}

export const motorService = new MotorService();
```

### **Transaction Service** (`services/transaction.service.ts`)
```typescript
import { db } from "../config/database";
import { transactions } from "../schema/transactions";
import { motors } from "../schema/motors";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { generateId } from "../utils/id-generator";
import { motorService } from "./motor.service";

export class TransactionService {
  async getAllTransactions(filters: {
    type?: "Jual" | "Beli";
    month?: string;
    year?: string;
    limit?: number;
    offset?: number;
  }) {
    const { type, month, year, limit = 10, offset = 0 } = filters;

    const conditions = [];
    if (type) conditions.push(eq(transactions.type, type));
    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(`${year}-${month}-31`);
      conditions.push(
        and(
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      );
    }

    const [data, [{ count }]] = await Promise.all([
      db
        .select()
        .from(transactions)
        .where(and(...conditions))
        .orderBy(desc(transactions.date))
        .limit(limit)
        .offset(offset),
      db.select({ count: transactions.id }).from(transactions).where(and(...conditions)),
    ]);

    return { transactions: data, total: count };
  }

  async createTransaction(data: CreateTransactionInput) {
    const id = await generateId("TRX");
    const [transaction] = await db
      .insert(transactions)
      .values({ ...data, id })
      .returning();

    // Auto-mark motor as sold if type is 'Jual'
    if (data.type === "Jual" && data.motorId) {
      await motorService.toggleStatus(data.motorId, "Terjual");
    }

    return transaction;
  }

  async getTransactionSummary(month: string, year: string) {
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(`${year}-${month}-31`);

    const result = await db.execute(
      db.raw(
        `SELECT 
          COALESCE(SUM(CASE WHEN type = 'Jual' THEN amount ELSE 0 END), 0) as total_jual,
          COALESCE(SUM(CASE WHEN type = 'Beli' THEN amount ELSE 0 END), 0) as total_beli
        FROM transactions
        WHERE date >= $1 AND date <= $2`,
        [startDate, endDate]
      )
    );

    const [data] = result;
    return {
      totalJual: data.total_jual,
      totalBeli: data.total_beli,
      profit: data.total_jual - data.total_beli,
    };
  }
}

export const transactionService = new TransactionService();
```

### **Suggestion Service** (`services/suggestion.service.ts`)
```typescript
import { db } from "../config/database";
import { suggestions } from "../schema/suggestions";
import { eq, desc } from "drizzle-orm";
import { generateId } from "../utils/id-generator";

export class SuggestionService {
  async getAllSuggestions(filters: {
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const { status, limit = 20, offset = 0 } = filters;

    const data = await db
      .select()
      .from(suggestions)
      .where(status ? eq(suggestions.status, status) : undefined)
      .orderBy(desc(suggestions.createdAt))
      .limit(limit)
      .offset(offset);

    return data;
  }

  async createSuggestion(data: CreateSuggestionInput) {
    const id = await generateId("SGT");
    const [suggestion] = await db
      .insert(suggestions)
      .values({ ...data, id })
      .returning();
    return suggestion;
  }

  async updateStatus(id: string, status: "Unread" | "Read" | "Archived") {
    const [suggestion] = await db
      .update(suggestions)
      .set({ status })
      .where(eq(suggestions.id, id))
      .returning();
    return suggestion;
  }

  async getUnreadCount() {
    const [result] = await db
      .select({ count: suggestions.id })
      .from(suggestions)
      .where(eq(suggestions.status, "Unread"));
    return result?.count || 0;
  }
}

export const suggestionService = new SuggestionService();
```

---

## 📍 Route Examples

### **Motors Routes** (`routes/motors.routes.ts`)
```typescript
import { Router } from "express";
import { motorService } from "../services/motor.service";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validator";
import { createMotorSchema, updateMotorSchema } from "../types/schemas";
import { sendResponse, sendError } from "../utils/response";

const router = Router();

// Get all motors (public)
router.get("/", async (req, res) => {
  try {
    const { search, status, limit, offset } = req.query;
    const data = await motorService.getAllMotors({
      search: search as string,
      status: status as string,
      limit: parseInt(limit as string) || 10,
      offset: parseInt(offset as string) || 0,
    });
    sendResponse(res, 200, data, "Motors retrieved successfully");
  } catch (error) {
    sendError(res, error);
  }
});

// Get single motor (public)
router.get("/:id", async (req, res) => {
  try {
    const motor = await motorService.getMotorById(req.params.id);
    sendResponse(res, 200, motor, "Motor retrieved");
  } catch (error) {
    sendError(res, error);
  }
});

// Get stats (admin)
router.get("/dashboard/summary", authMiddleware, adminOnly, async (req, res) => {
  try {
    const stats = await motorService.getMotorStats();
    sendResponse(res, 200, stats, "Statistics retrieved");
  } catch (error) {
    sendError(res, error);
  }
});

// Create motor (admin)
router.post(
  "/",
  authMiddleware,
  adminOnly,
  validateRequest(createMotorSchema),
  async (req, res) => {
    try {
      const motor = await motorService.createMotor(req.body);
      sendResponse(res, 201, motor, "Motor created successfully");
    } catch (error) {
      sendError(res, error);
    }
  }
);

// Update motor (admin)
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  validateRequest(updateMotorSchema),
  async (req, res) => {
    try {
      const motor = await motorService.updateMotor(req.params.id, req.body);
      sendResponse(res, 200, motor, "Motor updated successfully");
    } catch (error) {
      sendError(res, error);
    }
  }
);

// Toggle status (admin)
router.patch("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Tersedia", "Terjual"].includes(status)) {
      return sendError(res, { message: "Invalid status" });
    }
    const motor = await motorService.toggleStatus(req.params.id, status);
    sendResponse(res, 200, motor, "Status updated");
  } catch (error) {
    sendError(res, error);
  }
});

// Delete motor (admin)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await motorService.deleteMotor(req.params.id);
    sendResponse(res, 200, { success: true }, "Motor deleted");
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
```

### **Suggestions Routes** (`routes/suggestions.routes.ts`)
```typescript
import { Router } from "express";
import { suggestionService } from "../services/suggestion.service";
import { authMiddleware, adminOnly } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validator";
import { createSuggestionSchema } from "../types/schemas";
import { sendResponse, sendError } from "../utils/response";

const router = Router();

// Get all suggestions (admin)
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status, limit, offset } = req.query;
    const data = await suggestionService.getAllSuggestions({
      status: status as string,
      limit: parseInt(limit as string) || 20,
      offset: parseInt(offset as string) || 0,
    });
    sendResponse(res, 200, data, "Suggestions retrieved");
  } catch (error) {
    sendError(res, error);
  }
});

// Create suggestion (public)
router.post("/", validateRequest(createSuggestionSchema), async (req, res) => {
  try {
    const suggestion = await suggestionService.createSuggestion(req.body);
    sendResponse(res, 201, suggestion, "Saran berhasil dikirim");
  } catch (error) {
    sendError(res, error);
  }
});

// Update status (admin)
router.patch("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const suggestion = await suggestionService.updateStatus(req.params.id, status);
    sendResponse(res, 200, suggestion, "Status updated");
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
```

---

## 🔐 Middleware Patterns

### **Auth Middleware** (`middleware/auth.middleware.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth";

export interface AuthRequest extends Request {
  user?: any;
  token?: string;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const session = await auth.api.getSession({ token });

    if (!session) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = session.user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || !["ADMIN", "SUPER_ADMIN"].includes(req.user.role)) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

export function superAdminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Super admin access required" });
  }
  next();
}
```

### **Validation Middleware** (`middleware/validator.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }
  };
}
```

### **Error Handler** (`middleware/errorHandler.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
  }

  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
}
```

---

## ❌ Error Handling

### **Standard Error Patterns**

```typescript
// In services
async function getMotor(id: string) {
  const motor = await db.query.motors.findFirst({ where: { id } });
  if (!motor) {
    throw new AppError(404, "Motor tidak ditemukan", "MOTOR_NOT_FOUND");
  }
  return motor;
}

// In routes
router.get("/:id", async (req, res) => {
  try {
    const motor = await motorService.getMotorById(req.params.id);
    sendResponse(res, 200, motor);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});
```

---

## ✓ Validation Schemas

### **Zod Schemas** (`types/schemas.ts`)
```typescript
import { z } from "zod";

export const createMotorSchema = z.object({
  merk: z.string().min(2, "Merk harus diisi"),
  tipe: z.string().min(2, "Tipe harus diisi"),
  tahun: z.number().int().min(1900).max(2100),
  harga: z.number().int().positive("Harga harus positif"),
  kilometer: z.number().int().nonnegative().optional(),
  status: z.enum(["Tersedia", "Terjual"]).default("Tersedia"),
  imageUrl: z.string().url().optional(),
  deskripsi: z.string().optional(),
});

export const createTransactionSchema = z.object({
  type: z.enum(["Jual", "Beli"]),
  motorId: z.string().optional(),
  clientName: z.string().min(2),
  clientWa: z.string().regex(/^08\d{8,13}$/),
  amount: z.number().int().positive(),
  date: z.string().datetime(),
  notes: z.string().optional(),
});

export const createSellRequestSchema = z.object({
  customerName: z.string().min(2),
  customerWa: z.string().regex(/^08\d{8,13}$/),
  customerAddress: z.string().min(5),
  merk: z.string().min(2),
  tipe: z.string().min(2),
  tahun: z.number().int(),
  hargaPenawaran: z.number().int().positive(),
  deskripsi: z.string().optional(),
});

export const createSuggestionSchema = z.object({
  customerName: z.string().optional(),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
  email: z.string().email().optional(),
});
```

---

## 🚀 Quick Start Commands

```bash
# Initialize backend
npm init -y
npm install express typescript ts-node drizzle-orm pg better-auth zod

# Setup database
createdb bagong_jaya_motor

# Generate migrations
npx drizzle-kit generate:pg

# Run migrations
npm run db:push

# Start dev server
npm run dev

# Build for production
npm run build
npm run start
```

---

This documentation provides complete implementation guidance for building the backend with proper architecture, error handling, and production-ready patterns.
