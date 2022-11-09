import React, { lazy, Suspense, useEffect, useState } from "react";
import { IEvent, IRoute } from "../types";
import Error from "./Error";
import Loading from "../components/Loading";
import Connection from "./Connection";
import Show from "./Show";
import Search from "./Search";
import "../index.css";
import Create from "./Create";
import Location from "./Location";
import { isUserConnected } from "../web3/provider";

const Map = lazy(() => import("./Map"));

const App = () => {
  const [route, setRoute] = useState<IRoute>("map");
  const [isLoading, setIsLoading] = useState<boolean | string>(false);
  const [event, setEvent] = useState<IEvent | undefined>();
  const [clientCoordinates, setClientCoordinates] = useState<{
    lat: number;
    lng: number;
  }>();
  const [errorText, setErrorText] = useState("An error has occurred, please try again later");

  useEffect(() => {
    const checkIfUserIsConnected = async () => {
      try {
        await isUserConnected();

        if (!clientCoordinates) {
          setRoute("location");
        }
      } catch (error) {
        setRoute("connection");
      }
    };

    checkIfUserIsConnected();
  }, [clientCoordinates]);

  return (
    <section className="w-screen h-screen flex justify-center items-center bg-background">
      <Suspense fallback={<Loading />}>
        {route === "map" && clientCoordinates && (
          <Map setRoute={setRoute} setIsLoading={setIsLoading} setEvent={setEvent} clientCoordinates={clientCoordinates} />
        )}
        {route === "search" && <Search setRoute={setRoute} setIsLoading={setIsLoading} setEvent={setEvent} />}
        {route === "create" && <Create setRoute={setRoute} setIsLoading={setIsLoading} setEvent={setEvent} setErrorText={setErrorText} />}
        {route === "show" && event && clientCoordinates && <Show setRoute={setRoute} event={event} clientCoordinates={clientCoordinates} />}
        {route === "connection" && <Connection setRoute={setRoute} setIsLoading={setIsLoading} />}
        {route === "location" && (
          <Location
            setRoute={setRoute}
            setIsLoading={setIsLoading}
            clientCoordinates={clientCoordinates}
            setClientCoordinates={setClientCoordinates}
          />
        )}
        {route === "error" && <Error text={errorText} />}
      </Suspense>
      {isLoading && <Loading isLoading={isLoading} />}
      <h1
        className="absolute bottom-4 severe-lower-case text-[2.5rem] text-white cursor-help opacity-80 hover:text-[2.75rem] hover:opacity-90"
        onClick={() => setRoute(route === "map" ? "search" : "map")}
      >
        BACCHUS
      </h1>
    </section>
  );
};

export default App;
