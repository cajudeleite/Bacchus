import React, { useEffect, useState } from "react";
import { getEventsNearby } from "../../api/event";
import { IEvent, IRoute, IUser } from "../../types";
import Dot from "./dot";
import Map from "react-map-gl";
import MainDot from "./mainDot";

const Dots = ({
  clientCoordinates,
  setRoute,
  setIsLoading,
  setShowDots,
  setEvent,
  setEventUser,
}: {
  clientCoordinates: { lat: number | undefined; lng: number | undefined };
  setRoute: (input: IRoute) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDots: React.Dispatch<React.SetStateAction<boolean>>;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [userReputation, setUserReputation] = useState<number>(0);
  const enableTimeout: boolean = true;

  useEffect(() => {
    let ignore = false;

    const getEventsInApi = async () => {
      console.log("getEventsInApi");

      const response: any = await getEventsNearby(clientCoordinates);
      if (!ignore) {
        setEvents(response.data.events);
        setUserReputation(response.data.reputation);
      }
    };

    if (clientCoordinates.lat && clientCoordinates.lng) {
      getEventsInApi();
    }

    return () => {
      ignore = true;
    };
  }, [clientCoordinates]);

  if (!clientCoordinates.lat || !clientCoordinates.lng) {
    return null;
  }

  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      initialViewState={{
        longitude: clientCoordinates.lng,
        latitude: clientCoordinates.lat,
        zoom: 11,
      }}
      interactive={true}
      style={{ width: "100%", height: "100%", position: "absolute" }}
      mapStyle="mapbox://styles/cajudeleite/cl5fnkcqk00e616p3fk1nk88n"
    >
      <MainDot clientCoordinates={clientCoordinates} setIsLoading={setIsLoading} setShowDots={setShowDots} />
      {events.map((event) => {
        const timeBeforeShow = 60000 / (!userReputation ? 1 : userReputation) / Math.log2(Math.exp(event.reputation === 0 ? 1 : event.reputation));
        return (
          <Dot
            key={event.id}
            event={event}
            setRoute={setRoute}
            timeBeforeShow={timeBeforeShow}
            enableTimeout={enableTimeout}
            setEvent={setEvent}
            setEventUser={setEventUser}
          />
        );
      })}
    </Map>
  );
};

export default Dots;
