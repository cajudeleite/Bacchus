import React, { useEffect, useState } from "react";
import { IRoute } from "../types";
import Button from "../components/Button";
import { connectToWallet } from "../web3/provider";

const Connection = ({
  setRoute,
  setIsLoading,
  setErrorText,
  setErrorCallback,
}: {
  setRoute: (input: IRoute) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<string | boolean>>;
  setErrorText: React.Dispatch<React.SetStateAction<string>>;
  setErrorCallback: React.Dispatch<React.SetStateAction<(() => () => void) | undefined>>;
}) => {
  const [userGotWallet, setUserGotWallet] = useState(false);

  useEffect(() => {
    setUserGotWallet(window.ethereum || window.web3);
    setIsLoading(false);
  }, [setIsLoading]);

  const connectWallet = async () => {
    setIsLoading("Connecting to wallet");
    try {
      await connectToWallet();
      window.location.reload();
    } catch (error: any) {
      setErrorText(error.message);
      setErrorCallback(() => () => connectWallet());
      setRoute("error");
    }
    setIsLoading(false);
  };

  if (userGotWallet)
    return (
      <section className="w-1/2 lg:w-1/3 xl:w-1/4">
        <Button text="Connect" onClick={connectWallet} size="full" />
      </section>
    );

  return (
    <section className="w-1/2 flex flex-col space-y-4 items-center text-white text-center">
      <p className="opacity-40">You don't have any wallet. We recommend downloading the MetaMask extension</p>
      <Button text="Get MetaMask" onClick={() => window.open("https://metamask.io/download/", "_blank")} variant="secondary" />
    </section>
  );
};

export default Connection;
