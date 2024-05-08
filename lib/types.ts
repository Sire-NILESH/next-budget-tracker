import { z } from "zod";
import { type Transaction as DBTransaction } from "@prisma/client";
import { TransactionTypeEnum } from "@/schema/transaction";

export type Transaction = DBTransaction;
export type TransactionType = z.infer<typeof TransactionTypeEnum>;
export type Timeframe = "month" | "year";
export type Period = { year: number; month: number };
