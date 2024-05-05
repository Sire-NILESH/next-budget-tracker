import { Metadata } from "next";
import TransactionsPageExtended from "./_components/TransactionsPageExtended";

export const metadata: Metadata = {
  title: "Transactions",
  description:
    "The Transactions page is your personal ledger, listing all your financial transactions in an interactive table. It records every income and expense entry, complete with details like transaction date, category, amount, and note.",
};

function TransactionsPage() {
  return (
    <div>
      <TransactionsPageExtended />
    </div>
  );
}

export default TransactionsPage;
