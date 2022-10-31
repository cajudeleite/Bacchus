import React, { useEffect, useRef } from "react";
import { Marker } from "react-map-gl";

const MainDot = ({
  clientCoordinates,
  setIsLoading,
  callback,
}: {
  clientCoordinates: { lat: number | undefined; lng: number | undefined };
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  callback: () => void;
}) => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    setIsLoading(!mounted.current);

    return () => {
      mounted.current = false;
    };
  }, [setIsLoading]);

  return (
    <Marker key="bacchus" longitude={clientCoordinates.lng} latitude={clientCoordinates.lat} anchor="center" onClick={callback}>
      <p className="severe-lower-case text-5xl text-white opacity-70 hover:opacity-90 hover:text-6xl cursor-help">B</p>
    </Marker>
  );
};

export default MainDot;
