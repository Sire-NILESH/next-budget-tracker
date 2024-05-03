import { PiggyBank, WalletMinimal } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      {/* <PiggyBank className="stroke h-11 w-11 stroke-amber-500 stroke-[1.5]" /> */}
      <WalletMinimal className="stroke h-10 w-10 stroke-amber-500" />
      <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        WalletWatch
      </p>
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href="/" className="flex items-center gap-2">
      <WalletMinimal className="stroke size-9 stroke-amber-500 stroke-[2]" />
      <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-2xl font-bold leading-tight tracking-tighter text-transparent">
        WalletWatch
      </p>
    </a>
  );
}

export default Logo;
