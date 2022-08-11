import React, { useEffect, useRef } from "react";
import { Marker } from "react-map-gl";

const MainDot = ({
  clientCoordinates,
  setIsLoading,
  setShowDots,
}: {
  clientCoordinates: { lat: number | undefined; lng: number | undefined };
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDots: React.Dispatch<React.SetStateAction<boolean>>;
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
    <Marker key="medusa" longitude={clientCoordinates.lng} latitude={clientCoordinates.lat} anchor="center" onClick={() => setShowDots(false)}>
      <div className="home__dots__dot__main">
        <p className="home__dots__dot__main__logo">M</p>
      </div>
    </Marker>
  );
};

export default MainDot;
