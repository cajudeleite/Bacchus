import React, { useState } from "react";
import "./styles.scss";
import Dots from "./dots";
import MainInput from "./input";
import { IEvent, IRoute, IUser } from "../../types";

const Home = ({
  setRoute,
  clientCoordinates,
  setIsLoading,
  activateLoading,
  setEvent,
  setEventUser,
  showDots,
  setShowDots,
}: {
  setRoute: (input: IRoute) => void;
  clientCoordinates: { lat: number | undefined; lng: number | undefined };
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activateLoading: (callback: Promise<any>) => Promise<any>;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  showDots: boolean;
  setShowDots: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <section className="home">
    {showDots ? (
      <Dots
        clientCoordinates={clientCoordinates}
        setRoute={setRoute}
        setIsLoading={setIsLoading}
        setShowDots={setShowDots}
        setEvent={setEvent}
        setEventUser={setEventUser}
      />
    ) : (
      <MainInput setShowDots={setShowDots} setRoute={setRoute} activateLoading={activateLoading} setEvent={setEvent} setEventUser={setEventUser} />
    )}
  </section>
);

export default Home;
