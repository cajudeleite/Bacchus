import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:3000",
});

const headers: any = {
  Authorization: localStorage.getItem("token"),
};

export const searchEvent = async (name: string) => {
  try {
    const { data, status } = await server.post("/events/find_event", { name }, { headers });
    return { data, status };
  } catch (error: any) {
    return error.response;
  }
};

export const createEvent = async (paramArray: (string | number)[]) => {
  const event = {
    name: paramArray[0],
    description: paramArray[1],
    status: paramArray[2],
    address: paramArray[3],
    date: paramArray[4],
    invite_quantity: paramArray[5],
  };

  try {
    const { data, status } = await server.post("/events", { event }, { headers });
    return { data, status };
  } catch (error) {
    return error;
  }
};

export const getEvents = async () => {
  try {
    const { data, status } = await server.get("/events");
    return { data, status };
  } catch (error) {
    return error;
  }
};

export const getEvent = async (id: string) => {
  try {
    const response = await server.get(`/events/${id}`, { headers });
    return response;
  } catch (error: any) {
    return error.response;
  }
};
