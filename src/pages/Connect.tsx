import React, { useEffect, useState } from "react";
import { IRoute } from "../types";
import Button from "../components/Button";
import { connectToWallet } from "../web3/provider";

const Connect = ({ setRoute }: { setRoute: (input: IRoute) => void }) => {
  const [userGotWallet, setUserGotWallet] = useState(false);

  useEffect(() => {
    setUserGotWallet(window.ethereum || window.web3);
  }, []);

  const connectWallet = async () => {
    try {
      await connectToWallet();
      setRoute("map");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="flex flex-col space-y-4 items-center text-white text-center">
      {userGotWallet ? (
        <Button text="Connect" callback={connectWallet} />
      ) : (
        <>
          <p className="opacity-40">You don't have any wallet. We recommend downloading the MetaMask extension</p>
          <Button text="Get MetaMask" callback={() => window.open("https://metamask.io/download/", "_blank")} variant="secondary" />
        </>
      )}
    </section>
  );
};

export default Connect;
