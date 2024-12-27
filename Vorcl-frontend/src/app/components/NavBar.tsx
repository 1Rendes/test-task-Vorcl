import Link from 'next/link';
import React from 'react';

export interface NavBarProps {}

const NavBar = ({}: NavBarProps) => {
  return (
    <div className="w-[294px] h-[33px] bg-nav-background rounded-md flex p-[2px] gap-[2px] mx-auto mt-[130px] text-xs text-center leading-7">
      <Link
        href={'/'}
        className="text-nav-pink bg-black w-[100%] rounded-l-md "
      >
        audio
      </Link>
      <Link href={'/form'} className="text-white bg-black w-[100%]">
        form
      </Link>
      <Link
        href={'/stock'}
        className="text-white bg-black w-[100%] rounded-r-md"
      >
        stock
      </Link>
    </div>
  );
};

export default NavBar;
