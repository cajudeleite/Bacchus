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
    console.log(error.response.status);
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
    console.log(data);
    return { data, status };
  } catch (error) {
    console.error(error);
  }
};
