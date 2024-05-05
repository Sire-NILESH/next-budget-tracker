import { siteConfig } from "@/config/site";
import { WalletMinimal } from "lucide-react";
import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <WalletMinimal className="stroke h-10 w-10 stroke-amber-500" />
      <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        {siteConfig.title}
      </p>
    </Link>
  );
}

export function LogoMobile() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <WalletMinimal className="stroke size-9 stroke-amber-500 stroke-[2]" />
      <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-2xl font-bold leading-tight tracking-tighter text-transparent">
        {siteConfig.title}
      </p>
    </Link>
  );
}

export default Logo;
