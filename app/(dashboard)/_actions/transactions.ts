"use server";

import prisma from "@/lib/prisma";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
  EditTransactionSchema,
  EditTransactionSchemaType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Decimal } from "decimal.js";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, description, type } = parsedBody.data;
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("category not found");
  }

  // NOTE: don't make confusion between $transaction ( prisma ) and prisma.transaction (table)

  await prisma.$transaction([
    // Create user transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // Update month aggregate table
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    // Update year aggreate
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}

export async function EditTransaction(form: EditTransactionSchemaType) {
  const parsedBody = EditTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const {
    transactionId,
    transactionPayload: { amount, category, date, description, type },
  } = parsedBody.data;

  const currentTransaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
  });

  if (!currentTransaction) {
    throw new Error("transaction not found");
  }

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("category not found");
  }

  // NOTE: don't make confusion between $transaction ( prisma ) and prisma.transaction (table)

  const currentAmount = new Decimal(currentTransaction.amount);
  const updateAmount = new Decimal(amount);

  const updateAmountVal = updateAmount.toNumber();

  const diffIsNegative = updateAmount.minus(currentAmount).isNegative();
  const absoluteValueOfDifference = updateAmount
    .minus(currentAmount)
    .absoluteValue()
    .toNumber();

  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        amount: updateAmountVal,
        category,
        // date,
        description,
        type,
      },
    });

    // escape if user didn't change the amount
    if (currentAmount.equals(updateAmount)) {
      return;
    }

    // Update month history
    await tx.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: currentTransaction.date.getUTCDate(),
          month: currentTransaction.date.getUTCMonth(),
          year: currentTransaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(diffIsNegative
          ? type === "income"
            ? {
                // when type is "income"
                income: {
                  decrement: absoluteValueOfDifference,
                },
              }
            : {
                // when type is "expense"
                expense: {
                  decrement: absoluteValueOfDifference,
                },
              }
          : type === "income"
          ? {
              // when type is "income"
              income: {
                increment: absoluteValueOfDifference,
              },
            }
          : {
              // when type is "expense"
              expense: {
                increment: absoluteValueOfDifference,
              },
            }),
      },
    });

    // Update year aggreate
    await tx.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: currentTransaction.date.getUTCMonth(),
          year: currentTransaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(diffIsNegative
          ? type === "income"
            ? {
                // when type is "income"
                income: {
                  decrement: absoluteValueOfDifference,
                },
              }
            : {
                // when type is "expense"
                expense: {
                  decrement: absoluteValueOfDifference,
                },
              }
          : type === "income"
          ? {
              // when type is "income"
              income: {
                increment: absoluteValueOfDifference,
              },
            }
          : {
              // when type is "expense"
              expense: {
                increment: absoluteValueOfDifference,
              },
            }),
      },
    });
  });
}
