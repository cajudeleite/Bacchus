import axios from "axios";

const server = axios.create({
  baseURL: "https://medusaink.herokuapp.com",
  // baseURL: "http://localhost:3000",
});

export const convertAddressToCoordinates = async (address: string) => {
  try {
    const { data, status } = await server.post("/convert_address", { address });
    return { data, status };
  } catch (error: any) {
    return error.response;
  }
};
