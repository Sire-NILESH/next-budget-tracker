"use server";

import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
  EditCategorySchemaType,
  EditCategorySchema,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;
  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}

export async function EditCategory(form: EditCategorySchemaType) {
  const parsedBody = EditCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const current = parsedBody.data.current;
  const update = parsedBody.data.update;

  return await prisma.$transaction([
    prisma.category.update({
      where: {
        name_userId_type: {
          userId: user.id,
          name: current.name,
          type: current.type,
        },
      },
      data: {
        userId: user.id,
        icon: update.icon,
        name: update.name,
      },
    }),

    prisma.transaction.updateMany({
      where: {
        category: current.name,
        categoryIcon: current.icon,
      },
      data: {
        category: update.name,
        categoryIcon: update.icon,
      },
    }),
  ]);
}

export type EditCategoryResponseType = Awaited<ReturnType<typeof EditCategory>>;

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
}
