import Web3 from "web3";

const wallet = window.ethereum || window.web3 || undefined;
export const provider = new Web3("http://127.0.0.1:8545/");

export const connectToWallet = async () => {
  try {
    await wallet.request({ method: "eth_requestAccounts" });
  } catch (error) {
    console.error(error);
  }
};

export const dAppAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const isUserConnected = async () => {
  if (!wallet) return false;

  const accounts = await wallet.request({ method: "eth_accounts" });

  return accounts && accounts.length > 0;
};

export const userAccount = async () => (await wallet.request({ method: "eth_accounts" }))[0];
