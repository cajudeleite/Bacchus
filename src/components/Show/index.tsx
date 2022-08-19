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

  const eventUserReputation = Math.round((Math.log(eventUser.reputation + 1) / Math.log(4)) * 10) / 10;

  return (
    <section className="event">
      <div className="event__content">
        <h1 className="event__content__name">{event.name}</h1>
        <div className="event__content__user">
          <p
            className="event__content__user__name"
            style={{
              fontFamily: eventUser.verified ? "SevereLowerCase" : "",
              fontSize: eventUser.verified ? 35 : 18,
              color: eventUser.verified ? "#0F530D" : "",
            }}
          >
            {eventUser.username}
          </p>
          {!eventUser.verified && (
            <div className="event__content__user__wrap">
              <div className="event__content__user__wrap__bar" style={{ width: `${eventUserReputation}rem` }} />
            </div>
          )}
        </div>
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
