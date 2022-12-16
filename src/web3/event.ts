import { IEvent, IPartialEvent } from "../types";
import { formatErrorFromContract } from "../utils";
import { eventAbi } from "./abi/eventAbi";
import { dAppAddress, provider, userAccount } from "./provider";

const contract = provider ? new provider.eth.Contract(eventAbi, dAppAddress) : null;

export const createEvent = async (name: string, description: string, location: string, date: number) => {
  try {
    if (!contract) throw new Error("User does not have a provider");
    const account = await userAccount();
    await contract.methods.createEvent(name, description, location, date).send({ from: account });
    await contract.events.NewEvent({ filter: { user: account } });
  } catch (error: any) {
    throw formatErrorFromContract(error);
  }
};

type getEventsResponse = {
  0: IPartialEvent["id"][];
  1: IPartialEvent["name"][];
  2: IPartialEvent["location"][];
};

export const getEvents = async () => {
  try {
    if (!contract) throw new Error("User does not have a provider");
    const account = await userAccount();
    const response: getEventsResponse = await contract.methods.getEvents().call({ from: account });

    const events: IPartialEvent[] = [];

    for (let i = 0; i < response[0].length; i++) {
      events.push({ id: response[0][i], name: response[1][i], location: response[2][i] });
    }

    return events;
  } catch (error: any) {
    throw error;
  }
};

export const getEvent: (id: number) => Promise<IEvent> = async (id: number) => {
  try {
    if (!contract) throw new Error("User does not have a provider");
    const account = await userAccount();
    const response = await contract.methods.getEvent(id).call({ from: account });

    return { name: response[0], description: response[1], location: response[2], username: response[3], date: new Date(parseInt(response[4])) };
  } catch (error: any) {
    throw error;
  }
};

export const getUserEvent = async () => {
  try {
    if (!contract) throw new Error("User does not have a provider");
    const account = await userAccount();
    const response: number = await contract.methods.getUserEvent().call({ from: account });

    return response;
  } catch (error) {
    throw error;
  }
};

export const searchEvent: (name: string) => Promise<IEvent> = async (name: string) => {
  try {
    if (!contract) throw new Error("User does not have a provider");
    const account = await userAccount();
    const response = await contract.methods.searchEvent(name).call({ from: account });
    return { name: response[0], description: response[1], location: response[2], date: new Date(parseInt(response[3])) } as IEvent;
  } catch (error: any) {
    throw formatErrorFromContract(error);
  }
};

export const updateEvent = async (name: string, description: string, location: string, date: number) => {
  try {
    if (!contract) throw new Error("User does not have a provider");
    const account = await userAccount();
    await contract.methods.updateEvent(name, description, location, date).send({ from: account });
    await contract.events.EventUpdated({ filter: { user: account } });
  } catch (error: any) {
    throw formatErrorFromContract(error);
  }
};

export const closeEvent = async () => {
  try {
    if (!contract) throw new Error("User does not have a provider");
    const account = await userAccount();
    await contract.methods.closeEvent().send({ from: account });
  } catch (error) {
    throw formatErrorFromContract(error);
  }
};
