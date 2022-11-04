import { IEvent, IPartialEvent } from "../types";
import { eventAbi } from "./abi/eventAbi";
import { dAppAddress, provider, userAccount } from "./provider";

const contract = new provider.eth.Contract(eventAbi, dAppAddress);

export const searchEvent: (name: string) => Promise<IEvent> = async (name: string) => {
  try {
    const response: IEvent = await contract.methods.searchEvent(name).call();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createEvent = async (name: string, description: string, location: string, date: number) => {
  try {
    const account = await userAccount();
    const response = await contract.methods.createEvent(name, description, location, date).send({ from: account });
    return { name, description, location, date, response };
  } catch (error: any) {
    return error;
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
    console.error(error);
    return [];
  }
};

export const getEvent = async (id: number) => {
  try {
    const response = await contract.methods.getEvent(id).call();
    return response;
  } catch (error: any) {
    return error;
  }
};

export const testGet = async () => {
  try {
    const response = await contract.methods.testGet().call();

    return response;
  } catch (error) {
    console.error(error);
  }
};
