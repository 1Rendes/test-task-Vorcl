import Link from 'next/link';
import React from 'react';

const NavBar = () => {
  return (
    <div className="w-[294px] h-[33px] bg-nav-background rounded-md flex p-[2px] gap-[2px] mx-auto my-[130px] text-xs text-center leading-7">
      <Link
        href={'/'}
        className="text-nav-pink bg-[#121212] w-[100%] rounded-l-md "
      >
        audio
      </Link>
      <Link href={'/form'} className="text-white bg-[#121212] w-[100%]">
        form
      </Link>
      <Link
        href={'/stock'}
        className="text-white bg-[#121212] w-[100%] rounded-r-md"
      >
        stock
      </Link>
    </div>
  );
};

export default NavBar;
