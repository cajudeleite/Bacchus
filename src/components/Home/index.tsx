import React, { useState } from "react";
import "./styles.scss";
import Dots from "./dots";
import MainInput from "./input";

const Home = ({
  setRoute,
  clientCoordinates,
  setIsLoading,
  activateLoading,
}: {
  setRoute: (input: "home" | "login" | "register") => void;
  clientCoordinates: { lat: number | null; lng: number | null };
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activateLoading: (callback: Promise<any>) => Promise<any>;
}) => {
  const [showDots, setShowDots] = useState<boolean>(true);

  return (
    <section className="home">
      {showDots ? (
        <Dots clientCoordinates={clientCoordinates} setRoute={setRoute} setIsLoading={setIsLoading} setShowDots={setShowDots} />
      ) : (
        <MainInput setShowDots={setShowDots} setRoute={setRoute} activateLoading={activateLoading} />
      )}
    </section>
  );
};

export default Home;
