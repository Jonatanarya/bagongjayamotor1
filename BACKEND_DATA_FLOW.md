# 📊 Database Relationships & Data Flow

---

## 🗂️ Entity Relationship Diagram

```
Users (Admin)
  ├── ID (PK)
  ├── EMAIL
  ├── NAME
  ├── ROLE (ADMIN | SUPER_ADMIN)
  └── TIMESTAMPS
      ├─┐ Printed Receipts (1:Many)
        └─ RECEIPTS.printed_by_admin_id
      └─┐ Created Transactions (1:Many)
        └─ TRANSACTIONS.created_by_admin_id (optional)


Motors
  ├── ID (PK: MTR-001)
  ├── MERK
  ├── TIPE
  ├── TAHUN
  ├── HARGA
  ├── KILOMETER ← NEW FIELD
  ├── STATUS (Tersedia | Terjual)
  ├── IMAGE_URL
  ├── DESKRIPSI
  └── TIMESTAMPS
      └─┐ Bought/Sold Via (1:Many)
        └─ TRANSACTIONS.motor_id
           └─┐ Receipt Generated (1:1)
             └─ RECEIPTS.transaction_id


Transactions
  ├── ID (PK: TRX-001)
  ├── TYPE (Jual | Beli)
  ├── MOTOR_ID (FK → Motors)
  ├── CLIENT_NAME
  ├── CLIENT_WA
  ├── AMOUNT
  ├── DATE
  ├── NOTES
  └── TIMESTAMPS
      └─┐ Has Receipt (1:1)
        └─ RECEIPTS.transaction_id


SellRequests (from public)
  ├── ID (PK: REQ-001)
  ├── CUSTOMER_NAME
  ├── CUSTOMER_WA
  ├── CUSTOMER_ADDRESS
  ├── MERK
  ├── TIPE
  ├── TAHUN
  ├── HARGA_PENAWARAN
  ├── DESKRIPSI
  ├── IMAGE_URL
  ├── STATUS (Pending | Contacted | Rejected | Accepted)
  ├── CREATED_BY_ADMIN_ID (FK → Users, nullable)
  └── TIMESTAMPS


Suggestions (from public)
  ├── ID (PK: SGT-001)
  ├── CUSTOMER_NAME
  ├── MESSAGE
  ├── EMAIL
  ├── STATUS (Unread | Read | Archived)
  └── CREATED_AT


Receipts
  ├── ID (PK: RCP-001)
  ├── TRANSACTION_ID (FK → Transactions, UNIQUE)
  ├── COMPANY_NAME
  ├── COMPANY_ADDRESS
  ├── PRINTED_AT
  ├── PRINTED_BY_ADMIN_ID (FK → Users)
  └── CREATED_AT
```

---

## 🔄 Data Flow Diagrams

### **Flow 1: Buying a Motor (Admin Perspective)**

```
Admin Dashboard (Frontend)
    ↓
    │ User wants to record a purchase
    │
    ↓ POST /api/transactions
    │ { type: 'Beli', clientName, clientWa, amount, date, motorId? }
    │
    ├─→ TransactionService.createTransaction()
    │   ├─→ Generate ID (generate-id.service)
    │   ├─→ Insert TRANSACTIONS record
    │   └─→ Emit event: transaction:created
    │
    └─→ Response: 201 Created { transaction }
        ↓
        Admin Dashboard updates
```

### **Flow 2: Selling a Motor (Admin + Stock Update)**

```
Admin Stock Page
    ↓
    │ Admin clicks "Toggle Status" on motor
    │
    ↓ PATCH /api/motors/:id/status
    │ { status: 'Terjual' }
    │
    ├─→ MotorService.toggleStatus()
    │   ├─→ Update MOTORS.status = 'Terjual'
    │   └─→ Return updated motor
    │
    └─→ Response: 200 OK { motor }
        ↓
        Alternative: Auto-update via POST /api/transactions
        when type = 'Jual' and motorId is provided
        ├─→ TransactionService.createTransaction()
        │   └─→ Automatically calls motorService.toggleStatus()
        └─→ Both TRANSACTIONS and MOTORS are updated atomically
```

### **Flow 3: Customer Submits Sell Offer**

```
Public Sell Motor Form (Frontend)
    ↓
    │ Customer fills form (nama, wa, merk, tipe, tahun, harga, alamat, image)
    │
    ↓ POST /api/requests (multipart/form-data)
    │
    ├─→ File Upload Middleware (Multer)
    │   └─→ Save image to /uploads folder
    │
    ├─→ SellRequestService.createRequest()
    │   ├─→ Generate ID (REQ-001, REQ-002, ...)
    │   ├─→ Insert SELL_REQUESTS record
    │   ├─→ Store image path
    │   └─→ Set status = 'Pending'
    │
    └─→ Response: 201 Created { requestId, message: "Penawaran terkirim" }
        ↓
        Admin Dashboard shows new pending request
        ↓
        Admin (via RequestPage) can:
        ├─→ PATCH /api/requests/:id → Update status to 'Contacted'
        ├─→ PATCH /api/requests/:id → Update status to 'Accepted'
        └─→ DELETE /api/requests/:id → Reject request
```

### **Flow 4: Customer Submits Suggestion**

```
Public Suggestion Form (Frontend)
    ↓
    │ Customer fills form (nama optional, pesan, email optional)
    │
    ↓ POST /api/suggestions
    │ { customerName?, message, email? }
    │
    ├─→ SuggestionService.createSuggestion()
    │   ├─→ Generate ID (SGT-001, SGT-002, ...)
    │   ├─→ Insert SUGGESTIONS record
    │   └─→ Set status = 'Unread'
    │
    └─→ Response: 201 Created { suggestionId }
        ↓
        Admin Dashboard:
        ├─→ GET /api/reports/dashboard  → Shows unread_suggestions count
        ├─→ GET /api/suggestions → Lists all suggestions
        └─→ PATCH /api/suggestions/:id/status → Mark as Read/Archived
```

### **Flow 5: Receipt Generation & Print**

```
Admin Transaction Page
    ↓
    │ Admin clicks "Print Receipt" on transaction
    │
    ↓ GET /api/receipts/:transaction_id
    │
    ├─→ ReceiptService.generateReceiptHTML()
    │   ├─→ Fetch transaction data from DB
    │   ├─→ Fetch motor data (merk, tipe, tahun)
    │   ├─→ Generate professional HTML template
    │   └─→ Include company info & signature area
    │
    ├─→ Response: 200 OK { html_content }
    │
    └─→ Frontend: Render HTML in modal/window
        ├─→ Preview displayed
        ├─→ User clicks "Print" → window.print()
        │
        └─→ POST /api/receipts/:transaction_id/print
            ├─→ ReceiptService.recordPrintHistory()
            │   ├─→ Create RECEIPTS record
            │   ├─→ Store print_time & admin_id
            │   └─→ Update TRANSACTIONS.receipt_generated_at
            │
            └─→ Response: 201 Created { receipt }
```

### **Flow 6: Dashboard Summary Report**

```
Admin Dashboard
    ↓
    │ Page loads
    │
    ↓ GET /api/reports/dashboard
    │
    ├─→ ReportService.getDashboardSummary()
    │   ├─→ MotorService.getMotorStats()
    │   │   └─→ SELECT COUNT(*) WHERE status='Tersedia' as available
    │   │       SELECT COUNT(*) WHERE status='Terjual' as sold
    │   │       SELECT SUM(harga) as total_value
    │   │
    │   ├─→ TransactionService.getRecentTransactions(limit: 5)
    │   │   └─→ SELECT * ORDER BY date DESC LIMIT 5
    │   │
    │   ├─→ SellRequestService.getAllPending()
    │   │   └─→ SELECT * WHERE status='Pending'
    │   │
    │   └─→ SuggestionService.getUnreadCount()
    │       └─→ SELECT COUNT(*) WHERE status='Unread'
    │
    └─→ Response: 200 OK {
          stock: { available, sold, total_value },
          recent_transactions: [...],
          pending_requests_count: 5,
          unread_suggestions_count: 8
        }
        ↓
        Frontend renders summary cards with real-time data
```

### **Flow 7: Monthly Transaction Report**

```
Admin Report Page
    ↓
    │ Admin selects Month (April) & Year (2026)
    │
    ↓ GET /api/reports/transactions?month=04&year=2026
    │
    ├─→ ReportService.getTransactionReport()
    │   ├─→ TransactionService.getTransactionSummary()
    │   │   └─→ SELECT SUM(amount) WHERE type='Jual' ∧ date IN month
    │   │       SELECT SUM(amount) WHERE type='Beli' ∧ date IN month
    │   │       Calculate: profit = jual - beli
    │   │
    │   └─→ TransactionService.getAllTransactions(month, year)
    │       └─→ Fetch all transactions for display in table
    │
    ├─→ Response: 200 OK {
    │     summary: { total_jual, total_beli, profit },
    │     transactions: [...]
    │   }
    │
    └─→ Frontend renders:
        ├─→ Summary cards with totals
        ├─→ Transaction table with filters
        └─→ Export CSV button
            └─→ GET /api/reports/export/csv?month=04&year=2026
                ├─→ ReportService.exportToCSV()
                │   └─→ Generate CSV data
                └─→ Download CSV file
```

---

## 🔗 Data Relationships

### **One-to-Many**

```
User (1) ──→ (Many) Transactions [created_by]
User (1) ──→ (Many) Receipts [printed_by]
Motor (1) ──→ (Many) Transactions [linked to purchase]
```

### **One-to-One**

```
Transaction (1) ──→ (1) Receipt
Motor ──→ Latest Transaction (when sold)
```

### **Standalone**

```
SellRequest (Independent)
  - No FK to Motor initially
  - Admin manually reviews & decides to:
    a) Create new Motor entry (convert to stock), OR
    b) Reject the offer, OR
    c) Mark as contacted for negotiation

Suggestion (Independent)
  - Public feedback, not linked to any transaction
  - Admin reads & archives for future improvement
```

---

## 📈 Database Query Patterns

### **Get Motor Availability Stats (Dashboard)**
```sql
SELECT 
  COUNT(*) FILTER (WHERE status = 'Tersedia') as available_count,
  COUNT(*) FILTER (WHERE status = 'Terjual') as sold_count,
  COALESCE(SUM(harga), 0) as total_inventory_value
FROM motors;
```

### **Get Monthly Profit Report**
```sql
SELECT 
  COALESCE(SUM(CASE WHEN type = 'Jual' THEN amount ELSE 0 END), 0) as total_jual,
  COALESCE(SUM(CASE WHEN type = 'Beli' THEN amount ELSE 0 END), 0) as total_beli,
  COALESCE(SUM(CASE WHEN type = 'Jual' THEN amount ELSE 0 END), 0) - 
  COALESCE(SUM(CASE WHEN type = 'Beli' THEN amount ELSE 0 END), 0) as profit
FROM transactions
WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2;
```

### **Get Recent Transactions with Motor Info**
```sql
SELECT 
  t.id,
  t.type,
  t.date,
  t.client_name,
  m.merk,
  m.tipe,
  t.amount
FROM transactions t
LEFT JOIN motors m ON t.motor_id = m.id
ORDER BY t.date DESC
LIMIT 5;
```

### **Get Pending Sell Requests**
```sql
SELECT *
FROM sell_requests
WHERE status = 'Pending'
ORDER BY created_at DESC;
```

### **Get Unread Suggestions Count**
```sql
SELECT COUNT(*) as unread_count
FROM suggestions
WHERE status = 'Unread';
```

---

## 🎯 Database Indices for Performance

```sql
-- Motors table
CREATE UNIQUE INDEX idx_motor_unique_combination 
ON motors(merk, tipe, tahun);

CREATE INDEX idx_motor_status 
ON motors(status);

CREATE INDEX idx_motor_created_at 
ON motors(created_at DESC);

-- Transactions table
CREATE INDEX idx_transaction_type_date 
ON transactions(type, date);

CREATE INDEX idx_transaction_motor_id 
ON transactions(motor_id);

CREATE INDEX idx_transaction_date 
ON transactions(date DESC);

-- SellRequests table
CREATE INDEX idx_sell_request_status 
ON sell_requests(status);

CREATE INDEX idx_sell_request_created_at 
ON sell_requests(created_at DESC);

-- Suggestions table
CREATE INDEX idx_suggestion_status 
ON suggestions(status);

CREATE INDEX idx_suggestion_created_at 
ON suggestions(created_at DESC);

-- Receipts table
CREATE INDEX idx_receipt_transaction_id 
ON receipts(transaction_id);

CREATE INDEX idx_receipt_printed_at 
ON receipts(printed_at DESC);
```

---

## 🔐 Data Integrity Rules

### **Motors Table**
- Cannot have duplicate (merk + tipe + tahun) combinations
- Status must be either 'Tersedia' or 'Terjual'
- Price must be positive integer
- Year between 1900-2100

### **Transactions Table**
- Type must be 'Jual' or 'Beli'
- Amount must be positive
- motorId (if present) must reference existing motor
- Date must be valid date

### **SellRequests Table**
- customerWa must follow Indonesian format (08...)
- Status can only transition: Pending → Contacted/Rejected/Accepted
- Cannot delete request once marked as Accepted

### **Suggestions Table**
- Can only be created (no update after creation)
- Status transitions: Unread → Read/Archived → Can be deleted after Archived

### **Receipts Table**
- Each transaction can have only 1 receipt (unique constraint)
- Cannot update printed_at after creation
- printedByAdminId must reference existing admin user

---

## 💾 Data Migration Strategy

### **Migration 1: Initial Schema**
```
- Create users table (via Better Auth)
- Create motors table
- Create transactions table
- Create sell_requests table
- Create suggestions table
- Create receipts table
- Create all indices
```

### **Migration 2: Add Features**
```
- Add 'kilometer' column to motors
- Add 'email' column to suggestions
- Add 'notes' column to transactions
```

### **Migration 3: Add Audit Trail**
```
- Add 'updated_by_admin_id' to transactions
- Add 'audit_logs' table for tracking changes
- Add soft_delete flags to sensitive tables
```

---

This comprehensive data flow documentation provides clarity on how all entities interact and the proper implementation approach for the backend system.
