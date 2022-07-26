import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:3000",
});

export const convertAddressToCoordinates = async (address: string) => {
  try {
    const { data } = await server.post("/convert_address", { address });
    return { data };
  } catch (error: any) {
    console.error(error);
    return error.response;
  }
};
