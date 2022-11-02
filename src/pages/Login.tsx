import React, { useEffect, useState } from "react";
import { IRoute } from "../types";
import Button from "../components/Button";
import { connectToWallet } from "../web3/provider";

const LogIn = ({ setRoute }: { setRoute: (input: IRoute) => void }) => {
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
    <section className="w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col space-y-4 items-center text-white">
      {userGotWallet ? <Button text="Connect" callback={connectWallet} /> : <p>You don't have any wallet</p>}
    </section>
  );
};

export default LogIn;
