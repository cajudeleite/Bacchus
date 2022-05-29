import React, { useState } from "react";
import Home from "./Home";
import Session from "./Session";
import "./styles.scss";

const App = () => {
  const [route, setRoute] = useState<"home" | "signin" | "signup">("home");

  return (
    <section className="app">
      {route === "home" && <Home setRoute={setRoute} />}
      {(route === "signin" || "signup") && <Session route={route} setRoute={setRoute} />}
    </section>
  );
};

export default App;
