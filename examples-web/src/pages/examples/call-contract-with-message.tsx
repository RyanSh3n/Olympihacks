import cn from "classnames";
import type { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import { wallet, isTestnet } from "config/constants";
import {
  sendTokenToDestChain,
  getBalance,
  generateRecipientAddress,
  truncatedAddress,
  sendMessageToAvalanche,
  getAvalancheMessage,
  getAvalancheSourceChain,
} from "helpers";

const CallContractWithMessage: NextPage = () => {
  const [msg, setMsg] = useState<string>("");
  const [sourceChain, setSourceChain] = useState<string>("");
  const [customRecipientAddress, setCustomRecipientAddress] =
    useState<string>("");
  const [recipientAddresses, setRecipientAddresses] = useState<string[]>([]);
  const [balances, setBalances] = useState<string[]>([]);
  const [senderBalance, setSenderBalance] = useState<string>();
  const [txhash, setTxhash] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState<string>("");

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData(e.currentTarget);
    const amount = formData.get("amount") as string;
    setLoading(true);
  
    try {
      // Send token to destination chain
      await sendTokenToDestChain(amount, recipientAddress);
      
      // Retrieve message from destination chain
      const message = await getAvalancheMessage();
      const sourceChain = await getAvalancheSourceChain();
      setMsg(message);
      setSourceChain(sourceChain);
    } catch (error) {
      console.error("Error sending token and retrieving message:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleOnGetMessage() {
    const _msg = await getAvalancheMessage();
    const _sourceChain = await getAvalancheSourceChain();
    console.log({
      _sourceChain,
    });
    setMsg(_msg);
    setSourceChain(_sourceChain);
  }

  const handleRefreshDestBalances = useCallback(async () => {
    const _balances = await getBalance(recipientAddresses, false);
    setBalances(_balances);
  }, [recipientAddresses]);

  const handleRefreshSrcBalances = useCallback(async () => {
    console.log(wallet.address)
    const [_balance] = await getBalance([wallet.address], true);
    setSenderBalance(_balance);
  }, []);

  const handleOnGenerateRecipientAddress = () => {
    const recipientAddress = generateRecipientAddress();
    setRecipientAddresses([...recipientAddresses, recipientAddress]);
  };

  const handleOnAddRecepientAddress = () => {
    setRecipientAddresses([...recipientAddresses, customRecipientAddress]);
    setCustomRecipientAddress("");
  };

  useEffect(() => {
    handleRefreshSrcBalances();
  }, [handleRefreshSrcBalances]);

  return (
    <div>
      <h1 className="text-4xl font-medium text-center">
        Send Tokens and Receive Messages Across Chains
      </h1>
      <div className="grid grid-cols-2 gap-20 mt-20 justify-items-center">
        {/* source chain card */}
        <div className="row-span-2 shadow-xl card w-96 bg-base-100">
          <figure
            className="h-64 bg-center bg-no-repeat bg-cover image-full"
            style={{ backgroundImage: "url('/assets/ethereum.gif')" }}
          />
          <div className="card-body">
            <h2 className="card-title">Ethereum (Token Sender)</h2>
  
            <p>
              Sender ({truncatedAddress(wallet.address)}) balance:{" "}
              {senderBalance}
            </p>
  
            <label className="label">
            <span className="label-text">Recipient</span>
            </label>
            <input
            disabled={loading}
            required
            name="recipient"
            type="text"
            placeholder="Enter recipient address"
            className="w-full input input-bordered"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
/>
  
            <div className="justify-end mt-2 card-actions">
              <form
                className="flex flex-col w-full"
                autoComplete="off"
                onSubmit={handleOnSubmit}
              >
                <div>
                  <label className="label">
                    <span className="label-text">Token amount</span>
                  </label>
                  <input
                    disabled={loading}
                    required
                    name="amount"
                    type="number"
                    placeholder="Enter amount to send"
                    className="w-full input input-bordered"
                  />
                </div>
                <button
                  className={cn("btn btn-primary mt-2", {
                    loading,
                    "opacity-30": loading,
                    "opacity-100": !loading,
                  })}
                  type="submit"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
  
        {/* Destination chain card */}
        <div className="row-span-1 shadow-xl card w-96 bg-base-100">
          <figure
            className="h-64 bg-center bg-no-repeat bg-cover image-full"
            style={{ backgroundImage: "url('/assets/avalanche.gif')" }}
          />
          <div className="card-body">
            <h2 className="card-title">Avalanche (Message Receiver)</h2>
            <div>
              <div className="w-full max-w-xs form-control">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <input
                  readOnly
                  type="text"
                  placeholder="Waiting for message..."
                  className="w-full max-w-xs input input-bordered"
                  value={msg}
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleOnGetMessage}
                >
                  Refresh Message
                </button>
                <p>Message source chain: {sourceChain}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default CallContractWithMessage;
