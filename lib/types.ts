import { TransactionTypeEnum } from "@/schema/categories";
import { z } from "zod";

export type TransactionType = z.infer<typeof TransactionTypeEnum>;
export type Timeframe = "month" | "year";
export type Period = { year: number; month: number };
