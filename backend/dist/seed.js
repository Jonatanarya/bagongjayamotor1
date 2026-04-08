"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const drizzle_orm_1 = require("drizzle-orm");
const users_1 = require("./schema/users");
const motors_1 = require("./schema/motors");
const suggestions_1 = require("./schema/suggestions");
const transactions_1 = require("./schema/transactions");
const sellRequests_1 = require("./schema/sellRequests");
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
// Database connection
const connectionString = process.env.DATABASE_URL;
const client = (0, postgres_1.default)(connectionString, {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'bagong_jaya_motor',
});
const db = (0, postgres_js_1.drizzle)(client);
async function seed() {
    console.log('🌱 Starting database seeding...');
    try {
        // Check if admin user already exists
        const existingAdmin = await db.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.email, 'admin@bagongjaya.com')).limit(1);
        if (existingAdmin.length === 0) {
            // Seed admin user (without password - Better Auth manages this)
            console.log('Creating admin user...');
            await db.insert(users_1.users).values({
                id: 'admin-1',
                email: 'admin@bagongjaya.com',
                name: 'Administrator',
                password: await bcrypt_1.default.hash('admin123', 10),
                role: 'ADMIN',
            });
        }
        else {
            console.log('Admin user already exists, skipping...');
        }
        // Check if motors already exist
        const existingMotors = await db.select().from(motors_1.motors).limit(1);
        if (existingMotors.length === 0) {
            // Seed sample motors
            console.log('Creating sample motors...');
            await db.insert(motors_1.motors).values([
                {
                    id: 'motor-1',
                    merk: 'Honda',
                    tipe: 'Beat',
                    tahun: 2023,
                    harga: 18000000,
                    kilometer: 0,
                    status: 'Tersedia',
                    deskripsi: 'Honda Beat 2023 dalam kondisi baru, siap pakai.',
                    imageUrl: '/images/honda-beat-2023.jpg',
                },
                {
                    id: 'motor-2',
                    merk: 'Yamaha',
                    tipe: 'NMAX',
                    tahun: 2022,
                    harga: 25000000,
                    kilometer: 15000,
                    status: 'Tersedia',
                    deskripsi: 'Yamaha NMAX 2022 dengan kilometer rendah, perawatan rutin.',
                    imageUrl: '/images/yamaha-nmax-2022.jpg',
                },
                {
                    id: 'motor-3',
                    merk: 'Suzuki',
                    tipe: 'Satria F150',
                    tahun: 2021,
                    harga: 15000000,
                    kilometer: 25000,
                    status: 'Tersedia',
                    deskripsi: 'Suzuki Satria F150 2021, cocok untuk pemula.',
                    imageUrl: '/images/suzuki-satria-f150-2021.jpg',
                },
            ]);
        }
        else {
            console.log('Sample motors already exist, skipping...');
        }
        // Check if suggestions already exist
        const existingSuggestions = await db.select().from(suggestions_1.suggestions).limit(1);
        if (existingSuggestions.length === 0) {
            // Seed sample suggestions
            console.log('Creating sample suggestions...');
            await db.insert(suggestions_1.suggestions).values([
                {
                    id: 'suggestion-1',
                    customerName: 'John Doe',
                    message: 'Saya tertarik dengan Honda Beat yang ada di katalog. Apakah masih tersedia?',
                    email: 'john@example.com',
                    status: 'Unread',
                },
                {
                    id: 'suggestion-2',
                    customerName: 'Jane Smith',
                    message: 'Apakah ada diskon untuk pembelian cash?',
                    email: 'jane@example.com',
                    status: 'Unread',
                },
            ]);
        }
        else {
            console.log('Sample suggestions already exist, skipping...');
        }
        // Check if transactions already exist
        const existingTransactions = await db.select().from(transactions_1.transactions).limit(1);
        if (existingTransactions.length === 0) {
            // Seed sample transactions
            console.log('Creating sample transactions...');
            await db.insert(transactions_1.transactions).values([
                {
                    id: 'transaction-1',
                    type: 'Jual',
                    motorId: 'motor-1',
                    clientName: 'Ahmad Rahman',
                    clientWa: '081234567890',
                    amount: 18000000,
                    date: '2024-01-15',
                    notes: 'Pembelian Honda Beat cash',
                },
                {
                    id: 'transaction-2',
                    type: 'Beli',
                    clientName: 'Siti Aminah',
                    clientWa: '081987654321',
                    amount: 22000000,
                    date: '2024-01-20',
                    notes: 'Pembelian motor bekas dari customer',
                },
            ]);
        }
        else {
            console.log('Sample transactions already exist, skipping...');
        }
        // Check if sell requests already exist
        const existingSellRequests = await db.select().from(sellRequests_1.sellRequests).limit(1);
        if (existingSellRequests.length === 0) {
            // Seed sample sell requests
            console.log('Creating sample sell requests...');
            await db.insert(sellRequests_1.sellRequests).values([
                {
                    id: 'sell-request-1',
                    customerName: 'Budi Santoso',
                    customerWa: '081345678901',
                    customerAddress: 'Jl. Sudirman No. 123, Jakarta',
                    merk: 'Honda',
                    tipe: 'Vario',
                    tahun: 2020,
                    hargaPenawaran: 12000000,
                    deskripsi: 'Honda Vario 2020, kondisi baik, kilometer 30000',
                    status: 'Pending',
                },
            ]);
        }
        else {
            console.log('Sample sell requests already exist, skipping...');
        }
        console.log('✅ Database seeding completed successfully!');
        console.log('Admin user tersedia: admin@bagongjaya.com');
        console.log('Password default pengembangan: admin123');
    }
    catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
    finally {
        await client.end();
    }
}
// Run the seed function
seed().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map