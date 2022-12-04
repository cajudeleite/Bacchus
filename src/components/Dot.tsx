import React, { useEffect, useState } from "react";
import { Marker } from "react-map-gl";
import { getEvent } from "../web3/event";
import { IEvent, IPartialEvent, IRoute, IUser } from "../types";
import "./styles.scss";

const Dot = ({
  event,
  setRoute,
  timeBeforeShow,
  enableTimeout,
  setEvent,
  setIsLoading,
}: // setEventUser,
{
  event: IPartialEvent;
  setRoute: (input: IRoute) => void;
  timeBeforeShow: number;
  enableTimeout: boolean;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean | string>>;
  // setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}) => {
  // const dotSize = 7 + (event.reputation <= 1 ? 0 : Math.log2(event.reputation));
  const dotSize = 8;
  const eventCoordinates = event.location.split(",");
  const [showName, setShowName] = useState<boolean>(false);
  const [showDot, setShowDot] = useState<boolean>(!enableTimeout);

  const handdleClick = async () => {
    setIsLoading(true);
    try {
      const response = await getEvent(event.id);
      setEvent(response);
      // setEventUser(response.data.user);
      setRoute("show");
    } catch (error: any) {
      console.error(error);
    }
    setIsLoading(false);
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
            className="p-3 cursor-pointer"
            onMouseEnter={() => setShowName(true)}
            onMouseLeave={() => setShowName(false)}
            onClick={() => handdleClick()}
          >
            <div
              className="rounded-full bg-white opacity-70 scale-in-center relative flex justify-center"
              style={{
                height: dotSize,
                width: dotSize,
              }}
            >
              {showName && <p className="text-white opacity-80 absolute bottom-4 w-max text-lg font-mono">{event.name}</p>}
            </div>
          </div>
        </Marker>
      )}
    </>
  );
};

export default Dot;
