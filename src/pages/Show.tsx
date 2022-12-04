import React, { useEffect, useState } from "react";
import { IEvent, IRoute } from "../types";
import Map, { Marker } from "react-map-gl";
import { coordinatesToAddress } from "../api/geocoder";

const Show = ({
  setRoute,
  event,
  clientCoordinates,
}: {
  setRoute: React.Dispatch<React.SetStateAction<IRoute>>;
  event: IEvent;
  clientCoordinates: {
    lat: number | undefined;
    lng: number | undefined;
  };
}) => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const coordsToAddress = async () => {
      try {
        const response: string = await coordinatesToAddress(event.location);
        setAddress(response);
      } catch (error) {
        console.error(error);
      }
    };

    coordsToAddress();
  }, [event]);

  const eventCoordinates = {
    lat: parseFloat(event.location.split(",")[0]),
    lng: parseFloat(event.location.split(",")[1]),
  };

  if (!clientCoordinates.lat || !clientCoordinates.lng) return null;

  const differenceCoordinates = {
    lat: Math.abs(clientCoordinates.lat - eventCoordinates.lat),
    lng: Math.abs(clientCoordinates.lng - eventCoordinates.lng),
  };

  const maxDifference = Math.max(differenceCoordinates.lat, differenceCoordinates.lng);
  const zoom = maxDifference > 0.1 ? 11 : maxDifference > 0.03 ? 12 : 14;

  const centerCoordinates = {
    lat: clientCoordinates.lat - (clientCoordinates.lat - eventCoordinates.lat) / 2,
    lng: clientCoordinates.lng - (clientCoordinates.lng - eventCoordinates.lng) / 2,
  };

  // const eventUserReputation = Math.round((Math.log(eventUser.reputation + 1) / Math.log(4)) * 10) / 10;

  return (
    <section className="h-full w-full flex space-x-4 text-white py-20 mx-5">
      <div className="w-1/2 flex flex-col">
        <h1 className="severe-lower-case text-8xl opacity-70 mb-2">{event.name}</h1>
        <div className="flex items-center mb-6">
          <p
            className="opacity-60"
            style={{
              fontSize: 18,
            }}
          >
            {event.username}
          </p>
          {/* {!eventUser.verified && (
            <div className="h-[0.3rem] w-20 bg-white opacity-20 ml-4">
              <div className="h-full bg-white opacity-40" style={{ width: `${eventUserReputation}rem` }} />
            </div>
          )} */}
        </div>
        <p className="opacity-40 mb-5">{address}</p>
        <h2 className="opacity-50 text-justify">{event.description}</h2>
      </div>
      <div className="h-full w-1/2 border border-white border-opacity-50">
        <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          initialViewState={{
            longitude: centerCoordinates.lng,
            latitude: centerCoordinates.lat,
            zoom: zoom,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/cajudeleite/cl5fnkcqk00e616p3fk1nk88n"
        >
          <Marker key="bacchus" longitude={clientCoordinates.lng} latitude={clientCoordinates.lat} anchor="center" onClick={() => setRoute("map")}>
            <p className="severe-lower-case text-5xl opacity-70 hover:opacity-90 hover:text-6xl cursor-help">B</p>
          </Marker>
          <Marker longitude={eventCoordinates.lng} latitude={eventCoordinates.lat} />
        </Map>
      </div>
    </section>
  );
};

export default Show;
