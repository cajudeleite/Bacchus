import React, { useEffect, useState } from "react";
import { getEvent } from "../../api/event";
import { IEvent } from "../../types";

const Dot = ({
  clientCoordinates,
  event,
  setRoute,
  timeBeforeShow,
  enableTimeout,
}: {
  clientCoordinates: { lat: number; lng: number };
  event: IEvent;
  setRoute: (input: "home" | "login" | "register") => void;
  timeBeforeShow: number;
  enableTimeout: boolean;
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
    left: (parseFloat(eventCoordinates[1]) - clientCoordinates.lng) * spread + centerOfScreen.width,
    bottom: (parseFloat(eventCoordinates[0]) - clientCoordinates.lat) * spread + centerOfScreen.height,
  };
  const bottomIfInsideInput =
    distance.bottom <= centerOfScreen.height + 45 + dotSize && distance.bottom >= centerOfScreen.height
      ? centerOfScreen.height + 45 + dotSize
      : distance.bottom >= centerOfScreen.height - 45 - dotSize && distance.bottom <= centerOfScreen.height
      ? centerOfScreen.height - 45 - dotSize
      : distance.bottom;
  const [showName, setShowName] = useState<boolean>(false);
  const [showDot, setShowDot] = useState<boolean>(!enableTimeout);

  const handdleClick = async () => {
    const response: any = await getEvent(event.id);

    if (response.status === 401) {
      setRoute("login");
    } else if (response.status === 200) {
      console.log(response.data);
    }
  };

  useEffect(() => {
    const waitUntilShow = setTimeout(() => {
      setShowDot(true);
    }, timeBeforeShow);

    return () => {
      clearTimeout(waitUntilShow);
    };
  }, [timeBeforeShow]);

  return (
    <>
      {showDot && (
        <div
          className="home__dots__dot scale-in-center"
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
      )}
    </>
  );
};

export default Dot;
