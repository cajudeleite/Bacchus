import React, { useEffect, useState } from "react";
import { addressToCoordinates } from "../api/geocoder";
import Button from "../components/Button";
import Input from "../components/Input";
import { IRoute } from "../types";

const Location = ({
  setRoute,
  setIsLoading,
  setClientCoordinates,
}: {
  setRoute: React.Dispatch<React.SetStateAction<IRoute>>;
  setIsLoading: React.Dispatch<React.SetStateAction<string | boolean>>;
  setClientCoordinates: React.Dispatch<
    React.SetStateAction<
      | {
          lat: number;
          lng: number;
        }
      | undefined
    >
  >;
}) => {
  const [clientAddress, setClientAddress] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [triggerError, setTriggerError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Couldn't find coordinates of your address");

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        setClientCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          if (localStorage.getItem("clientCoordinates")) {
            setClientCoordinates(JSON.parse(localStorage.getItem("clientCoordinates") as string));
            setRoute("map");
          } else {
            setShowInput(true);
          }
        }
      }
    );
  }, [setClientCoordinates, setIsLoading, setRoute]);

  const setCustomLocation = async (address: string) => {
    setIsLoading(true);
    try {
      const response = await addressToCoordinates(address);

      const transformedCoords = response;
      localStorage.setItem("clientCoordinates", JSON.stringify(transformedCoords));
      setClientCoordinates(response);
      setRoute("map");
    } catch (error: any) {
      setErrorMessage(error.message);
      setTriggerError(true);
    }
    setIsLoading(false);
  };

  if (!showInput) return <h1 className="text-white opacity-40 text-center">Accept localisation</h1>;
  return (
    <div className="w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col space-y-4">
      <Input
        inputValue={clientAddress}
        onChange={(value) => setClientAddress(value)}
        onSubmit={() => setCustomLocation(clientAddress)}
        label={triggerError ? errorMessage : "What is your location?"}
        triggerError={triggerError}
        setTriggerError={setTriggerError}
      />
      {!triggerError && clientAddress && <Button text="Set location" onClick={() => setCustomLocation(clientAddress)} size="full" />}
    </div>
  );
};

export default Location;
