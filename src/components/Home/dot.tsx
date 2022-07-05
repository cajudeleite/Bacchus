import React, { useState } from "react";
import { getEvent } from "../../api/event";

const Dot = ({
  clientCoordinates,
  event,
  setRoute,
}: {
  clientCoordinates: { lat: number; lng: number };
  event: any;
  setRoute: (input: "home" | "login" | "register") => void;
}) => {
  const spread = 1000;
  const dotSize = 7 + (event.reputation <= 1 ? 0 : Math.log2(event.reputation));
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
  const bottomIfInsideInput =
    distance.bottom <= centerOfScreen.height + 45 + dotSize && distance.bottom >= centerOfScreen.height
      ? centerOfScreen.height + 45 + dotSize
      : distance.bottom >= centerOfScreen.height - 45 - dotSize && distance.bottom <= centerOfScreen.height
      ? centerOfScreen.height - 45 - dotSize
      : distance.bottom;
  const [showName, setShowName] = useState<boolean>(false);

  const handdleClick = async () => {
    const response: any = await getEvent(event.id);

    if (response.status === 401) {
      setRoute("login");
    } else if (response.status === 200) {
      console.log(response.data);
    }
  };

  return (
    <>
      <div
        className="home__dots__dot"
        style={{
          height: dotSize,
          width: dotSize,
          left: distance.left,
          bottom: bottomIfInsideInput,
        }}
        onMouseEnter={() => setShowName(true)}
        onMouseLeave={() => setShowName(false)}
        onClick={() => handdleClick()}
      >
        {showName && <p className="home__dots__dot__name">{event.name}</p>}
      </div>
    </>
  );
};

export default Dot;
