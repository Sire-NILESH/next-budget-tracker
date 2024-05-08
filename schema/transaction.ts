import { z } from "zod";

export const TransactionTypeEnum = z.enum(["income", "expense"]);

export const TransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string(),
  // type: z.union([z.literal("income"), z.literal("expense")]),
  type: TransactionTypeEnum,
});

export type TransactionSchemaType = z.infer<typeof TransactionSchema>;

export const CreateTransactionSchema = TransactionSchema;

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;

export const EditTransactionSchema = z.object({
  transactionId: z.string(),
  transactionPayload: TransactionSchema,
});

export type EditTransactionSchemaType = z.infer<typeof EditTransactionSchema>;
