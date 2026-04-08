# 🚀 Quick Start & Reference Guide

## 📋 What's Included in This Plan

You now have **4 comprehensive documentation files** covering the complete backend implementation:

1. **BACKEND_IMPLEMENTATION_PLAN.md** — Overall architecture, database schema, API routes, services, authentication
2. **BACKEND_IMPLEMENTATION_DETAILS.md** — Code examples, patterns, middleware, error handling, validation
3. **BACKEND_DATA_FLOW.md** — Entity relationships, data flows, SQL patterns, indices, migrations
4. **QUICK_START.md** — This file! Quick reference and next steps

---

## 🎯 Project Overview

**Application:** Bagong Jaya Motor (Motorcycle Dealer Management)

**Backend Stack:**
- Framework: **ExpressJS** (Node.js)
- Database: **PostgreSQL** + **Drizzle ORM**
- Auth: **Better Auth** (bytebase/auth)
- Architecture: **Service-based** with clean separation

**Key Features:**
- 👤 Admin authentication & authorization
- 🏍️ Motorcycle inventory management
- 💰 Buy/sell transaction tracking
- 📝 Customer sell offers (requests)
- 💬 Customer feedback (suggestions)
- 🧾 Receipt generation & printing
- 📊 Monthly reports & analytics

---

## 📊 Database Entities (7 Tables)

| Table | Purpose | Records |
|:---|:---|:---|
| `users` | Admin authentication | Via Better Auth |
| `motors` | Stock management | MTR-001, MTR-002, ... |
| `transactions` | Buy/sell records | TRX-001, TRX-002, ... |
| `sell_requests` | Customer offers | REQ-001, REQ-002, ... |
| `suggestions` | Customer feedback | SGT-001, SGT-002, ... |
| `receipts` | Print records | RCP-001, RCP-002, ... |

---

## 🔗 API Endpoints (7 Routes)

```
POST   /api/auth/register              Register new admin
POST   /api/auth/login                  Admin login
POST   /api/auth/logout                 Admin logout
GET    /api/auth/me                     Current user info

GET    /api/motors                      List motorcycles (public/admin)
GET    /api/motors/:id                  Get single motorcycle
POST   /api/motors                      Create motorcycle (admin)
PUT    /api/motors/:id                  Update motorcycle (admin)
PATCH  /api/motors/:id/status           Toggle Tersedia/Terjual (admin)
DELETE /api/motors/:id                  Delete motorcycle (admin)
GET    /api/motors/dashboard/summary    Stock stats (admin)

GET    /api/transactions                List transactions (admin)
POST   /api/transactions                Record transaction (admin)
PUT    /api/transactions/:id            Update transaction (admin)
DELETE /api/transactions/:id            Delete transaction (admin)
GET    /api/transactions/summary        Monthly summary (admin)

POST   /api/requests                    Customer submits sell offer (public)
GET    /api/requests                    List requests (admin)
PUT    /api/requests/:id                Update request status (admin)
DELETE /api/requests/:id                Reject request (admin)

POST   /api/suggestions                 Submit feedback (public)
GET    /api/suggestions                 List suggestions (admin)
PATCH  /api/suggestions/:id/status      Mark as read/archived (admin)
DELETE /api/suggestions/:id             Delete suggestion (admin)

GET    /api/receipts/:transaction_id   Get receipt HTML (admin)
POST   /api/receipts/:transaction_id/print  Record print (admin)

GET    /api/reports/dashboard           Dashboard summary (admin)
GET    /api/reports/transactions        Monthly transactions (admin)
GET    /api/reports/inventory           Inventory report (admin)
GET    /api/reports/export/csv          Export to CSV (admin)
```

---

## 🔧 Service Layer (7 Services)

```
AuthService          → Login, register, logout, session management
MotorService         → CRUD operations on motorcycles
TransactionService   → Record & track buy/sell transactions
SellRequestService   → Handle customer sell offers
SuggestionService    → Manage customer feedback
ReceiptService       → Generate & print receipts
ReportService        → Analytics & export functionality
```

---

## 🛠️ Implementation Phases

### **Phase 1: Setup (Week 1)**
- [ ] Initialize Express + TypeScript project
- [ ] Setup PostgreSQL database
- [ ] Configure Drizzle ORM
- [ ] Setup Better Auth
- [ ] Configure environment variables

### **Phase 2: Database (Week 1-2)**
- [ ] Create all table schemas
- [ ] Create relationships & constraints
- [ ] Create indices for queries
- [ ] Setup data migrations

### **Phase 3: Services (Week 2-3)**
- [ ] AuthService — Session, JWT
- [ ] MotorService — CRUD, stats
- [ ] TransactionService — CRUD, summary
- [ ] SellRequestService — CRUD
- [ ] SuggestionService — CRUD
- [ ] ReceiptService — HTML generation
- [ ] ReportService — Analytics

### **Phase 4: Routes & Middleware (Week 3-4)**
- [ ] Auth routes (login, register, logout)
- [ ] Motor routes (CRUD + status)
- [ ] Transaction routes (CRUD + summary)
- [ ] Request routes (CRUD)
- [ ] Suggestion routes (CRUD)
- [ ] Receipt routes (view + print)
- [ ] Report routes (dashboard, export)
- [ ] Auth middleware (Better Auth)
- [ ] Validation middleware (Zod)
- [ ] Error handler middleware

### **Phase 5: Integration & Testing (Week 4-5)**
- [ ] Integration tests for all services
- [ ] API endpoint testing
- [ ] Frontend integration testing
- [ ] Error handling verification
- [ ] Performance optimization

### **Phase 6: Deployment (Week 5)**
- [ ] Generate API documentation
- [ ] Setup Docker containers
- [ ] Configure production database
- [ ] Deploy to production

---

## 📚 Key Concepts

### **Service Layer**
Each service is **stateless** and **isolated**. Services:
- Only handle business logic
- Don't know about HTTP
- Are easy to test
- Can be reused

```typescript
// ❌ Do NOT do this in service:
res.json({ data });

// ✅ Do this instead:
return { motors: [], total: 5 };
```

### **Route Isolation**
Each route file handles ONE domain:
- `motors.routes.ts` — Only motor operations
- `transactions.routes.ts` — Only transactions
- `suggestions.routes.ts` — Only suggestions

### **Better Auth**
Handles authentication securely:
- User registration & login
- Session management
- Password hashing
- JWT tokens
- CORS & cookies

### **ID Generation**
Prefixed IDs for easy identification:
- `MTR-001` → Motorcycle #1
- `TRX-001` → Transaction #1
- `REQ-001` → Request #1
- `SGT-001` → Suggestion #1
- `RCP-001` → Receipt #1

### **Error Handling**
Standard pattern across all routes:
```typescript
try {
  const result = await service.doSomething();
  sendResponse(res, 200, result);
} catch (error) {
  sendError(res, error);
}
```

---

## 📋 Checklist Before Coding

- [ ] PostgreSQL installed & running
- [ ] Create database: `createdb bagong_jaya_motor`
- [ ] Node.js 18+ installed
- [ ] Understand Express basics
- [ ] Understand Drizzle ORM concepts
- [ ] Understand Better Auth authentication
- [ ] Understand Zod validation
- [ ] TypeScript comfort level

---

## 🚀 Getting Started

### **1. Initialize Project**
```bash
mkdir backend
cd backend
npm init -y
npm install express typescript ts-node @types/express @types/node
npm install drizzle-orm drizzle-kit pg
npm install better-auth
npm install zod
npm install cors dotenv
npm install -D nodemon
```

### **2. Create Structure**
```bash
mkdir -p src/{config,schema,services,routes,middleware,types,utils}
mkdir -p migrations
touch .env .env.example
```

### **3. Setup tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### **4. Setup package.json Scripts**
```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:push": "drizzle-kit push:pg",
    "db:generate": "drizzle-kit generate:pg"
  }
}
```

### **5. Create .env**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/bagong_jaya_motor
AUTH_URL=http://localhost:3000
AUTH_SECRET=your-secret-key-here
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

### **6. First Migration**
```bash
npx drizzle-kit push:pg
```

---

## 📖 Usage Examples

### **Adding a Motor (Admin)**

**Frontend:**
```javascript
const response = await fetch('http://localhost:3000/api/motors', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    merk: 'Honda',
    tipe: 'CBR 250RR',
    tahun: 2022,
    harga: 58000000,
    kilometer: 5400,
    status: 'Tersedia',
    imageUrl: 'https://...'
  })
});
```

**Backend Service:**
```typescript
async createMotor(data: CreateMotorInput) {
  const id = await generateId('MTR'); // MTR-001
  const [motor] = await db.insert(motors).values({ ...data, id }).returning();
  return motor;
}
```

### **Listing Motors (Public)**

**Frontend:**
```javascript
const motors = await fetch('http://localhost:3000/api/motors?search=Honda&status=Tersedia').then(r => r.json());
```

**Backend Route:**
```typescript
router.get('/', async (req, res) => {
  const { search, status, limit = 10, offset = 0 } = req.query;
  const data = await motorService.getAllMotors({ search, status, limit, offset });
  sendResponse(res, 200, data);
});
```

### **Recording Transaction (Admin)**

**Frontend:**
```javascript
const trx = await fetch('http://localhost:3000/api/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    type: 'Jual',
    motorId: 'MTR-001',
    clientName: 'Budi Santoso',
    clientWa: '081234567890',
    amount: 58000000,
    date: '2026-04-07'
  })
}).then(r => r.json());
```

---

## 🔍 Common Patterns

### **Fetch All with Pagination**
```typescript
// Frontend
const { motors, total } = await fetch(
  `/api/motors?limit=10&offset=0`
).then(r => r.json());

// Backend
const { motors, total } = await motorService.getAllMotors({ limit: 10, offset: 0 });
```

### **Filter by Status**
```typescript
// Frontend
const available = await fetch('/api/motors?status=Tersedia').then(r => r.json());

// Backend
const { motors } = await motorService.getAllMotors({ status: 'Tersedia' });
```

### **Generate Monthly Report**
```typescript
// Frontend
const report = await fetch('/api/reports/transactions?month=04&year=2026', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// Backend
const report = await reportService.getTransactionReport('04', '2026');
```

---

## 🚨 Common Issues & Solutions

### **Issue: "Motor tidak ditemukan"**
**Cause:** Trying to fetch a motor that doesn't exist
**Solution:** Check ID format (MTR-001), ensure motor exists in DB

### **Issue: "Unauthorized" on every request**
**Cause:** Token not being sent or invalid
**Solution:** Verify `Authorization: Bearer <token>` header

### **Issue: CORS errors**
**Cause:** Frontend URL not in CORS whitelist
**Solution:** Add frontend URL to `CORS_ORIGIN` in .env

### **Issue: Database connection timeout**
**Cause:** PostgreSQL not running
**Solution:** Run `pg_ctl start` or start PostgreSQL service

### **Issue: "Duplicate entry" error on insert**
**Cause:** Unique constraint violation (same merk + tipe + tahun)
**Solution:** Check if motor already exists, use UPDATE instead

---

## 📚 Documentation Map

```
BACKEND_IMPLEMENTATION_PLAN.md
├── Project structure
├── Database schema (all 6 tables)
├── API routes (comprehensive)
├── Service layer (7 services)
├── Authentication with Better Auth
└── Implementation checklist

BACKEND_IMPLEMENTATION_DETAILS.md
├── Drizzle schema examples
├── Service implementations
├── Route implementations
├── Middleware patterns
├── Error handling
└── Validation schemas (Zod)

BACKEND_DATA_FLOW.md
├── Entity relationships
├── Data flow diagrams (7 flows)
├── SQL query patterns
├── Database indices
└── Migration strategy

QUICK_START.md (THIS FILE)
├── Quick reference
├── Implementation phases
├── Key concepts
├── Code examples
└── Common issues
```

---

## 🎓 Learning Path

**If you're new to these technologies:**

1. **Express.js** → Learn basic routing, middleware, error handling
2. **TypeScript** → Learn types, interfaces, generics
3. **PostgreSQL** → Learn SQL basics, joins, indexes
4. **Drizzle ORM** → Learn how to define schemas and queries
5. **Better Auth** → Learn authentication patterns
6. **Architecture** → Learn service-based architecture

**Recommended Reading Order:**
1. This QUICK_START.md
2. BACKEND_IMPLEMENTATION_PLAN.md (overview)
3. BACKEND_IMPLEMENTATION_DETAILS.md (code patterns)
4. BACKEND_DATA_FLOW.md (relationships)

---

## ✅ Success Criteria

Your backend is complete when:

- ✅ All 7 services implemented
- ✅ All API routes working
- ✅ All middleware active
- ✅ Database fully populated with examples
- ✅ Admin authentication working
- ✅ Frontend successfully communicates with backend
- ✅ All CRUD operations working
- ✅ Error handling consistent
- ✅ API follows response format
- ✅ Logs are visible for debugging

---

## 🤝 Integration with Frontend

The frontend expects:

```
BASE_URL = http://localhost:3000/api

// Auth
POST /auth/login → returns { token }
POST /auth/register → returns { token }

// Motors (public & admin)
GET /motors → returns { motors: [], total: number }
POST /motors → returns { motor }

// Transactions (admin)
POST /transactions → returns { transaction }

// Requests (public submit, admin view)
POST /requests → returns { request_id }

// Suggestions (public submit, admin view)
POST /suggestions → returns { suggestion_id }

// Receipts (admin)
GET /receipts/:id → returns HTML

// Reports (admin)
GET /reports/dashboard → returns { summary }
```

---

## 📞 Support Resources

- **Drizzle ORM:** https://orm.drizzle.team
- **Better Auth:** https://github.com/better-auth/better-auth
- **Express.js:** https://expressjs.com
- **PostgreSQL:** https://www.postgresql.org/docs
- **Zod:** https://zod.dev

---

## 🎯 Next Steps

1. ✅ Read this QUICK_START.md
2. ✅ Review BACKEND_IMPLEMENTATION_PLAN.md
3. 👉 **Create the backend folder & setup project** (Phase 1)
4. ✅ Install all dependencies
5. ✅ Setup PostgreSQL & .env
6. ✅ Create database schemas (Phase 2)
7. ✅ Implement services (Phase 3)
8. ✅ Create routes & middleware (Phase 4)
9. ✅ Test with frontend (Phase 5)
10. ✅ Deploy to production (Phase 6)

**Good luck! You've got a complete, production-ready backend plan! 🚀**
