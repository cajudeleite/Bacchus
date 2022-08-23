import React, { useEffect, useState } from "react";
import { convertAddressToCoordinates } from "../api/address";
import { IEvent, IRoute, IUser } from "../types";
import Error from "./Error";
import Home from "./Home";
import Input from "./Input";
import Loading from "./Loading";
import LogIn from "./Login";
import Register from "./Register";
import Show from "./Show";
import "./styles.scss";

const App = () => {
  const [route, setRoute] = useState<IRoute>("home");
  const [isLoading, setIsLoading] = useState(true);
  const [callbackSuccess, setCallbackSuccess] = useState<boolean | undefined>();
  const [clientAddress, setClientAddress] = useState<string>("");
  const [event, setEvent] = useState<IEvent | undefined>();
  const [eventUser, setEventUser] = useState<IUser | undefined>();
  const [showDots, setShowDots] = useState<boolean>(true);
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
            setRoute("home");
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
      setRoute("home");
    } catch (error) {
      triggerShake(1000);
    }
    setClientAddress("");
  };

  const handleMedusa = () => {
    switch (route) {
      case "home":
        setShowDots(!showDots);
        break;

      default:
        setRoute("home");
        break;
    }
  };

  return (
    <section className="app">
      {route === "home" && (
        <Home
          setRoute={setRoute}
          clientCoordinates={clientCoordinates}
          setIsLoading={setIsLoading}
          activateLoading={activateLoading}
          setEvent={setEvent}
          setEventUser={setEventUser}
          showDots={showDots}
          setShowDots={setShowDots}
        />
      )}
      {route === "show" && event && eventUser && clientCoordinates && (
        <Show event={event} clientCoordinates={clientCoordinates} eventUser={eventUser} />
      )}
      {route === "login" && <LogIn setRoute={setRoute} activateLoading={activateLoading} />}
      {route === "register" && <Register setRoute={setRoute} activateLoading={activateLoading} />}
      {route === "location" && (
        <Input
          inputValue={clientAddress}
          setInputValue={setClientAddress}
          handleSubmit={() => setCustomLocation(clientAddress)}
          label="What is your location?"
          triggerError={triggerError}
        />
      )}
      {route === "error" && <Error />}

      {isLoading ? (
        <Loading callbackSuccess={callbackSuccess} setIsLoading={setIsLoading} />
      ) : (
        <h1 className="app__logo" onClick={handleMedusa}>
          MEDUSA
        </h1>
      )}
    </section>
  );
};

export default App;
