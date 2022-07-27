import React, { useEffect, useState } from "react";
import { convertAddressToCoordinates } from "../api/address";
import { IEvent, IRoute, IUser } from "../types";
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
  const [loadingCallback, setLoadingCallback] = useState<Promise<any>>();
  const [clientAddress, setClientAddress] = useState<string>("");
  const [event, setEvent] = useState<IEvent | undefined>();
  const [eventUser, setEventUser] = useState<IUser | undefined>();
  const [showDots, setShowDots] = useState<boolean>(true);
  const [clientCoordinates, setClientCoordinates] = useState<{
    lat: number | undefined;
    lng: number | undefined;
  }>({ lat: undefined, lng: undefined });

  useEffect(() => {
    checkIfLocating();
  }, []);

  const checkIfLocating = () => {
    navigator.geolocation.watchPosition(
      () => {
        localStorage.removeItem("clientAddress");
        navigator.geolocation.getCurrentPosition((position) => {
          setClientCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        });
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
  };

  const activateLoading = (callback: Promise<any>) => {
    setLoadingCallback(callback);
    setIsLoading(true);
    return callback;
  };

  const setCustomLocation = async (address: string) => {
    try {
      const response = await activateLoading(convertAddressToCoordinates(address));
      const coords = response.data.coordinates.split(",");
      const transformedCoords = {
        lat: parseFloat(coords[0]),
        lng: parseFloat(coords[1]),
      };
      localStorage.setItem("clientCoordinates", JSON.stringify(transformedCoords));
      setClientCoordinates({ lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) });
      setClientAddress("");
    } catch (error) {
      console.error(error);
      setRoute("location");
    }
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
          event={event}
          setEvent={setEvent}
          eventUser={eventUser}
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
        />
      )}

      {isLoading ? (
        <Loading callback={loadingCallback} setIsLoading={setIsLoading} />
      ) : (
        <h1 className="app__logo" onClick={handleMedusa}>
          MEDUSA
        </h1>
      )}
    </section>
  );
};

export default App;
