import Web3 from "web3";

const wallet = window.ethereum || window.web3 || undefined;
export const provider = new Web3("http://127.0.0.1:8545/");

export const connectToWallet = async () => {
  try {
    await wallet.request({ method: "eth_requestAccounts" });
  } catch (error) {
    throw error;
  }
};

export const dAppAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const isUserConnected = async () => {
  try {
    if (!wallet) throw new Error("User doesn't have a wallet");
    const accounts = await wallet.request({ method: "eth_accounts" });

    if (accounts.length === 0) throw new Error("User is not connected");
  } catch (error) {
    throw error;
  }
};

export const userAccount = async () => (await wallet.request({ method: "eth_accounts" }))[0];
