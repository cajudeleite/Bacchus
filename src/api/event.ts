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
    await server.post("/events", { event }, { headers });
  } catch (error: any) {
    console.error(error);
  }
};

export const getEventsNearby = async (clientCoordinates: { lat: number | undefined; lng: number | undefined }) => {
  try {
    const { data, status } = await server.post("/events/nearby", { latitude: clientCoordinates.lat, longitude: clientCoordinates.lng }, { headers });
    return { data, status };
  } catch (error: any) {
    return error.response;
  }
};

export const getEvent = async (id: string) => {
  try {
    const { data, status } = await server.get(`/events/${id}`, { headers });
    return { data, status };
  } catch (error: any) {
    return error.response;
  }
};

export const checkInvite = async (event_id: string, invite_id: string) => {
  const body = {
    event_id: event_id,
    invite_id: invite_id,
  };

  try {
    const { status } = await server.post("/events/use_invite", { ...body }, { headers });
    return { status };
  } catch (error: any) {
    return error.response;
  }
};
