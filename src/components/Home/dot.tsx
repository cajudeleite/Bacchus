import React, { useState } from "react";

const Dot = ({ clientCoordinates, event }: { clientCoordinates: { lat: number; lng: number }; event: any }) => {
  const spread = 1000;
  const screenDimentions = {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  const centerOfScreen = {
    width: screenDimentions.width / 2,
    height: screenDimentions.height / 2,
  };
  const eventCoordinates = event.location.split(",");
  const distance = {
    left: (eventCoordinates[1] - clientCoordinates.lng) * spread + centerOfScreen.width,
    bottom: (eventCoordinates[0] - clientCoordinates.lat) * spread + centerOfScreen.height,
  };
  const [showName, setShowName] = useState<boolean>(false);

  return (
    <>
      <div
        className="home__dots__dot"
        style={{ left: distance.left, bottom: distance.bottom }}
        onMouseEnter={() => setShowName(true)}
        onMouseLeave={() => setShowName(false)}
      >
        {showName && <p className="home__dots__dot__name">{event.name}</p>}
      </div>
    </>
  );
};

export default Dot;
