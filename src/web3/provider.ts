import Web3 from "web3";

const wallet = window.ethereum || window.web3 || undefined;

export const currentProvider = () => {
  if (window.ethereum) return new Web3(window.ethereum);
  if (window.web3) return new Web3(window.web3.currentProvider);
  return new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
};

export const provider = currentProvider();

export const connectToWallet = async () => {
  try {
    await wallet.request({ method: "eth_requestAccounts" });
  } catch (error) {
    throw error;
  }
};

export const dAppAddress = "0xC9999482D8Eb75B21b433c0e7bDa55b9A0075C6D";

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
