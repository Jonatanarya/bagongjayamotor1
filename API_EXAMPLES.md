# 📡 API Request & Response Examples

## Response Format Standard

All API responses follow this format:

### ✅ Success Response
```json
{
  "success": true,
  "data": { /* resource or array */ },
  "message": "Operation description"
}
```

### ❌ Error Response
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": { /* optional: validation errors */ }
}
```

---

## 🔐 Authentication Endpoints

### POST `/api/auth/register`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bagongjaya.com",
    "password": "SecurePass123!",
    "name": "Admin Bagong Jaya"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123abc",
      "email": "admin@bagongjaya.com",
      "name": "Admin Bagong Jaya",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

---

### POST `/api/auth/login`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bagongjaya.com",
    "password": "SecurePass123!"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123abc",
      "email": "admin@bagongjaya.com",
      "name": "Admin Bagong Jaya",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

### POST `/api/auth/logout`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { "success": true },
  "message": "Logout successful"
}
```

---

### GET `/api/auth/me`

**Request:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "usr_123abc",
    "email": "admin@bagongjaya.com",
    "name": "Admin Bagong Jaya",
    "role": "ADMIN"
  },
  "message": "User retrieved"
}
```

---

## 🏍️ Motors Endpoints

### GET `/api/motors` (Public)

**Request with Filters:**
```bash
curl "http://localhost:3000/api/motors?search=Honda&status=Tersedia&limit=10&offset=0"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "motors": [
      {
        "id": "MTR-001",
        "merk": "Honda",
        "tipe": "CBR 250RR",
        "tahun": 2022,
        "harga": 58000000,
        "kilometer": 5400,
        "status": "Tersedia",
        "imageUrl": "https://example.com/motor1.jpg",
        "deskripsi": "Engine 250cc, good condition",
        "createdAt": "2026-04-01T10:30:00Z",
        "updatedAt": "2026-04-01T10:30:00Z"
      },
      {
        "id": "MTR-002",
        "merk": "Honda",
        "tipe": "Vario 160",
        "tahun": 2022,
        "harga": 22000000,
        "kilometer": 3500,
        "status": "Tersedia",
        "imageUrl": "https://example.com/motor2.jpg",
        "deskripsi": "Automatic scooter, pristine",
        "createdAt": "2026-04-02T11:15:00Z",
        "updatedAt": "2026-04-02T11:15:00Z"
      }
    ],
    "total": 2
  },
  "message": "Motors retrieved successfully"
}
```

---

### GET `/api/motors/:id` (Public)

**Request:**
```bash
curl http://localhost:3000/api/motors/MTR-001
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "MTR-001",
    "merk": "Honda",
    "tipe": "CBR 250RR",
    "tahun": 2022,
    "harga": 58000000,
    "kilometer": 5400,
    "status": "Tersedia",
    "imageUrl": "https://example.com/motor1.jpg",
    "deskripsi": "Engine 250cc, sport bike, good condition",
    "createdAt": "2026-04-01T10:30:00Z",
    "updatedAt": "2026-04-01T10:30:00Z"
  },
  "message": "Motor retrieved"
}
```

---

### POST `/api/motors` (Admin Only)

**Request:**
```bash
curl -X POST http://localhost:3000/api/motors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "merk": "Yamaha",
    "tipe": "YZF-R15",
    "tahun": 2023,
    "harga": 45000000,
    "kilometer": 1200,
    "status": "Tersedia",
    "imageUrl": "https://example.com/yamaha-r15.jpg",
    "deskripsi": "Latest model, full service record"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "MTR-005",
    "merk": "Yamaha",
    "tipe": "YZF-R15",
    "tahun": 2023,
    "harga": 45000000,
    "kilometer": 1200,
    "status": "Tersedia",
    "imageUrl": "https://example.com/yamaha-r15.jpg",
    "deskripsi": "Latest model, full service record",
    "createdAt": "2026-04-07T14:22:00Z",
    "updatedAt": "2026-04-07T14:22:00Z"
  },
  "message": "Motor created successfully"
}
```

---

### PUT `/api/motors/:id` (Admin Only)

**Request:**
```bash
curl -X PUT http://localhost:3000/api/motors/MTR-001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "harga": 57000000,
    "kilometer": 5450
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "MTR-001",
    "merk": "Honda",
    "tipe": "CBR 250RR",
    "tahun": 2022,
    "harga": 57000000,
    "kilometer": 5450,
    "status": "Tersedia",
    "imageUrl": "https://example.com/motor1.jpg",
    "deskripsi": "Engine 250cc, good condition",
    "createdAt": "2026-04-01T10:30:00Z",
    "updatedAt": "2026-04-07T15:45:00Z"
  },
  "message": "Motor updated successfully"
}
```

---

### PATCH `/api/motors/:id/status` (Admin Only)

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/motors/MTR-001/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"status": "Terjual"}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "MTR-001",
    "merk": "Honda",
    "tipe": "CBR 250RR",
    "tahun": 2022,
    "harga": 58000000,
    "kilometer": 5400,
    "status": "Terjual",
    "imageUrl": "https://example.com/motor1.jpg",
    "deskripsi": "Engine 250cc, good condition",
    "createdAt": "2026-04-01T10:30:00Z",
    "updatedAt": "2026-04-07T16:00:00Z"
  },
  "message": "Status updated"
}
```

---

### DELETE `/api/motors/:id` (Admin Only)

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/motors/MTR-005 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { "success": true },
  "message": "Motor deleted"
}
```

---

### GET `/api/motors/dashboard/summary` (Admin Only)

**Request:**
```bash
curl -X GET http://localhost:3000/api/motors/dashboard/summary \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "available_count": 24,
    "sold_count": 12,
    "total_value": 1450000000
  },
  "message": "Statistics retrieved"
}
```

---

## 💰 Transactions Endpoints

### POST `/api/transactions` (Admin Only)

**Request:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "Jual",
    "motorId": "MTR-001",
    "clientName": "Budi Santoso",
    "clientWa": "081234567890",
    "amount": 58000000,
    "date": "2026-04-07",
    "notes": "Negotiated price, paid in full"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "TRX-001",
    "type": "Jual",
    "motorId": "MTR-001",
    "clientName": "Budi Santoso",
    "clientWa": "081234567890",
    "amount": 58000000,
    "date": "2026-04-07",
    "notes": "Negotiated price, paid in full",
    "createdAt": "2026-04-07T10:45:00Z",
    "updatedAt": "2026-04-07T10:45:00Z"
  },
  "message": "Transaction recorded successfully"
}
```

*Note: Motor status automatically changes to "Terjual"*

---

### GET `/api/transactions?month=04&year=2026` (Admin Only)

**Request:**
```bash
curl "http://localhost:3000/api/transactions?month=04&year=2026&limit=10&offset=0" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TRX-001",
        "type": "Jual",
        "motorId": "MTR-001",
        "clientName": "Budi Santoso",
        "clientWa": "081234567890",
        "amount": 58000000,
        "date": "2026-04-07",
        "notes": "Full payment",
        "createdAt": "2026-04-07T10:45:00Z"
      },
      {
        "id": "TRX-002",
        "type": "Beli",
        "motorId": null,
        "clientName": "Siti Rahayu",
        "clientWa": "089876543210",
        "amount": 28000000,
        "date": "2026-04-06",
        "notes": "Purchase for resale",
        "createdAt": "2026-04-06T09:20:00Z"
      }
    ],
    "total": 2
  },
  "message": "Transactions retrieved"
}
```

---

### GET `/api/transactions/summary?month=04&year=2026` (Admin Only)

**Request:**
```bash
curl "http://localhost:3000/api/transactions/summary?month=04&year=2026" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalJual": 500000000,
    "totalBeli": 350000000,
    "profit": 150000000
  },
  "message": "Summary retrieved"
}
```

---

## 📝 Sell Requests Endpoints

### POST `/api/requests` (Public)

**Request (multipart/form-data):**
```bash
curl -X POST http://localhost:3000/api/requests \
  -F "customerName=Doni Setiawan" \
  -F "customerWa=081234567890" \
  -F "customerAddress=Jl. Contoh No. 12, Kota XYZ" \
  -F "merk=Honda" \
  -F "tipe=Beat" \
  -F "tahun=2019" \
  -F "hargaPenawaran=8500000" \
  -F "deskripsi=Good condition, original paint" \
  -F "image=@/path/to/motor-photo.jpg"
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "REQ-001",
    "customerName": "Doni Setiawan",
    "customerWa": "081234567890",
    "customerAddress": "Jl. Contoh No. 12, Kota XYZ",
    "merk": "Honda",
    "tipe": "Beat",
    "tahun": 2019,
    "hargaPenawaran": 8500000,
    "deskripsi": "Good condition, original paint",
    "imageUrl": "/uploads/req-001-motor.jpg",
    "status": "Pending",
    "createdAt": "2026-04-07T14:15:00Z"
  },
  "message": "Penawaran terkirim"
}
```

---

### GET `/api/requests?status=Pending` (Admin Only)

**Request:**
```bash
curl "http://localhost:3000/api/requests?status=Pending" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "REQ-001",
        "customerName": "Doni Setiawan",
        "customerWa": "081234567890",
        "customerAddress": "Jl. Contoh No. 12, Kota XYZ",
        "merk": "Honda",
        "tipe": "Beat",
        "tahun": 2019,
        "hargaPenawaran": 8500000,
        "deskripsi": "Good condition, original paint",
        "imageUrl": "/uploads/req-001-motor.jpg",
        "status": "Pending",
        "createdByAdminId": null,
        "createdAt": "2026-04-07T14:15:00Z"
      }
    ],
    "total": 1
  },
  "message": "Requests retrieved"
}
```

---

### PUT `/api/requests/:id` (Admin Only)

**Request:**
```bash
curl -X PUT http://localhost:3000/api/requests/REQ-001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"status": "Contacted"}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "REQ-001",
    "customerName": "Doni Setiawan",
    "customerWa": "081234567890",
    "customerAddress": "Jl. Contoh No. 12, Kota XYZ",
    "merk": "Honda",
    "tipe": "Beat",
    "tahun": 2019,
    "hargaPenawaran": 8500000,
    "deskripsi": "Good condition, original paint",
    "imageUrl": "/uploads/req-001-motor.jpg",
    "status": "Contacted",
    "createdByAdminId": "usr_123abc",
    "createdAt": "2026-04-07T14:15:00Z",
    "updatedAt": "2026-04-07T16:30:00Z"
  },
  "message": "Request status updated"
}
```

---

## 💬 Suggestions Endpoints

### POST `/api/suggestions` (Public)

**Request:**
```bash
curl -X POST http://localhost:3000/api/suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Andi Wijaya",
    "message": "Pelayanannya sangat ramah dan profesional. Motor yang dijual kondisinya sangat baik. Semoga terus berkembang!",
    "email": "andi@example.com"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "SGT-001",
    "customerName": "Andi Wijaya",
    "message": "Pelayanannya sangat ramah dan profesional. Motor yang dijual kondisinya sangat baik. Semoga terus berkembang!",
    "email": "andi@example.com",
    "status": "Unread",
    "createdAt": "2026-04-07T15:45:00Z"
  },
  "message": "Saran berhasil dikirim"
}
```

---

### GET `/api/suggestions?status=Unread` (Admin Only)

**Request:**
```bash
curl "http://localhost:3000/api/suggestions?status=Unread" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "SGT-001",
      "customerName": "Andi Wijaya",
      "message": "Pelayanannya sangat ramah dan profesional. Motor yang dijual kondisinya sangat baik. Semoga terus berkembang!",
      "email": "andi@example.com",
      "status": "Unread",
      "createdAt": "2026-04-07T15:45:00Z"
    },
    {
      "id": "SGT-002",
      "customerName": "Rina Kusuma",
      "message": "Tolong tambah pilihan motor matic lebih banyak lagi. Terima kasih.",
      "email": "rina@example.com",
      "status": "Unread",
      "createdAt": "2026-04-06T14:20:00Z"
    }
  ],
  "message": "Suggestions retrieved"
}
```

---

### PATCH `/api/suggestions/:id/status` (Admin Only)

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/suggestions/SGT-001/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"status": "Read"}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "SGT-001",
    "customerName": "Andi Wijaya",
    "message": "Pelayanannya sangat ramah dan profesional. Motor yang dijual kondisinya sangat baik. Semoga terus berkembang!",
    "email": "andi@example.com",
    "status": "Read",
    "createdAt": "2026-04-07T15:45:00Z"
  },
  "message": "Status updated"
}
```

---

## 🧾 Receipts Endpoints

### GET `/api/receipts/:transaction_id` (Admin Only)

**Request:**
```bash
curl http://localhost:3000/api/receipts/TRX-001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "html": "<html><body><div style='... complete HTML for receipt ...'></div></body></html>"
  },
  "message": "Receipt generated"
}
```

---

### POST `/api/receipts/:transaction_id/print` (Admin Only)

**Request:**
```bash
curl -X POST http://localhost:3000/api/receipts/TRX-001/print \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "companyName": "BAGONG JAYA MOTOR",
    "companyAddress": "Jl. Contoh No. 123, Kota XYZ"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "RCP-001",
    "transactionId": "TRX-001",
    "companyName": "BAGONG JAYA MOTOR",
    "companyAddress": "Jl. Contoh No. 123, Kota XYZ",
    "printedAt": "2026-04-07T16:45:00Z",
    "printedByAdminId": "usr_123abc",
    "createdAt": "2026-04-07T16:45:00Z"
  },
  "message": "Receipt printed"
}
```

---

## 📊 Reports Endpoints

### GET `/api/reports/dashboard` (Admin Only)

**Request:**
```bash
curl http://localhost:3000/api/reports/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stock_summary": {
      "available_count": 24,
      "sold_count": 12,
      "total_value": 1450000000
    },
    "recent_transactions": [
      {
        "id": "TRX-001",
        "type": "Jual",
        "date": "2026-04-07",
        "clientName": "Budi Santoso",
        "amount": 58000000
      }
    ],
    "pending_requests_count": 3,
    "unread_suggestions_count": 5
  },
  "message": "Dashboard summary retrieved"
}
```

---

### GET `/api/reports/transactions?month=04&year=2026` (Admin Only)

**Request:**
```bash
curl "http://localhost:3000/api/reports/transactions?month=04&year=2026" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_jual": 500000000,
      "total_beli": 350000000,
      "profit": 150000000
    },
    "transactions": [
      {
        "id": "TRX-001",
        "type": "Jual",
        "date": "2026-04-07",
        "clientName": "Budi Santoso",
        "motor": "Honda CBR 250RR",
        "amount": 58000000
      }
    ]
  },
  "message": "Report generated"
}
```

---

### GET `/api/reports/export/csv?month=04&year=2026` (Admin Only)

**Request:**
```bash
curl "http://localhost:3000/api/reports/export/csv?month=04&year=2026" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  --output laporan-04-2026.csv
```

**Response (200 OK with CSV download):**
```csv
ID,Tipe,Tanggal,Klien,Motor,Nominal
TRX-001,Jual,2026-04-07,Budi Santoso,Honda CBR 250RR,58000000
TRX-002,Beli,2026-04-06,Siti Rahayu,Yamaha XSR 155,28000000
TRX-003,Jual,2026-04-05,Ahmad Fauzi,Kawasaki Ninja ZX25R,110000000
```

---

## ❌ Error Response Examples

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "path": ["merk"],
      "message": "Merk harus diisi"
    },
    {
      "path": ["harga"],
      "message": "Harga harus positif"
    }
  ]
}
```

###Unauthorized (401)
```json
{
  "success": false,
  "error": "Missing authorization header",
  "code": "UNAUTHORIZED"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "error": "Admin access required",
  "code": "FORBIDDEN"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Motor tidak ditemukan",
  "code": "MOTOR_NOT_FOUND"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

---

## 🔄 Complete Frontend Integration Example

```typescript
// services/api.ts
const API_BASE = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

export async function apiCall(method, endpoint, body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data.data;
}

// Usage in component
async function fetchMotors() {
  const { motors, total } = await apiCall('GET', '/motors?status=Tersedia');
  setMotors(motors);
}

async function createTransaction(txData) {
  const transaction = await apiCall('POST', '/transactions', txData);
  return transaction;
}
```

---

This document shows you exactly what to expect when calling each API endpoint!
