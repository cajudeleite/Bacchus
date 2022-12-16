import { formatErrorFromContract } from "../utils";
import { eventAbi } from "./abi/eventAbi";
import { dAppAddress, provider, userAccount } from "./provider";

const contract = provider ? new provider.eth.Contract(eventAbi, dAppAddress) : null;

export const getMinAndMaxNameLength: () => Promise<[number, number]> = async () => {
  try {
    if (!contract) throw new Error("User does not have a provider");
    const account = await userAccount();
    const min: number = await contract.methods.nameMinLength().call({ from: account });
    const max: number = await contract.methods.nameMaxLength().call({ from: account });
    return [min, max];
  } catch (error) {
    throw formatErrorFromContract(error);
  }
};

export const getMinAndMaxUsernameLength: () => Promise<[number, number]> = async () => {
  try {
    if (!contract) throw new Error("User does not have a provider");
    const account = await userAccount();
    const min: number = await contract.methods.usernameMinLength().call({ from: account });
    const max: number = await contract.methods.usernameMaxLength().call({ from: account });
    return [min, max];
  } catch (error) {
    throw formatErrorFromContract(error);
  }
};

export const userFirstConnection = async () => {
  try {
    if (!contract) throw new Error("User does not have a provider");
    const account = await userAccount();
    const response: boolean = await contract.methods.userFirstConnection().call({ from: account });
    return response;
  } catch (error) {
    throw new Error("Connect to the Goerli testnet to use this app. It will be on the mainet soon... ");
  }
};

export const setUsername = async (username: string) => {
  try {
    if (!contract) throw new Error("User does not have a provider");
    const account = await userAccount();
    await contract.methods.setUsername(username).send({ from: account });
    await contract.events.UsernameSet({ filter: { user: account } });
  } catch (error) {
    throw formatErrorFromContract(error);
  }
};
