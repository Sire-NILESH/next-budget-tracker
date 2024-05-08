import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-tertiary relative flex h-screen w-full flex-col items-center justify-center">
      {children}
    </div>
  );
}

export default layout;
