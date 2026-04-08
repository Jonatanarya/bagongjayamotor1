# 🚀 Backend Implementation Plan — Bagong Jaya Motor

**Tech Stack:**
- **Framework:** ExpressJS
- **Database:** PostgreSQL + Drizzle ORM
- **Authentication:** Better Auth (bytebase/auth)
- **Architecture:** Service-based with Route isolation

---

## 📋 Table of Contents

1. [Database Schema](#database-schema)
2. [Project Structure](#project-structure)
3. [API Routes](#api-routes)
4. [Service Layer](#service-layer)
5. [Authentication Setup](#authentication-setup)
6. [Implementation Checklist](#implementation-checklist)

---

## 🗄️ Database Schema

### **1. Users Table** (Admin Authentication)

```sql
-- via Better Auth
-- Fields: id, email, password, name, role, createdAt, updatedAt
-- Roles: ADMIN, SUPER_ADMIN
```

**Drizzle Definition:**
```typescript
{
  id: TEXT PRIMARY KEY,
  email: TEXT UNIQUE NOT NULL,
  name: TEXT NOT NULL,
  role: 'ADMIN' | 'SUPER_ADMIN' DEFAULT 'ADMIN',
  createdAt: TIMESTAMP DEFAULT NOW(),
  updatedAt: TIMESTAMP DEFAULT NOW(),
}
```

---

### **2. Motors Table** (Stock Management)

Stores all motorcycle inventory with availability status.

```typescript
{
  id: TEXT PRIMARY KEY (format: "MTR-001"),
  merk: TEXT NOT NULL,
  tipe: TEXT NOT NULL,
  tahun: INTEGER NOT NULL,
  harga: BIGINT NOT NULL,
  kilometer: INTEGER, // NEW: Field from StockPage
  status: 'Tersedia' | 'Terjual' DEFAULT 'Tersedia',
  image_url: TEXT,
  deskripsi: TEXT,
  createdAt: TIMESTAMP DEFAULT NOW(),
  updatedAt: TIMESTAMP DEFAULT NOW(),
}
```

**Indices:**
- `UNIQUE(merk, tipe, tahun)` — Prevent duplicate motor listings
- `INDEX(status)` — Filter by availability
- `INDEX(createdAt)` — Sorting

---

### **3. Transactions Table** (Jual/Beli Records)

Tracks all buying and selling transactions.

```typescript
{
  id: TEXT PRIMARY KEY (format: "TRX-001"),
  type: 'Jual' | 'Beli' NOT NULL,
  motor_id: FK → Motors.id,
  client_name: TEXT NOT NULL,
  client_wa: TEXT,
  amount: BIGINT NOT NULL,
  date: DATE NOT NULL,
  notes: TEXT,
  createdAt: TIMESTAMP DEFAULT NOW(),
  updatedAt: TIMESTAMP DEFAULT NOW(),
}
```

**Indices:**
- `INDEX(type, date)` — For report filtering
- `INDEX(motor_id)` — For motor history

---

### **4. SellRequests Table** (Customer Sell Offers)

Captures offers from customers wanting to sell their motorcycles.

```typescript
{
  id: TEXT PRIMARY KEY (format: "REQ-001"),
  customer_name: TEXT NOT NULL,
  customer_wa: TEXT NOT NULL,
  customer_address: TEXT NOT NULL,
  merk: TEXT NOT NULL,
  tipe: TEXT NOT NULL,
  tahun: INTEGER NOT NULL,
  harga_penawaran: BIGINT NOT NULL,
  deskripsi: TEXT,
  image_url: TEXT, // Upload handling
  status: 'Pending' | 'Contacted' | 'Rejected' | 'Accepted' DEFAULT 'Pending',
  created_by_admin: FK → Users.id (nullable),
  createdAt: TIMESTAMP DEFAULT NOW(),
  updatedAt: TIMESTAMP DEFAULT NOW(),
}
```

**Indices:**
- `INDEX(status)` — Filter pending requests
- `INDEX(createdAt DESC)` — Recent first

---

### **5. Suggestions Table** (Customer Feedback)

Public feedback and suggestions from customers.

```typescript
{
  id: TEXT PRIMARY KEY (format: "SGT-001"),
  customer_name: TEXT,
  message: TEXT NOT NULL,
  email: TEXT,
  status: 'Unread' | 'Read' | 'Archived' DEFAULT 'Unread',
  createdAt: TIMESTAMP DEFAULT NOW(),
}
```

**Indices:**
- `INDEX(status)` — Filter unread suggestions

---

### **6. Receipts Table** (Kwitansi Records)

Stores receipt templates and print history.

```typescript
{
  id: TEXT PRIMARY KEY (format: "RCP-001"),
  transaction_id: FK → Transactions.id UNIQUE,
  company_name: TEXT DEFAULT 'BAGONG JAYA MOTOR',
  company_address: TEXT,
  printed_at: TIMESTAMP,
  printed_by_admin: FK → Users.id,
  createdAt: TIMESTAMP DEFAULT NOW(),
}
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts           # Drizzle + PostgreSQL setup
│   │   ├── env.ts                # Environment variables validation
│   │   └── auth.ts               # Better Auth configuration
│   │
│   ├── schema/
│   │   ├── users.ts              # Better Auth user schema
│   │   ├── motors.ts
│   │   ├── transactions.ts
│   │   ├── sellRequests.ts
│   │   ├── suggestions.ts
│   │   ├── receipts.ts
│   │   └── relations.ts           # Define FK relationships
│   │
│   ├── services/
│   │   ├── auth.service.ts        # Auth logic (Better Auth wrapper)
│   │   ├── motor.service.ts       # Stock management
│   │   ├── transaction.service.ts # Buy/sell transactions
│   │   ├── sellRequest.service.ts # Customer sell offers
│   │   ├── suggestion.service.ts  # Feedback management
│   │   ├── receipt.service.ts     # Receipt generation
│   │   └── report.service.ts      # Analytics & reports
│   │
│   ├── routes/
│   │   ├── auth.routes.ts         # POST /auth/register, /auth/login, /auth/logout
│   │   ├── motors.routes.ts       # CRUD for motorcycles
│   │   ├── transactions.routes.ts # Transaction management
│   │   ├── requests.routes.ts     # Customer sell requests
│   │   ├── suggestions.routes.ts  # Public feedback + Admin view
│   │   ├── receipts.routes.ts     # Receipt management & print
│   │   ├── reports.routes.ts      # Analytics endpoints
│   │   └── index.ts               # Route aggregation
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts     # Verify JWT / Better Auth session
│   │   ├── errorHandler.ts        # Global error handling
│   │   ├── validator.ts           # Request schema validation (zod)
│   │   └── cors.middleware.ts     # CORS configuration
│   │
│   ├── types/
│   │   └── index.ts               # Shared TypeScript types
│   │
│   ├── utils/
│   │   ├── id-generator.ts        # MTR-, TRX-, REQ-, SGT- ID generation
│   │   ├── response.ts            # Standardized response formatter
│   │   ├── logger.ts              # Winston/Pino logging
│   │   └── upload.ts              # File upload handling (Multer)
│   │
│   └── app.ts                     # Express app setup
│
├── migrations/
│   ├── 001_init.ts                # Initial schema
│   ├── 002_add_motor_fields.ts    # Add motorcycle features
│   └── 003_add_suggestions.ts     # Add feedback system
│
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── drizzle.config.ts              # Drizzle config
└── index.ts                       # Server entry point
```

---

## 🌐 API Routes

### **Authentication Routes** → `/api/auth`

```
POST   /auth/register
       Body: { email, password, name }
       Response: { user_id, token }

POST   /auth/login
       Body: { email, password }
       Response: { user_id, token, user }

POST   /auth/logout
       Headers: { Authorization: Bearer <token> }
       Response: { success: true }

GET    /auth/me
       Headers: { Authorization: Bearer <token> }
       Response: { user }
```

---

### **Motors (Stock) Routes** → `/api/motors`

```
GET    /motors
       Query: { search, status, limit, offset }
       Response: { motors: [], total, page }

GET    /motors/:id
       Response: { motor }

POST   /motors
       Auth: Required (ADMIN)
       Body: { merk, tipe, tahun, harga, kilometer, status, image_url }
       Response: { motor }

PUT    /motors/:id
       Auth: Required (ADMIN)
       Body: { merk?, tipe?, tahun?, harga?, kilometer?, status?, image_url? }
       Response: { motor }

DELETE /motors/:id
       Auth: Required (ADMIN)
       Response: { success: true }

PATCH  /motors/:id/status
       Auth: Required (ADMIN)
       Body: { status: 'Tersedia' | 'Terjual' }
       Response: { motor }

GET    /motors/dashboard/summary
       Auth: Required (ADMIN)
       Response: { available_count, sold_count, total_value }
```

---

### **Transactions Routes** → `/api/transactions`

```
GET    /transactions
       Auth: Required (ADMIN)
       Query: { type, month, year, limit, offset }
       Response: { transactions: [], total }

GET    /transactions/:id
       Auth: Required (ADMIN)
       Response: { transaction }

POST   /transactions
       Auth: Required (ADMIN)
       Body: { type, motor_id, client_name, client_wa, amount, date, notes? }
       Response: { transaction }

PUT    /transactions/:id
       Auth: Required (ADMIN)
       Body: { type?, motor_id?, client_name?, amount?, date?, notes? }
       Response: { transaction }

DELETE /transactions/:id
       Auth: Required (ADMIN)
       Response: { success: true }

GET    /transactions/summary
       Auth: Required (ADMIN)
       Query: { month, year }
       Response: { 
         total_jual: number, 
         total_beli: number, 
         profit: number 
       }
```

---

### **Sell Requests Routes** → `/api/requests`

```
GET    /requests
       Auth: Required (ADMIN)
       Query: { status, limit, offset }
       Response: { requests: [], total }

GET    /requests/:id
       Auth: Required (ADMIN)
       Response: { request }

POST   /requests
       Public
       Body: { 
         customer_name, 
         customer_wa, 
         customer_address, 
         merk, 
         tipe, 
         tahun, 
         harga_penawaran, 
         deskripsi?,
         image (multipart)
       }
       Response: { request_id }

PUT    /requests/:id
       Auth: Required (ADMIN)
       Body: { status, created_by_admin? }
       Response: { request }

DELETE /requests/:id
       Auth: Required (ADMIN)
       Response: { success: true }
```

---

### **Suggestions Routes** → `/api/suggestions`

```
GET    /suggestions
       Auth: Required (ADMIN)
       Query: { status, limit, offset }
       Response: { suggestions: [], total }

POST   /suggestions
       Public
       Body: { customer_name?, message, email? }
       Response: { suggestion_id }

PATCH  /suggestions/:id/status
       Auth: Required (ADMIN)
       Body: { status: 'Unread' | 'Read' | 'Archived' }
       Response: { suggestion }

DELETE /suggestions/:id
       Auth: Required (ADMIN)
       Response: { success: true }
```

---

### **Receipts Routes** → `/api/receipts`

```
GET    /receipts/:transaction_id
       Auth: Required (ADMIN)
       Response: { receipt_html }

POST   /receipts/:transaction_id/print
       Auth: Required (ADMIN)
       Body: { company_name?, company_address? }
       Response: { receipt_id, html, pdf? }

GET    /receipts/export/:transaction_id/pdf
       Auth: Required (ADMIN)
       Response: PDF file
```

---

### **Reports Routes** → `/api/reports`

```
GET    /reports/transactions
       Auth: Required (ADMIN)
       Query: { month, year }
       Response: { 
         monthly_summary,
         transaction_list,
         total_jual,
         total_beli
       }

GET    /reports/inventory
       Auth: Required (ADMIN)
       Response: {
         total_motor,
         available_count,
         sold_count,
         total_value,
         by_merk
       }

GET    /reports/export/csv
       Auth: Required (ADMIN)
       Query: { month, year, type }
       Response: CSV file

GET    /reports/dashboard
       Auth: Required (ADMIN)
       Response: {
         stock_summary,
         recent_transactions,
         pending_requests,
         unread_suggestions
       }
```

---

## 🔧 Service Layer

### **1. Motor Service** (`services/motor.service.ts`)

```typescript
class MotorService {
  // Read operations
  getAllMotors(filters: {search?, status?, limit?, offset?}): Promise<{motors, total}>
  getMotorById(id: string): Promise<Motor>
  getMotorStats(): Promise<{available, sold, total_value}>
  
  // Write operations
  createMotor(data: CreateMotorInput): Promise<Motor>
  updateMotor(id: string, data: UpdateMotorInput): Promise<Motor>
  deleteMotor(id: string): Promise<void>
  toggleStatus(id: string, status: string): Promise<Motor>
}
```

### **2. Transaction Service** (`services/transaction.service.ts`)

```typescript
class TransactionService {
  getAllTransactions(filters: {type?, month?, year?, limit?, offset?}): Promise<{transactions, total}>
  getTransactionById(id: string): Promise<Transaction>
  getTransactionSummary(month: string, year: string): Promise<{total_jual, total_beli, profit}>
  
  createTransaction(data: CreateTransactionInput): Promise<Transaction>
  updateTransaction(id: string, data: UpdateTransactionInput): Promise<Transaction>
  deleteTransaction(id: string): Promise<void>
  
  // Auto-update motor status on transaction
  markMotorAsSold(motor_id: string): Promise<void>
}
```

### **3. Sell Request Service** (`services/sellRequest.service.ts`)

```typescript
class SellRequestService {
  getAllRequests(filters: {status?, limit?, offset?}): Promise<{requests, total}>
  getRequestById(id: string): Promise<SellRequest>
  
  createRequest(data: CreateSellRequestInput): Promise<SellRequest>
  updateRequestStatus(id: string, status: string, admin_id?: string): Promise<SellRequest>
  deleteRequest(id: string): Promise<void>
  
  // Bulk operations
  getAllPending(): Promise<SellRequest[]>
  markAsContacted(id: string): Promise<void>
}
```

### **4. Suggestion Service** (`services/suggestion.service.ts`)

```typescript
class SuggestionService {
  getAllSuggestions(filters: {status?, limit?, offset?}): Promise<{suggestions, total}>
  getSuggestionById(id: string): Promise<Suggestion>
  
  createSuggestion(data: CreateSuggestionInput): Promise<Suggestion>
  updateStatus(id: string, status: string): Promise<Suggestion>
  deleteSuggestion(id: string): Promise<void>
  
  getUnreadCount(): Promise<number>
  getRecentSuggestions(limit: number): Promise<[]>
}
```

### **5. Receipt Service** (`services/receipt.service.ts`)

```typescript
class ReceiptService {
  // Generate receipt HTML
  generateReceiptHTML(transaction_id: string, companyInfo?: {name, address}): Promise<string>
  
  // Create receipt record
  createReceipt(transaction_id: string, admin_id: string, companyInfo?: {name, address}): Promise<Receipt>
  
  // Export to PDF
  exportPDF(transaction_id: string): Promise<Buffer>
  
  // Retrieve receipt
  getReceiptByTransactionId(transaction_id: string): Promise<Receipt>
}
```

### **6. Report Service** (`services/report.service.ts`)

```typescript
class ReportService {
  // Transaction reports
  getTransactionReport(month: string, year: string): Promise<{summary, details}>
  exportToCSV(month: string, year: string, type?: 'Jual'|'Beli'): Promise<string>
  
  // Inventory reports
  getInventoryReport(): Promise<{total, available, sold, by_merk}>
  
  // Dashboard summary
  getDashboardSummary(): Promise<{
    stock_summary,
    recent_transactions,
    pending_requests,
    unread_suggestions
  }>
}
```

### **7. Auth Service** (`services/auth.service.ts`)

```typescript
class AuthService {
  // Better Auth integration
  register(email: string, password: string, name: string): Promise<{user, token}>
  login(email: string, password: string): Promise<{user, token}>
  logout(user_id: string): Promise<void>
  getCurrentUser(token: string): Promise<User>
  
  // Helpers
  verifyToken(token: string): Promise<User>
  generateToken(user_id: string): string
}
```

---

## 🔐 Authentication Setup

### **Better Auth Configuration** (`config/auth.ts`)

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    usersTable: "users",
    provider: "pg"  // PostgreSQL
  }),
  emailAndPassword: {
    autoSignUpIfUserDoesNotExist: false,
    enabled: true,
  },
  session: {
    expiresIn: 24 * 60 * 60, // 24 hours
    cookieName: "bgm_session",
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },
  baseURL: process.env.AUTH_URL,
  secret: process.env.AUTH_SECRET,
  plugins: [],
});

export type Session = typeof auth.$Inferred.Session;
```

### **Auth Middleware** (`middleware/auth.middleware.ts`)

```typescript
export async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("No token provided");
    
    const user = await auth.api.getSession({ token });
    if (!user) throw new Error("Invalid token");
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

export async function adminOnly(req, res, next) {
  if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
```

---

## 📦 Implementation Checklist

### **Phase 1: Setup & Configuration**
- [ ] Initialize backend project with Express + TypeScript
- [ ] Setup PostgreSQL database
- [ ] Configure Drizzle ORM with migrations
- [ ] Setup Better Auth (user registration & login)
- [ ] Configure environment variables (.env)
- [ ] Setup CORS middleware for frontend integration
- [ ] Setup logging with Winston/Pino

### **Phase 2: Database Schema & Migrations**
- [ ] Create `users` table (via Better Auth)
- [ ] Create `motors` table
- [ ] Create `transactions` table
- [ ] Create `sellRequests` table
- [ ] Create `suggestions` table
- [ ] Create `receipts` table
- [ ] Create database indices for performance
- [ ] Setup relationships & foreign keys

### **Phase 3: Service Layer**
- [ ] Implement `MotorService`
- [ ] Implement `TransactionService`
- [ ] Implement `SellRequestService`
- [ ] Implement `SuggestionService`
- [ ] Implement `ReceiptService`
- [ ] Implement `ReportService`
- [ ] Implement `AuthService` (wrapper around Better Auth)

### **Phase 4: API Routes**
- [ ] Auth routes (login, register, logout, me)
- [ ] Motors CRUD routes
- [ ] Transactions CRUD routes
- [ ] Sell Requests CRUD routes
- [ ] Suggestions CRUD routes
- [ ] Receipt generation & export routes
- [ ] Reports & analytics routes

### **Phase 5: Middleware & Validation**
- [ ] Auth middleware with Better Auth
- [ ] Request validation with Zod schemas
- [ ] Error handling middleware
- [ ] CORS configuration
- [ ] File upload handling (Multer) for images

### **Phase 6: Utils & Helpers**
- [ ] ID generator (MTR-, TRX-, REQ-, SGT-, RCP- prefixes)
- [ ] Response formatter
- [ ] Logger setup
- [ ] File upload utilities
- [ ] Receipt HTML template

### **Phase 7: Testing & Deployment**
- [ ] Unit tests for services
- [ ] Integration tests for API routes
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database backup strategy
- [ ] Deployment configuration

---

## 🎯 Key Design Decisions

### 1. **Service Layer Isolation**
- Each service handles one domain (motors, transactions, etc.)
- Services are **not** aware of HTTP layer
- Easy to test, reuse, and maintain

### 2. **Better Auth Integration**
- Handles user authentication securely
- Session-based auth with JWT tokens
- Built-in password hashing & validation

### 3. **ID Generation Strategy**
- Prefixed IDs (MTR-, TRX-, REQ-, SGT-, RCP-) for easy identification
- Atomic ID generation to prevent duplicates
- Sequential numbering for readability

### 4. **Database Relationships**
```
Motor
  ├─ Transactions (1:Many) - when motor is sold
  ├─ Receipts (1:1) - via transaction

Transaction
  └─ Receipt (1:1)

User (Admin)
  ├─ Created Transactions
  ├─ Printed Receipts
  └─ Managed SellRequests

SellRequest
  ├─ Standalone (independent entity)
  └─ Can be converted to Motor (manual admin action)

Suggestion
  └─ Standalone feedback
```

### 5. **API Response Format**

**Success:**
```json
{
  "success": true,
  "data": { /* resource */ },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": { /* additional info */ }
}
```

### 6. **Frontend Integration**
- CORS enabled for `http://localhost:5173` (Vite dev server)
- API base URL: `http://localhost:3000/api`
- Token stored in `localStorage` on frontend
- Bearer token in Authorization header

---

## 🚀 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bagong_jaya_motor
DB_LOGGING=false

# Auth (Better Auth)
AUTH_URL=http://localhost:3000
AUTH_SECRET=your-secret-key-here

# Server
NODE_ENV=development
PORT=3000

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
MAX_FILE_SIZE=2097152 # 2MB in bytes
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=debug
```

---

## 📚 Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "typescript": "^5.0.0",
    "drizzle-orm": "^0.28.0",
    "drizzle-kit": "^0.20.0",
    "pg": "^8.11.0",
    "better-auth": "^1.0.0",
    "zod": "^3.22.0",
    "multer": "^1.4.5",
    "pino": "^8.16.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "bcrypt": "^5.1.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "@types/multer": "^1.4.11",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0"
  }
}
```

---

## 🔗 Frontend Integration Points

The frontend will communicate with backend via:

**Motor Catalog Page** → `GET /api/motors` (public or authenticated)
**Admin Stock Page** → `GET/POST/PUT/DELETE /api/motors` (admin only)
**Admin Dashboard** → `GET /api/reports/dashboard`
**Admin Transactions** → `GET/POST/PUT /api/transactions`
**Admin Requests** → `GET/PUT /api/requests`
**Admin Suggestions** → `GET /api/suggestions`
**Admin Reports** → `GET /api/reports/*`
**Public Sell Form** → `POST /api/requests` (create sell offer)
**Public Suggestions** → `POST /api/suggestions` (create feedback)
**Receipt Print** → `GET /api/receipts/:transaction_id`

---

## ✅ Summary

This backend plan provides:
- ✅ Scalable database schema with Drizzle ORM
- ✅ Secure authentication via Better Auth
- ✅ Clean service layer architecture
- ✅ Comprehensive API routes
- ✅ Proper separation of concerns
- ✅ Production-ready structure
- ✅ Easy to test and maintain
- ✅ Frontend integration ready

**Next Steps:**
1. Create backend repository/folder
2. Install dependencies
3. Setup database & migrations
4. Implement services (Phase 3)
5. Create API routes (Phase 4)
6. Test integration with frontend
