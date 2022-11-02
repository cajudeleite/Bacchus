import axios from "axios";

export const addressToCoordinates = async (address: string) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODING_TOKEN}`
    );

    if (response.data.status === "ZERO_RESULTS") throw new Error(`Couldn't find coordinates of ${address}`);

    const coords: { lat: number; lng: number } = response.data.results[0].geometry.location;

    return coords;
  } catch (error) {
    console.error(error);
  }
};
