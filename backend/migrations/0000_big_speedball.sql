CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"password" text,
	"role" varchar(50) DEFAULT 'ADMIN',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "motors" (
	"id" text PRIMARY KEY NOT NULL,
	"merk" varchar(100) NOT NULL,
	"tipe" varchar(100) NOT NULL,
	"tahun" integer NOT NULL,
	"harga" bigint NOT NULL,
	"kilometer" integer,
	"status" varchar(50) DEFAULT 'Tersedia',
	"image_url" text,
	"deskripsi" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "motors_merk_tipe_tahun_unique" UNIQUE("merk","tipe","tahun")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"motor_id" text,
	"client_name" text NOT NULL,
	"client_wa" text,
	"amount" bigint NOT NULL,
	"date" date NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sell_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"customer_wa" text NOT NULL,
	"customer_address" text NOT NULL,
	"merk" varchar(100) NOT NULL,
	"tipe" varchar(100) NOT NULL,
	"tahun" integer NOT NULL,
	"harga_penawaran" bigint NOT NULL,
	"deskripsi" text,
	"image_url" text,
	"status" varchar(50) DEFAULT 'Pending',
	"created_by_admin_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "suggestions" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_name" text,
	"message" text NOT NULL,
	"email" text,
	"status" varchar(50) DEFAULT 'Unread',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "receipts" (
	"id" text PRIMARY KEY NOT NULL,
	"transaction_id" text NOT NULL,
	"company_name" text DEFAULT 'BAGONG JAYA MOTOR',
	"company_address" text,
	"printed_at" timestamp,
	"printed_by_admin_id" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "receipts_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_motor_id_motors_id_fk" FOREIGN KEY ("motor_id") REFERENCES "public"."motors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_printed_by_admin_id_users_id_fk" FOREIGN KEY ("printed_by_admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;