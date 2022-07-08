import React, { useEffect, useState } from "react";
import { getEvents } from "../../api/event";
import { IEvent } from "../../types";
import Dot from "./dot";

const Dots = ({
  clientCoordinates,
  setRoute,
}: {
  clientCoordinates: { lat: number; lng: number };
  setRoute: (input: "home" | "login" | "register") => void;
}) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [userReputation, setUserReputation] = useState<number>(0);
  const enableTimeout: boolean = true;

  useEffect(() => {
    let ignore = false;

    const getEventsInApi = async () => {
      const response: any = await getEvents();
      if (!ignore) {
        setEvents(response.data.events);
        setUserReputation(response.data.reputation);
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
        const timeBeforeShow = 60000 / (!userReputation ? 1 : userReputation) / Math.log2(Math.exp(event.reputation === 0 ? 1 : event.reputation));

        return (
          <Dot
            key={event.id}
            clientCoordinates={clientCoordinates}
            event={event}
            setRoute={setRoute}
            timeBeforeShow={timeBeforeShow}
            enableTimeout={enableTimeout}
          />
        );
      })}
    </div>
  );
};

export default Dots;
