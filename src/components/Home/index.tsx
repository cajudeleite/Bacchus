import React, { useEffect, useState } from "react";
import "./styles.scss";
import MainMap from "./map";
import MainInput from "./input";
import { IEvent, IRoute, IUser } from "../../types";

const Home = ({
  setRoute,
  clientCoordinates,
  setIsLoading,
  activateLoading,
  event,
  setEvent,
  eventUser,
  setEventUser,
  showDots,
  setShowDots,
}: {
  setRoute: (input: IRoute) => void;
  clientCoordinates: { lat: number | undefined; lng: number | undefined };
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activateLoading: (callback: Promise<any>) => Promise<any>;
  event: IEvent | undefined;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  eventUser: IUser | undefined;
  setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  showDots: boolean;
  setShowDots: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (clientCoordinates.lat && clientCoordinates.lng) {
      setLoaded(true);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [clientCoordinates, setIsLoading]);

  if (!loaded) return null;

  return (
    <section className="home">
      {showDots ? (
        <MainMap
          clientCoordinates={clientCoordinates}
          setRoute={setRoute}
          setIsLoading={setIsLoading}
          setShowDots={setShowDots}
          setEvent={setEvent}
          setEventUser={setEventUser}
          activateLoading={activateLoading}
        />
      ) : (
        <MainInput
          setShowDots={setShowDots}
          setRoute={setRoute}
          activateLoading={activateLoading}
          event={event}
          setEvent={setEvent}
          setEventUser={setEventUser}
        />
      )}
    </section>
  );
};

export default Home;
