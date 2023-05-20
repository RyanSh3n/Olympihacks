import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from 'components/ThemeToggle';

export const Navbar = () => {
    const [logo, setLogo] = React.useState('/assets/tickex.svg');
    return (
        <header className="navbar bg-base-200 shadow-sm px-16">
          <Image width={128} height={32} src={logo} alt="tickex" />
          <nav className="menu menu-horizontal ml-4 flex-1">
          </nav>
          <ThemeToggle onThemeChange={(theme: string) => {
            if (theme === 'business') {
              setLogo('/assets/tickex.svg');
            } else {
              setLogo('/assets/tickex.svg');
            }
          }} />
        </header>
    );
};
