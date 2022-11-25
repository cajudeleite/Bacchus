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
import Logo from "../icons/Logo";

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
  const [errorCallback, setErrorCallback] = useState<() => () => void>();
  const [clientHasCoordinates, setClientHasCoordinates] = useState(false);

  useEffect(() => {
    if (clientCoordinates && !clientHasCoordinates) {
      setRoute("map");
      setClientHasCoordinates(true);
    }
  }, [clientCoordinates, clientHasCoordinates]);

  useEffect(() => {
    const checkIfUserIsConnected = async () => {
      try {
        await isUserConnected();

        if (!clientCoordinates) {
          setRoute("location");
          setIsLoading(false);
        }
      } catch (error: any) {
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
        {route === "connection" && (
          <Connection setRoute={setRoute} setIsLoading={setIsLoading} setErrorText={setErrorText} setErrorCallback={setErrorCallback} />
        )}
        {route === "location" && <Location setRoute={setRoute} setIsLoading={setIsLoading} setClientCoordinates={setClientCoordinates} />}
        {route === "error" && <Error text={errorText} onClick={errorCallback} />}
      </Suspense>
      {isLoading && <Loading isLoading={isLoading} />}
      <div
        className="w-20 hover:w-[86px] absolute bottom-6 text-white opacity-80 cursor-help hover:opacity-90"
        onClick={() => {
          if (route === "location") return;
          setRoute(route === "map" ? "search" : "map");
        }}
      >
        <Logo />
      </div>
    </section>
  );
};

export default App;
