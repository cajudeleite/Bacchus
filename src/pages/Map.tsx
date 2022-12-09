import React, { useEffect, useState } from "react";
import { getEvents } from "../web3/event";
import { IEvent, IPartialEvent, IRoute } from "../types";
import Map from "react-map-gl";

import mapboxgl from "mapbox-gl";
import MainDot from "../components/MainDot";
import Dot from "../components/Dot";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MainMap = ({
  setIsLoading,
  setRoute,
  setEvent,
  clientCoordinates,
  setEventId,
}: {
  setRoute: (input: IRoute) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean | string>>;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  clientCoordinates: { lat: number; lng: number };
  setEventId: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [events, setEvents] = useState<IPartialEvent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const enableTimeout: boolean = true;

  useEffect(() => {
    if (clientCoordinates.lat && clientCoordinates.lng) {
      setLoaded(true);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [clientCoordinates, setIsLoading]);

  useEffect(() => {
    let mounted = true;

    const getEventsInDApp = async () => {
      setIsLoading(true);
      try {
        const response = await getEvents();

        if (response.length > 0) setEvents(response);
      } catch (error) {
        setRoute("error");
      }
      setIsLoading(false);
    };

    if (clientCoordinates.lat && clientCoordinates.lng && events.length === 0 && mounted) {
      getEventsInDApp();
    }

    return () => {
      mounted = false;
    };
  }, [clientCoordinates, events, setRoute, setIsLoading]);

  if (!loaded) return null;

  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      initialViewState={{
        longitude: clientCoordinates.lng,
        latitude: clientCoordinates.lat,
        zoom: 12,
      }}
      interactive={true}
      style={{ width: "100%", height: "100%", position: "absolute" }}
      mapStyle="mapbox://styles/cajudeleite/cl5fnkcqk00e616p3fk1nk88n"
    >
      <MainDot clientCoordinates={clientCoordinates} callback={() => setRoute("search")} />
      {events.map((event) => {
        // const timeBeforeShow = 10000 / (!userReputation ? 1 : userReputation) / Math.log2(Math.exp(event.reputation === 0 ? 1 : event.reputation));
        const timeBeforeShow = 0;
        return (
          <Dot
            key={event.id}
            event={event}
            setRoute={setRoute}
            timeBeforeShow={timeBeforeShow}
            enableTimeout={enableTimeout}
            setEvent={setEvent}
            setIsLoading={setIsLoading}
            setEventId={setEventId}
          />
        );
      })}
    </Map>
  );
};

export default MainMap;
