'use client;'

import Link from "next/link";
import { LinkQP } from "@/components/LinkQP";
import Image from 'next/image';
import { Suspense } from "react";

interface HeaderProps {
  homepage?: boolean;
}

export default function Header({ homepage = false }: HeaderProps) {
  const headerClass = homepage ? "flex w-full justify-between items-center px-20 py-6 border-b-[#323232] border-b border-solid" : "flex w-full justify-between items-center px-20 py-6 border-b-1 border-b-[#323232]";
  return (
    <>
      <header className={headerClass}>
        <Suspense > <LinkQP href="/">
          <div className="flex items-center gap-2">
            <Image src="/houseclick.svg" height={24} width={24} alt="HouseClick" />
            <p className="text-base font-['Noto Sans'] leading-[normal] font-black uppercase">House Click</p>
            <p className="text-[color:var(--click-badge-opaque-color-text-disabled,#808080)] text-[length:var(--typography-font-sizes-2,14px)] not-italic font-medium font-inter leading-[150%]">Not a real company</p>
          </div>
        </LinkQP></Suspense>


        <Link href="https://github.com/ClickHouse/ClickHouse">
          <div className="flex items-center gap-2">
            <div className="flex w-20 flex-col items-end">
              <span className="self-stretch"><p className="text-[#B3B6BD] text-right text-(length:--typography-font-sizes-1,12px) leading-[150%] font-medium font-inter">Powered by</p></span>
              <span className="self-stretch"><p className="text-[#FFF] text-right text-(length:--typography-font-sizes-1,12px) leading-[150%] font-bold font-inter">ClickHouse</p></span>
            </div>
            <Image src="/github.png" height={40} width={40} alt="Github" />
          </div>
        </Link>

      </header>
    </>
  );
}
