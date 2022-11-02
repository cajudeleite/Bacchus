import { IEvent, IPartialEvent } from "../types";
import { eventAbi } from "./abi/eventAbi";
import { dAppAddress, provider, userAccount } from "./provider";

const contract = new provider.eth.Contract(eventAbi, dAppAddress);

export const searchEvent: (name: string) => Promise<IEvent> = async (name: string) => {
  try {
    const response: IEvent = await contract.methods.searchEvent(name).call();
    return response;
  } catch (error: any) {
    return error;
  }
};

export const createEvent = async (paramArray: (string | number)[]) => {
  const { name, description, location, date } = {
    name: paramArray[0],
    description: paramArray[1],
    location: paramArray[2],
    date: paramArray[3],
  };

  try {
    const response = await contract.methods.createEvent(name, description, location, date).send({ from: userAccount });
    return response;
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
