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
        <h1 className="text-7xl font-medium text-center mb-8">Welcome to TickeX</h1>
        <p className="text-2xl font-medium text-center">Your one-stop platform for secure and easy ticket transactions.</p>
        <p className="text-2xl font-medium text-center mb-8">Trade tickets freely on our NFT marketplace. No worries, no hassles.</p>
        <div className="mb-10 flex">
          <button onClick={navigateToCreate} className="mt-4 px-8 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 text-lg mr-2">Create Event</button>
          <button onClick={handleBuyTickets} className="mt-4 px-8 py-3 rounded-md border-2 border-zinc-800 text-white hover:bg-indigo-900 hover:border-indigo-400 text-lg ml-2">Buy Tickets</button>
        </div>
      </div>
      <div className="w-full min-h-screen">
        <div id="upcomingEvents" className="w-full py-10 px-4">
          <h1 className="text-xl font-medium text-left mb-5">UPCOMING EVENTS</h1>
          <EventsPage/>
        </div>
      </div>
    </div>
  );
};

export default Home;