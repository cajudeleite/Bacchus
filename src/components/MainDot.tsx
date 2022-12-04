import React from "react";
import { Marker } from "react-map-gl";

const MainDot = ({
  clientCoordinates,
  callback,
}: {
  clientCoordinates: { lat: number | undefined; lng: number | undefined };
  callback: () => void;
}) => (
  <Marker key="bacchus" longitude={clientCoordinates.lng} latitude={clientCoordinates.lat} anchor="center" onClick={callback}>
    <p className="severe-lower-case text-5xl text-white opacity-70 hover:opacity-90 hover:text-6xl cursor-help">B</p>
  </Marker>
);

export default MainDot;
