import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from 'components/ThemeToggle';
import { useRouter } from 'next/router';

export const Navbar = () => {
  const [logo, setLogo] = React.useState('/assets/tickex.svg');
  const handleBuyTickets = () => {
    if (router.pathname !== '/') {
      router.push('/').then(() => {
        const element = document.getElementById('upcomingEvents');
        element?.scrollIntoView({behavior: "smooth"});
      })
    } else {
      const element = document.getElementById('upcomingEvents');
      element?.scrollIntoView({behavior: "smooth"});
    }
  };
  const router = useRouter();
  const navigateToCreate = () => {
    router.push('/create')
  }
  return (
      <><header className="navbar bg-base-200 shadow-sm px-16 py-4 sticky top-0 z-50 border-b border-zinc-700 opacity-90">
      <Link href='/' className='cursor-pointer'>
        <Image width={128} height={32} src={logo} alt="tickex" />
      </Link>
      <nav className="menu menu-horizontal ml-4 flex-1">
      </nav>
      <ThemeToggle onThemeChange={(theme: string) => {
        if (theme === 'business') {
          setLogo('/assets/tickex.svg');
        } else {
          setLogo('/assets/tickexlight.svg');
        }
      } } />
        <button onClick={navigateToCreate} className="px-6 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 text-m mr-2">Create Event</button>
        <button onClick={handleBuyTickets} className="px-6 py-3 rounded-md border-2 border-zinc-800 text-white hover:bg-indigo-900 hover:border-indigo-400 text-m ml-2">Buy Tickets</button>
    </header></>
  );
};