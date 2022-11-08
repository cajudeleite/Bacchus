import { eventAbi } from "./abi/eventAbi";
import { dAppAddress, provider } from "./provider";

const contract = new provider.eth.Contract(eventAbi, dAppAddress);

export const getMinAndMaxNameLength: () => Promise<[number, number]> = async () => {
  try {
    const min: number = await contract.methods.nameMinLength().call();
    const max: number = await contract.methods.nameMaxLength().call();
    return [min, max];
  } catch (error) {
    throw error;
  }
};
