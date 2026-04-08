import { db } from "../config/database.js";
import { motors, transactions, sellRequests, suggestions, receipts } from "../schema/index.js";
import { eq, desc, sql } from "drizzle-orm";

export async function generateId(prefix: string): Promise<string> {
  let table;
  let idColumn;

  switch (prefix) {
    case "MTR":
      table = motors;
      idColumn = motors.id;
      break;
    case "TRX":
      table = transactions;
      idColumn = transactions.id;
      break;
    case "REQ":
      table = sellRequests;
      idColumn = sellRequests.id;
      break;
    case "SGT":
      table = suggestions;
      idColumn = suggestions.id;
      break;
    case "RCP":
      table = receipts;
      idColumn = receipts.id;
      break;
    default:
      throw new Error(`Unknown prefix: ${prefix}`);
  }

  // Get the latest ID with this prefix
  const [latest] = await db
    .select({ id: idColumn })
    .from(table)
    .where(sql`${idColumn} LIKE ${prefix + "-%"}`)
    .orderBy(desc(idColumn))
    .limit(1);

  let nextNumber = 1;
  if (latest?.id) {
    const currentNumber = parseInt(latest.id.split("-")[1]);
    nextNumber = currentNumber + 1;
  }

  return `${prefix}-${nextNumber.toString().padStart(3, "0")}`;
}