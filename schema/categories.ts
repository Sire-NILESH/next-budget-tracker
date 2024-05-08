import { z } from "zod";
import { TransactionTypeEnum } from "./transaction";

export const CategorySchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  type: TransactionTypeEnum,
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = CategorySchema;

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;

export const EditCategorySchema = z.object({
  current: CategorySchema,
  update: CategorySchema,
});

export type EditCategorySchemaType = z.infer<typeof EditCategorySchema>;

export const DeleteCategorySchema = z.object({
  name: z.string().min(3).max(20),
  type: TransactionTypeEnum,
});

export type DeleteCategorySchemaType = z.infer<typeof DeleteCategorySchema>;
