import { IEvent, IPartialEvent } from "../types";
import { eventAbi } from "./abi/eventAbi";
import { dAppAddress, provider, userAccount } from "./provider";

const contract = new provider.eth.Contract(eventAbi, dAppAddress);

export const searchEvent: (name: string) => Promise<IEvent> = async (name: string) => {
  try {
    const response = await contract.methods.searchEvent(name).call();
    return { name: response[0], description: response[1], location: response[2], date: parseInt(response[3]) } as IEvent;
  } catch (error: any) {
    throw error;
  }
};

export const createEvent = async (name: string, description: string, location: string, date: number) => {
  try {
    const account = await userAccount();
    await contract.methods.createEvent(name, description, location, date).send({ from: account });
    await contract.events.NewEvent({ filter: { user: account } });
  } catch (error: any) {
    throw error.message.slice(error.message.indexOf("'") + 1, error.message.length - 1);
  }
};

type getEventsResponse = {
  0: IPartialEvent["id"][];
  1: IPartialEvent["name"][];
  2: IPartialEvent["location"][];
};

export const getEvents = async () => {
  try {
    const response: getEventsResponse = await contract.methods.getEvents().call();

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
    const response = await contract.methods.getEvent(id).call();
    console.warn(response);

    return { name: response[0], description: response[1], location: response[2], date: parseInt(response[3]) };
  } catch (error: any) {
    throw error;
  }
};

export const userEvent = async () => {
  try {
    const account = await userAccount();
    const response: number = await contract.methods.userToEventId(account).call();

    return response;
  } catch (error) {
    throw error;
  }
};
