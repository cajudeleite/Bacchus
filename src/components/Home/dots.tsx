import React, { useEffect, useState } from "react";
import { getEventsNearby } from "../../api/event";
import { IEvent } from "../../types";
import Dot from "./dot";
import Map from "react-map-gl";
import MainDot from "./mainDot";

const Dots = ({
  clientCoordinates,
  setRoute,
  setIsLoading,
  setShowDots,
}: {
  clientCoordinates: { lat: number | null; lng: number | null };
  setRoute: (input: "home" | "login" | "register") => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDots: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [userReputation, setUserReputation] = useState<number>(0);
  const enableTimeout: boolean = true;

  useEffect(() => {
    let ignore = false;

    const getEventsInApi = async () => {
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
      mapboxAccessToken="pk.eyJ1IjoiY2FqdWRlbGVpdGUiLCJhIjoiY2w1ZnAzNTlmMWQ0ZzNqbXM3MzcyYW1lcCJ9.U2ie-C9LIEMdFQP7nJEGzQ"
      initialViewState={{
        longitude: clientCoordinates.lng,
        latitude: clientCoordinates.lat,
        zoom: 11,
      }}
      interactive={false}
      style={{ width: "100%", height: "100%", position: "absolute" }}
      mapStyle="mapbox://styles/cajudeleite/cl5fnkcqk00e616p3fk1nk88n"
    >
      <MainDot clientCoordinates={clientCoordinates} setIsLoading={setIsLoading} setShowDots={setShowDots} />
      {events.map((event) => {
        const timeBeforeShow = 60000 / (!userReputation ? 1 : userReputation) / Math.log2(Math.exp(event.reputation === 0 ? 1 : event.reputation));
        return <Dot key={event.id} event={event} setRoute={setRoute} timeBeforeShow={timeBeforeShow} enableTimeout={enableTimeout} />;
      })}
    </Map>
  );
};

export default Dots;
