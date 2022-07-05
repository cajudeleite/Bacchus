import React, { useEffect, useState } from "react";
import { getEvents } from "../../api/event";
import Dot from "./dot";

const Dots = ({
  clientCoordinates,
  setRoute,
}: {
  clientCoordinates: { lat: number; lng: number };
  setRoute: (input: "home" | "login" | "register") => void;
}) => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    let ignore = false;

    const getEventsInApi = async () => {
      const response: any = await getEvents();
      if (!ignore) {
        setEvents(response.data);
      }
    };

    getEventsInApi();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="home__dots">
      {events.map((event) => {
        return <Dot key={event.id} clientCoordinates={clientCoordinates} event={event} setRoute={setRoute} />;
      })}
    </div>
  );
};

export default Dots;
