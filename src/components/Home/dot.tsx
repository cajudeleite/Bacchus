import React, { useEffect, useState } from "react";
import { Marker } from "react-map-gl";
import { getEvent } from "../../api/event";
import { IEvent, IRoute, IUser } from "../../types";

const Dot = ({
  event,
  setRoute,
  timeBeforeShow,
  enableTimeout,
  setEvent,
  setEventUser,
  activateLoading,
}: {
  event: IEvent;
  setRoute: (input: IRoute) => void;
  timeBeforeShow: number;
  enableTimeout: boolean;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  activateLoading: (callback: Promise<any>) => Promise<any>;
}) => {
  const dotSize = 7 + (event.reputation <= 1 ? 0 : Math.log2(event.reputation));
  const eventCoordinates = event.location.split(",");
  const [showName, setShowName] = useState<boolean>(false);
  const [showDot, setShowDot] = useState<boolean>(!enableTimeout);

  const handdleClick = async () => {
    try {
      const response: any = await activateLoading(getEvent(event.id));
      if (response.status >= 400) throw response;
      setEvent(event);
      setEventUser(response.data.user);
      setRoute("show");
    } catch (error: any) {
      if (error.status === 401) setRoute("login");
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
