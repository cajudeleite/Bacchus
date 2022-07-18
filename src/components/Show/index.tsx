import React from "react";
import { IEvent, IUser } from "../../types";
import Map, { Marker } from "react-map-gl";
import "./styles.scss";

const Show = ({
  event,
  clientCoordinates,
  eventUser,
}: {
  event: IEvent;
  clientCoordinates: {
    lat: number | undefined;
    lng: number | undefined;
  };
  eventUser: IUser;
}) => {
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

  return (
    <section className="event">
      <div className="event__content">
        <h1 className="event__content__name">{event.name}</h1>
        <p className="event__content__username">{eventUser.username}</p>
        <p className="event__content__address">{event.address}</p>
        <h2 className="event__content__description">{event.description}</h2>
      </div>
      <div className="event__map">
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
          <Marker key="medusa" longitude={clientCoordinates.lng} latitude={clientCoordinates.lat} anchor="center">
            <div className="event__map__dot">
              <p className="event__map__dot__logo">M</p>
            </div>
          </Marker>
          <Marker longitude={eventCoordinates.lng} latitude={eventCoordinates.lat} />
        </Map>
      </div>
    </section>
  );
};

export default Show;
