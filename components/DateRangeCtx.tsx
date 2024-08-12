import { startOfMonth } from "date-fns";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useState,
} from "react";

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeCtxProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const initialDateRange: DateRange = {
  from: startOfMonth(new Date()),
  to: new Date(),
};

export const DateRangeCtx = createContext<DateRangeCtxProps>({
  dateRange: initialDateRange,
  setDateRange: () => {},
});

export const DateRangeCtxProvider = ({ children }: PropsWithChildren) => {
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

  const setDateRangeHandler = useCallback((range: DateRange) => {
    setDateRange(range);
  }, []);

  return (
    <DateRangeCtx.Provider
      value={{ dateRange, setDateRange: setDateRangeHandler }}
    >
      {children}
    </DateRangeCtx.Provider>
  );
};
