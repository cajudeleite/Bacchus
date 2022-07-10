import React, { useEffect, useState } from "react";
import Home from "./Home";
import Loading from "./Loading";
import LogIn from "./Login";
import Register from "./Register";
import "./styles.scss";

const App = () => {
  const [route, setRoute] = useState<"home" | "login" | "register">("home");
  const [clientCoordinates, setClientCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCallback, setLoadingCallback] = useState<Promise<any>>();

  const activateLoading = (callback: Promise<any>) => {
    setLoadingCallback(callback);
    setIsLoading(true);
    return callback;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setClientCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  return (
    <section className="app">
      {isLoading ? (
        <Loading callback={loadingCallback} setIsLoading={setIsLoading} />
      ) : (
        (route === "home" && <Home setRoute={setRoute} clientCoordinates={clientCoordinates} />) ||
        (route === "login" && <LogIn setRoute={setRoute} activateLoading={activateLoading} />) ||
        (route === "register" && <Register setRoute={setRoute} activateLoading={activateLoading} />)
      )}
      {!isLoading && <h1 className="app__logo">MEDUSA</h1>}
    </section>
  );
};

export default App;
