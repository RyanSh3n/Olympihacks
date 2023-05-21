import { Card } from "components/Card";
import type { NextPage } from "next";
import Link from "next/link";
import React from "react";

const Home: NextPage = () => {
  const handleBuyTickets = () => {
    const element = document.getElementById('upcomingEvents');
    element?.scrollIntoView({behavior: "smooth"});
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="flex flex-col items-center justify-center pt-0 pb-20 px-4 hero">
        <h1 className="text-7xl font-medium text-center mb-10">Welcome to TickeX</h1>
        <p className="text-2xl font-medium text-center">Your one-stop platform for secure and easy ticket transactions.</p>
        <p className="text-2xl font-medium text-center mb-10">Trade tickets freely on our NFT marketplace. No worries, no hassles.</p>
        <div className="mb-10 flex">
          <Link href='/create'><button className="mr-4 px-4 py-2 border-2 border-white font-bold hover:bg-gray-200 hover:text-black">CREATE EVENT</button></Link>
          <button onClick={handleBuyTickets} className="px-4 py-2 border-2 border-white font-bold hover:bg-gray-200 hover:text-black">BUY TICKETS</button>
        </div>
      </div>
      <div className="w-full bg-gray-500 min-h-screen">
        <div id="upcomingEvents" className="w-full py-10 px-4">
          <h1 className="text-xl font-medium text-left mb-5">Upcoming Events</h1>
          <div className="flex flex-wrap justify-center mt-8">
              <Card
                classname="mx-2 my-2"
                title="Send NFTs Between Chains"
                description="Send a NFT token from source chain to the destination chain"
                url="/examples/nft-linker"
              />
              <Card
                classname="mx-2 my-2"
                title="Send NFTs Between Chains"
                description="Send a NFT token from source chain to the destination chain"
                url="/examples/nft-linker"
              />
              <Card
                classname="mx-2 my-2"
                title="Send NFTs Between Chains"
                description="Send a NFT token from source chain to the destination chain"
                url="/examples/nft-linker"
              />
              <Card
                classname="mx-2 my-2"
                title="Send NFTs Between Chains"
                description="Send a NFT token from source chain to the destination chain"
                url="/examples/nft-linker"
              />
              <Card
                classname="mx-2 my-2"
                title="Send NFTs Between Chains"
                description="Send a NFT token from source chain to the destination chain"
                url="/examples/nft-linker"
              />
              <Card
                classname="mx-2 my-2"
                title="Send NFTs Between Chains"
                description="Send a NFT token from source chain to the destination chain"
                url="/examples/nft-linker"
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
