import React, { useEffect, useState } from "react";
import { createEvent, searchEvent } from "../web3/event";
import { IEvent, IRoute, IUser } from "../types";
import Input from "../components/Input";
import Button from "../components/Button";
import { addressToCoordinates } from "../api/geocoder";

const Create = ({
  setRoute,
  setEvent,
  setIsLoading,
}: // setEventUser,
{
  setRoute: (input: IRoute) => void;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [eventInfo, setEventInfo] = useState<[string, string, string, string]>(["", "", "", ""]);
  const [eventStep, setEventStep] = useState(0);
  const [triggerError, setTriggerError] = useState(false);
  const eventSteps = ["Name", "Description", "Address", "Date"];

  useEffect(() => {
    if (showButton && inputValue !== eventInfo[0]) {
      setShowButton(false);
    }
  }, [inputValue, eventInfo, showButton]);

  const triggerShake = (delay = 0) => {
    setTimeout(() => {
      setTriggerError(true);
      setTriggerError(false);
    }, delay);
  };

  const goForward = () => {
    setInputValue(eventInfo[eventStep + 1]);
    setEventStep(eventStep + 1);
    document.querySelector("input")?.focus();
  };

  const goBackwards = () => {
    const newEventInfo: [string, string, string, string] = [...eventInfo];
    newEventInfo[eventStep] = inputValue;
    setEventInfo(newEventInfo);

    setInputValue(eventInfo[eventStep - 1]);
    setEventStep(eventStep - 1);
    document.querySelector("input")?.focus();
  };

  const handleSubmit: () => void = async () => {
    const newEventInfo: [string, string, string, string] = [...eventInfo];
    newEventInfo[eventStep] = inputValue;

    setEventInfo(newEventInfo);
    eventStep === 3 ? handleCreateEvent(newEventInfo) : goForward();
  };

  const handleCreateEvent: (eventInfo: [string, string, string, string]) => void = async (eventInfo: [string, string, string, string]) => {
    setIsLoading(true);
    try {
      const coordsObj = await addressToCoordinates(eventInfo[2]);

      const coords = `${coordsObj?.lat},${coordsObj?.lng}`;
      const date = Date.parse(eventInfo[3]);

      const response = await createEvent(eventInfo[0], eventInfo[1], coords, date);
      console.log(response);

      // setEvent(response.data.event);
      //   setRoute("show");
    } catch (error) {
      console.error(error);

      triggerShake();
    }
    setInputValue("");
    setIsLoading(false);
    return;
  };

  return (
    <div className="w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col space-y-4 font-mono">
      <Input
        inputValue={inputValue}
        setInputValue={setInputValue}
        label={!eventStep && !inputValue ? "Create event" : eventSteps[eventStep]}
        labelAlignment={!eventStep && !inputValue ? "center" : "start"}
        type={eventStep === 3 ? "date" : "text"}
        handleSubmit={handleSubmit}
        triggerError={triggerError}
        regex={!eventStep ? /^[a-zA-Z0-9]*$/ : undefined}
      />
      {eventStep || inputValue ? (
        <div className={`w-full flex flex-wrap-reverse ${eventStep ? "justify-between" : "justify-end"}`}>
          {eventStep && <Button text="<- Back" callback={goBackwards} variant="secondary" />}
          {inputValue && (
            <Button text={eventStep === 3 ? "Create" : "Next ->"} callback={handleSubmit} variant={eventStep === 3 ? "primary" : "secondary"} />
          )}
        </div>
      ) : (
        <Button text="Search event" callback={() => setRoute("search")} variant="secondary" />
      )}
    </div>
  );
};

export default Create;
