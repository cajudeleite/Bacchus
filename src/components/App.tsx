import React, { useEffect, useState } from "react";
import { convertAddressToCoordinates } from "../api/address";
import Home from "./Home";
import Input from "./Input";
import Loading from "./Loading";
import LogIn from "./Login";
import Register from "./Register";
import "./styles.scss";

const App = () => {
  const [route, setRoute] = useState<"home" | "login" | "register" | "location">("home");
  const [clientCoordinates, setClientCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCallback, setLoadingCallback] = useState<Promise<any>>();
  const [clientAddress, setClientAddress] = useState<string>("");

  const activateLoading = (callback: Promise<any>) => {
    setLoadingCallback(callback);
    setIsLoading(true);
    return callback;
  };

  const checkIfLocating = () => {
    navigator.geolocation.watchPosition(
      () => {
        localStorage.removeItem("clientAddress");
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
      console.log(clientCoordinates);
    } catch (error) {
      console.error(error);
      setRoute("location");
    }
  };

  useEffect(() => {
    checkIfLocating();
    navigator.geolocation.getCurrentPosition((position) => {
      setClientCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setIsLoading(false);
    });

    return () => {
      setClientCoordinates({ lat: null, lng: null });
    };
  }, []);

  return (
    <section className="app">
      {route === "home" && (
        <Home setRoute={setRoute} clientCoordinates={clientCoordinates} setIsLoading={setIsLoading} activateLoading={activateLoading} />
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

      {isLoading ? <Loading callback={loadingCallback} setIsLoading={setIsLoading} /> : <h1 className="app__logo">MEDUSA</h1>}
    </section>
  );
};

export default App;
