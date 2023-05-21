import { Card } from "components/Card";
import type { NextPage } from "next";
import Link from "next/link";
import React from "react";
import EventsPage from "./events";
import { useRouter } from 'next/router'


const Home: NextPage = () => {
  const handleBuyTickets = () => {
    const element = document.getElementById('upcomingEvents');
    element?.scrollIntoView({behavior: "smooth"});
  };
  const router = useRouter()
  const navigateToCreate = () => {
    router.push('/create')
  }

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="flex flex-col items-center justify-center pt-0 pb-20 px-4 hero">
        <h1 className="text-7xl font-medium text-center mb-10">Welcome to TickeX</h1>
        <p className="text-2xl font-medium text-center">Your one-stop platform for secure and easy ticket transactions.</p>
        <p className="text-2xl font-medium text-center mb-10">Trade tickets freely on our NFT marketplace. No worries, no hassles.</p>
        <div className="mb-10 flex">
          <button onClick={navigateToCreate} className="mr-4 px-4 py-2 border-2 border-white font-bold hover:bg-gray-200 hover:text-black">CREATE EVENT</button>
          <button onClick={handleBuyTickets} className="px-4 py-2 border-2 border-white font-bold hover:bg-gray-200 hover:text-black">BUY TICKETS</button>
        </div>
      </div>
      <div className="w-full min-h-screen">
        <div id="upcomingEvents" className="w-full py-10 px-4">
          <h1 className="text-xl font-medium text-left mb-5">Upcoming Events</h1>
          <EventsPage/>
        </div>
      </div>
    </div>
  );
};

export default Home;