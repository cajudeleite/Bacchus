import React, { useState } from "react";
import Home from "./Home";
import LogIn from "./Login";
import Register from "./Register";
import "./styles.scss";

const App = () => {
  const [route, setRoute] = useState<"home" | "login" | "register">("home");

  return (
    <section className="app">
      {route === "home" && <Home setRoute={setRoute} />}
      {route === "login" && <LogIn setRoute={setRoute} />}
      {route === "register" && <Register setRoute={setRoute} />}
      <h1 className="app__logo">MEDUSA</h1>
    </section>
  );
};

export default App;
