import React, { useEffect, useState } from "react";
import { createEvent, userEvent } from "../web3/event";
import { IEvent, IRoute } from "../types";
import Input from "../components/Input";
import Button from "../components/Button";
import { addressToCoordinates } from "../api/geocoder";
import { getMinAndMaxNameLength } from "../web3/bacchus";

const Create = ({
  setRoute,
  setIsLoading,
  setEvent,
  setErrorText,
}: {
  setRoute: (input: IRoute) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean | string>>;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setErrorText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [eventInfo, setEventInfo] = useState<[string, string, string, string]>(["", "", "", ""]);
  const [eventStep, setEventStep] = useState(0);
  const [minAndMaxNameLength, setMinAndMaxNameLength] = useState<[number, number]>([0, 0]);
  const [triggerError, setTriggerError] = useState(false);

  const eventSteps = ["Name", "Description", "Address", "Date"];

  useEffect(() => {
    const userHasEvent = async () => {
      setIsLoading(true);
      try {
        const response = await userEvent();
        if (response > 0) throw new Error("User already has an event");
      } catch (error: any) {
        setErrorText(error.message);
        setRoute("error");
      }
      setIsLoading(false);
    };

    const getNameLengthValues = async () => {
      try {
        const response = await getMinAndMaxNameLength();
        setMinAndMaxNameLength(response);
      } catch (error) {
        console.error(error);

        setRoute("error");
      }
    };

    userHasEvent();
    getNameLengthValues();
  }, [setRoute, setIsLoading, setErrorText]);

  const goForward = async () => {
    if (eventStep === 2) {
      setIsLoading(true);
      try {
        await addressToCoordinates(inputValue);
      } catch (error) {
        setTriggerError(true);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }
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

  const onChange = (value: string) => {
    switch (eventStep) {
      case 0:
        const newValue = value[value.length - 1] === " " ? inputValue + "-" : value;

        if (newValue.match(/^[a-z0-9-]*$/) && newValue.length <= minAndMaxNameLength[1]) {
          setInputValue(newValue);
        } else {
          setTriggerError(true);
        }

        break;

      default:
        setInputValue(value);
        break;
    }
  };

  const handleSubmit: () => void = async () => {
    if (!eventStep && inputValue.length < minAndMaxNameLength[0]) {
      setTriggerError(true);
      return;
    }
    const newEventInfo: [string, string, string, string] = [...eventInfo];
    newEventInfo[eventStep] = inputValue;

    setEventInfo(newEventInfo);
    eventStep === 3 ? handleCreateEvent(newEventInfo) : goForward();
  };

  const handleCreateEvent: (eventInfo: [string, string, string, string]) => void = async (eventInfo: [string, string, string, string]) => {
    setIsLoading("Your event is being created, this can take a while");
    try {
      const coordsObj = await addressToCoordinates(eventInfo[2]);

      const coords = `${coordsObj?.lat},${coordsObj?.lng}`;
      const date = Date.parse(eventInfo[3]);

      await createEvent(eventInfo[0], eventInfo[1], coords, date);

      setEvent({ name: eventInfo[0], description: eventInfo[1], location: coords, date });
      setRoute("show");
    } catch (error: any) {
      setErrorText(error);
      setRoute("error");
    }
    setInputValue("");
    setIsLoading(false);
    return;
  };

  return (
    <section className="w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col space-y-4 font-mono">
      <Input
        inputValue={inputValue}
        onChange={onChange}
        onSubmit={handleSubmit}
        label={!eventStep && !inputValue ? "Create event" : eventSteps[eventStep]}
        labelAlignment={!eventStep && !inputValue ? "center" : "start"}
        type={eventStep === 3 ? "date" : "text"}
        triggerError={triggerError}
        setTriggerError={setTriggerError}
      />
      {!triggerError &&
        (eventStep || inputValue ? (
          <div className={`w-full flex flex-wrap-reverse ${eventStep ? "justify-between" : "justify-end"}`}>
            {eventStep && <Button text="<- Back" onClick={goBackwards} variant="secondary" />}
            {inputValue && (
              <Button text={eventStep === 3 ? "Create" : "Next ->"} onClick={handleSubmit} variant={eventStep === 3 ? "primary" : "secondary"} />
            )}
          </div>
        ) : (
          <Button text="Search event" onClick={() => setRoute("search")} variant="secondary" />
        ))}
    </section>
  );
};

export default Create;
