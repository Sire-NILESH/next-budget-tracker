"use client";

import CreateCategoryDialog from "@/app/(dashboard)/_components/CreateCategoryDialog";
import DeleteCategoryDialog from "@/app/(dashboard)/_components/DeleteCategoryDialog";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import {
  EditIcon,
  PlusSquare,
  TrashIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback } from "react";
import EditCategoryDialog from "../../_components/EditCategoryDialog";

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  const categoryMutationSuccessCallback = useCallback(
    () => categoriesQuery.refetch(),
    [categoriesQuery]
  );

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-4 sm:gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <TrendingDown className="size-10 sm:size-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
              ) : (
                <TrendingUp className="size-10 sm:size-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div>
                <p className="">
                  {" "}
                  {type === "income" ? "Incomes" : "Expenses"} categories{" "}
                </p>
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              // successCallback={() => categoriesQuery.refetch()}
              successCallback={categoryMutationSuccessCallback}
              trigger={
                <Button className="w-full sm:w-auto gap-2 text-sm">
                  <PlusSquare className="h-4 w-4" />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {type}
              </span>
              categories yet
            </p>

            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-4 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard
                key={category.name}
                category={category}
                type={type}
                categoryMutationSuccessCallback={
                  categoryMutationSuccessCallback
                }
              />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

export default CategoryList;

function CategoryCard({
  category,
  type,
  categoryMutationSuccessCallback,
}: {
  category: Category;
  type: TransactionType;
  categoryMutationSuccessCallback: () => Promise<
    QueryObserverResult<any, Error>
  >;
}) {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-sm shadow-black/[0.1] dark:shadow-none overflow-hidden">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>

      <div className="flex divide-x divide-gray-300 dark:divide-gray-900">
        <DeleteCategoryDialog
          category={category}
          trigger={
            <Button
              className="flex w-full border-separate items-center gap-2 rounded-none text-muted-foreground hover:bg-red-500/20"
              variant={"secondary"}
              clickAnimation={"absent"}
            >
              <TrashIcon className="h-4 w-4" />
              Remove
            </Button>
          }
        />

        <EditCategoryDialog
          category={category}
          type={type}
          successCallback={() => categoryMutationSuccessCallback}
          trigger={
            <Button
              className="flex w-full border-separate items-center gap-2 rounded-none text-muted-foreground hover:bg-blue-500/20"
              variant={"secondary"}
              clickAnimation={"absent"}
            >
              <EditIcon className="h-4 w-4" />
              Edit
            </Button>
          }
        />
      </div>
    </div>
  );
}
