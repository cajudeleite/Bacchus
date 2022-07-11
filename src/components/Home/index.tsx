import React, { useState } from "react";
import "./styles.scss";
import Dots from "./dots";
import MainInput from "./mainInput";

const Home = ({
  setRoute,
  clientCoordinates,
  setIsLoading,
}: {
  setRoute: (input: "home" | "login" | "register") => void;
  clientCoordinates: { lat: number | null; lng: number | null };
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showDots, setShowDots] = useState<boolean>(true);

  return (
    <section className="home">
      {showDots ? (
        <Dots clientCoordinates={clientCoordinates} setRoute={setRoute} setIsLoading={setIsLoading} setShowDots={setShowDots} />
      ) : (
        <MainInput setShowDots={setShowDots} setRoute={setRoute} />
      )}
    </section>
  );
};

export default Home;
