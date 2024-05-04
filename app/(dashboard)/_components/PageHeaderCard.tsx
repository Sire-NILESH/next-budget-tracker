import { cn } from "@/lib/utils";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const PageHeaderCard = React.forwardRef<HTMLDivElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("container", className)} {...props}>
        <div className="border bg-card rounded-lg px-8">{children}</div>
      </div>
    );
  }
);

PageHeaderCard.displayName = "PageHeaderCard";

export default PageHeaderCard;
