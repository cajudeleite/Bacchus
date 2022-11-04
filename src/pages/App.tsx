import React, { lazy, Suspense, useEffect, useState } from "react";
import { IEvent, IRoute, IUser } from "../types";
import Error from "./Error";
import Input from "../components/Input";
import Loading from "../components/Loading";
import LogIn from "./Login";
import Show from "./Show";
import Search from "./Search";
import "../index.css";
import { isUserConnected } from "../web3/provider";
import { addressToCoordinates } from "../api/geocoder";
import Create from "./Create";

const Map = lazy(() => import("./Map"));

const App = () => {
  const [route, setRoute] = useState<IRoute>("map");
  const [isLoading, setIsLoading] = useState(true);
  const [clientAddress, setClientAddress] = useState<string>("");
  const [event, setEvent] = useState<IEvent | undefined>();
  // const [eventUser, setEventUser] = useState<IUser | undefined>();
  const [clientCoordinates, setClientCoordinates] = useState<{
    lat: number | undefined;
    lng: number | undefined;
  }>({ lat: undefined, lng: undefined });
  const [triggerError, setTriggerError] = useState<boolean>(false);

  const checkIfUserIsConnected = async () => {
    const response = await isUserConnected();
    if (!response) setRoute("login");
  };

  useEffect(() => {
    checkIfUserIsConnected();

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

  const setCustomLocation = async (address: string) => {
    setIsLoading(true);
    try {
      const response = await addressToCoordinates(address);
      if (!response) throw response;

      const transformedCoords = response;
      localStorage.setItem("clientCoordinates", JSON.stringify(transformedCoords));
      setClientCoordinates(response);
      setRoute("map");
    } catch (error) {
      triggerShake(1000);
    }
    setIsLoading(false);
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
      <Suspense fallback={<Loading />}>
        {route === "map" && (
          <Map
            setRoute={setRoute}
            setIsLoading={setIsLoading}
            setEvent={setEvent}
            // setEventUser={setEventUser}
            clientCoordinates={clientCoordinates}
          />
        )}
        {route === "search" && (
          <Search
            setRoute={setRoute}
            setEvent={setEvent}
            setIsLoading={setIsLoading}
            // setEventUser={setEventUser}
          />
        )}
        {route === "create" && <Create setRoute={setRoute} setEvent={setEvent} setIsLoading={setIsLoading} />}
        {/* {route === "show" && event && eventUser && clientCoordinates && (
        <Show event={event} clientCoordinates={clientCoordinates} eventUser={eventUser} setRoute={setRoute} />
      )} */}
        {route === "login" && <LogIn setRoute={setRoute} />}
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
      </Suspense>
      {isLoading && <Loading />}
      <h1
        className="absolute bottom-4 severe-lower-case text-[2.5rem] text-white cursor-help opacity-80 hover:text-[2.75rem] hover:opacity-90"
        onClick={handleBacchus}
      >
        BACCHUS
      </h1>
    </section>
  );
};

export default App;
