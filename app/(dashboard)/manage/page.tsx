import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import PageHeaderCard from "../_components/PageHeaderCard";
import CategoryList from "./_components/CategoryList";

export const metadata: Metadata = {
  title: "Manage",
  description:
    "The Manage page is your control center for customizing WalletWatch to fit your unique financial needs. Here, you can add, edit, or delete categories to better classify your income and expenses. You can also set your preferred currency for a personalized experience.",
};

function page() {
  return (
    <>
      {/* HEADER */}
      <PageHeaderCard>
        <div className="flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </PageHeaderCard>
      {/* END HEADER */}
      <div className="container flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
}

export default page;
