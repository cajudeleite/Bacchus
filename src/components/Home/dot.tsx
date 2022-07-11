import React, { useEffect, useState } from "react";
import { Marker } from "react-map-gl";
import { getEvent } from "../../api/event";
import { IEvent } from "../../types";

const Dot = ({
  event,
  setRoute,
  timeBeforeShow,
  enableTimeout,
}: {
  event: IEvent;
  setRoute: (input: "home" | "login" | "register") => void;
  timeBeforeShow: number;
  enableTimeout: boolean;
}) => {
  const dotSize = 7 + (event.reputation <= 1 ? 0 : Math.log2(event.reputation));
  const eventCoordinates = event.location.split(",");
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
        <Marker key={event.id} longitude={parseFloat(eventCoordinates[1])} latitude={parseFloat(eventCoordinates[0])} anchor="center">
          <div
            className="home__dots__dot scale-in-center"
            style={{
              height: dotSize,
              width: dotSize,
            }}
            onMouseEnter={() => setShowName(true)}
            onMouseLeave={() => setShowName(false)}
            onClick={() => handdleClick()}
          >
            {showName && <p className="home__dots__dot__name">{event.name}</p>}
          </div>
        </Marker>
      )}
    </>
  );
};

export default Dot;
