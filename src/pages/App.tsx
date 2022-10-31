import React, { useEffect, useState } from "react";
import { convertAddressToCoordinates } from "../api/address";
import { IEvent, IRoute, IUser } from "../types";
import Error from "./Error";
import Input from "../components/Input";
import Loading from "../components/Loading";
import LogIn from "./Login";
import Register from "./Register";
import Show from "./Show";
import Map from "./Map";
import Search from "./Search";
import "../index.css";

const App = () => {
  const [route, setRoute] = useState<IRoute>("map");
  const [isLoading, setIsLoading] = useState(true);
  const [callbackSuccess, setCallbackSuccess] = useState<boolean | undefined>();
  const [clientAddress, setClientAddress] = useState<string>("");
  const [event, setEvent] = useState<IEvent | undefined>();
  const [eventUser, setEventUser] = useState<IUser | undefined>();
  const [clientCoordinates, setClientCoordinates] = useState<{
    lat: number | undefined;
    lng: number | undefined;
  }>({ lat: undefined, lng: undefined });
  const [triggerError, setTriggerError] = useState<boolean>(false);

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        setClientCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          if (localStorage.getItem("clientCoordinates")) {
            setClientCoordinates(JSON.parse(localStorage.getItem("clientCoordinates") as string));
            setRoute("map");
          } else {
            setRoute("location");
          }
          setIsLoading(false);
        }
      }
    );
  }, []);

  const triggerShake = (delay = 0) => {
    setTimeout(() => {
      setTriggerError(true);
      setTriggerError(false);
    }, delay);
  };

  const activateLoading = async (callback: Promise<any>) => {
    setIsLoading(true);
    try {
      const response = await callback;

      if (response.status >= 400) throw response;
      setCallbackSuccess(true);
      return response;
    } catch (e: any) {
      setCallbackSuccess(false);
      return { message: e.data.message, status: e.status };
    }
  };

  const setCustomLocation = async (address: string) => {
    try {
      const response: any = await activateLoading(convertAddressToCoordinates(address));
      const coords = response.data.coordinates.split(",");
      const transformedCoords = {
        lat: parseFloat(coords[0]),
        lng: parseFloat(coords[1]),
      };
      localStorage.setItem("clientCoordinates", JSON.stringify(transformedCoords));
      setClientCoordinates({ lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) });
      setRoute("map");
    } catch (error) {
      triggerShake(1000);
    }
    setClientAddress("");
  };

  const handleBacchus = () => {
    switch (route) {
      case "map":
        setRoute("search");
        break;

      default:
        setRoute("map");
        break;
    }
  };

  return (
    <section className="w-screen h-screen flex justify-center items-center bg-background">
      {route === "map" && (
        <Map
          setRoute={setRoute}
          setIsLoading={setIsLoading}
          setEvent={setEvent}
          setEventUser={setEventUser}
          activateLoading={activateLoading}
          clientCoordinates={clientCoordinates}
        />
      )}
      {route === "search" && <Search setRoute={setRoute} activateLoading={activateLoading} setEvent={setEvent} setEventUser={setEventUser} />}
      {route === "show" && event && eventUser && clientCoordinates && (
        <Show event={event} clientCoordinates={clientCoordinates} eventUser={eventUser} setRoute={setRoute} />
      )}
      {route === "login" && <LogIn setRoute={setRoute} activateLoading={activateLoading} />}
      {route === "register" && <Register setRoute={setRoute} activateLoading={activateLoading} />}
      {route === "location" && (
        <div className="w-1/2">
          <Input
            inputValue={clientAddress}
            setInputValue={setClientAddress}
            handleSubmit={() => setCustomLocation(clientAddress)}
            label="What is your location?"
            triggerError={triggerError}
          />
        </div>
      )}
      {route === "error" && <Error />}
      {isLoading ? (
        <Loading callbackSuccess={callbackSuccess} setIsLoading={setIsLoading} />
      ) : (
        <h1
          className="absolute bottom-4 severe-lower-case text-[2.5rem] text-white cursor-help opacity-80 hover:text-[2.75rem] hover:opacity-90"
          onClick={handleBacchus}
        >
          BACCHUS
        </h1>
      )}
    </section>
  );
};

export default App;
