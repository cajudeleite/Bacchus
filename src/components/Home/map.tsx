import React, { useEffect, useState } from "react";
import { getEventsNearby } from "../../api/event";
import { IEvent, IRoute, IUser } from "../../types";
import Dot from "./dot";
import Map from "react-map-gl";
import MainDot from "./mainDot";

import mapboxgl from "mapbox-gl";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MainMap = ({
  clientCoordinates,
  setRoute,
  setIsLoading,
  setShowDots,
  setEvent,
  setEventUser,
  activateLoading,
}: {
  clientCoordinates: { lat: number | undefined; lng: number | undefined };
  setRoute: (input: IRoute) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDots: React.Dispatch<React.SetStateAction<boolean>>;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  activateLoading: (callback: Promise<any>) => Promise<any>;
}) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [userReputation, setUserReputation] = useState<number>(0);
  const enableTimeout: boolean = true;

  useEffect(() => {
    const getEventsInApi = async () => {
      const response: any = await getEventsNearby(clientCoordinates);
      setEvents(response.data.events);
      setUserReputation(response.data.reputation);
    };

    if (clientCoordinates.lat && clientCoordinates.lng && events.length === 0) {
      getEventsInApi();
    }
  }, [clientCoordinates, events]);

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
            activateLoading={activateLoading}
          />
        );
      })}
    </Map>
  );
};

export default MainMap;
