import React, { useEffect, useState } from "react";
import Home from "./Home";
import LogIn from "./Login";
import Register from "./Register";
import "./styles.scss";

const App = () => {
  const [route, setRoute] = useState<"home" | "login" | "register">("home");
  const [clientCoordinates, setClientCoordinates] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

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
      {route === "home" && <Home setRoute={setRoute} clientCoordinates={clientCoordinates} />}
      {route === "login" && <LogIn setRoute={setRoute} />}
      {route === "register" && <Register setRoute={setRoute} />}
      <h1 className="app__logo">MEDUSA</h1>
    </section>
  );
};

export default App;
