import CreateTransactionDialog from "@/app/(dashboard)/_components/CreateTransactionDialog";
import History from "@/app/(dashboard)/_components/History";
import Overview from "@/app/(dashboard)/_components/Overview";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import PageHeaderCard from "./_components/PageHeaderCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "The Dashboard is the heart of WalletWatch, providing a comprehensive overview of your financial status at a glance. It displays your total income and expenses, neatly categorized for easy understanding. Interactive charts and graphs offer visual insights into your spending patterns and savings progress.",
};

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full">
      <PageHeaderCard>
        <div className="flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">Hello, {user.firstName}! 👋</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-950 hover:border-emerald-700 dark:border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                >
                  New income 🤑
                </Button>
              }
              type="income"
            />

            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-950 hover:border-rose-700 dark:border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                >
                  New expense 😤
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </PageHeaderCard>

      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
}

export default page;
