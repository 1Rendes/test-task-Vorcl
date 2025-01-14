'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavBar = () => {
  const url = usePathname();
  const isAudio = url === '/' ? 'text-nav-pink' : 'text-white';
  const isForm = url === '/form' ? 'text-nav-blue' : 'text-white';
  const isStock = url === '/stock' ? 'text-nav-blue' : 'text-white';

  return (
    <div className="w-[294px] h-[33px] bg-nav-background rounded-md flex p-[2px] gap-[2px] mx-auto mt-[130px] text-xs text-center leading-7">
      <Link
        href={'/'}
        className={`${isAudio} bg-[#121212] w-[100%] rounded-l-md `}
      >
        audio
      </Link>
      <Link href={'/form'} className={`${isForm} bg-[#121212] w-[100%]`}>
        form
      </Link>
      <Link
        href={'/stock'}
        className={`${isStock} bg-[#121212] w-[100%] rounded-r-md`}
      >
        stock
      </Link>
    </div>
  );
};

export default NavBar;
