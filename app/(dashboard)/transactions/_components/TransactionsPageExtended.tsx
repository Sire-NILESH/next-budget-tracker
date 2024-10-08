"use client";

import TransactionTable from "@/app/(dashboard)/transactions/_components/TransactionTable";
import { DateRangeCtx } from "@/components/DateRangeCtx";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import { useContext } from "react";
import { toast } from "sonner";
import PageHeaderCard from "../../_components/PageHeaderCard";

function TransactionsPageExtended() {
  const { dateRange, setDateRange } = useContext(DateRangeCtx);

  return (
    <div className="h-full flex flex-col">
      <PageHeaderCard>
        <div className="flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Transactions history</p>
          </div>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              // We update the date range only if both dates are set

              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`
                );
                return;
              }

              setDateRange({ from, to });
            }}
          />
        </div>
      </PageHeaderCard>

      <div className="container h-full mt-4">
        <TransactionTable from={dateRange.from} to={dateRange.to} />
      </div>
    </div>
  );
}

export default TransactionsPageExtended;
