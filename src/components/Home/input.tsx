import React, { useState } from "react";
import { createEvent, searchEvent } from "../../api/event";
import { IEvent, IRoute, IUser } from "../../types";
import Input from "../Input";

const MainInput = ({
  setShowDots,
  setRoute,
  activateLoading,
  setEvent,
  setEventUser,
}: {
  setShowDots: React.Dispatch<React.SetStateAction<boolean>>;
  setRoute: (input: IRoute) => void;
  activateLoading: (callback: Promise<any>) => Promise<any>;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [eventTrigger, setEventTrigger] = useState<boolean>(false);
  const eventSteps = ["Name", "Description", "Status", "Address", "Date", "Invite Quantity"];
  const [eventStep, setEventStep] = useState<number>(0);
  const [eventInfo, setEventInfo] = useState<any[]>([]);
  const [inputError, setInputError] = useState<boolean>(false);

  const handleEvent: () => void = async () => {
    const response: any = await searchEvent(inputValue);
    switch (response.status) {
      case 404:
        setShowDots(false);
        setEventTrigger(true);
        break;

      case 200:
        console.log(response.data);
        setEvent(response.data.event);
        setEventUser(response.data.user);
        setRoute("show");
        break;

      case 401:
        setShowDots(false);
        setInputValue("");
        setRoute("login");
        break;

      default:
        console.error("Error in event get");
        break;
    }
  };

  const handleCreateEventTrigger: () => void = async () => {
    if (!inputValue) {
      console.error("Event name is required");
      setInputError(true);
      setTimeout(() => {
        setInputError(false);
      }, 400);
      return;
    }
    if ((eventStep === eventSteps.length - 2 && eventInfo[2] !== "locked") || eventStep === eventSteps.length - 1) {
      setInputValue("");
      await activateLoading(createEvent([...eventInfo, inputValue]));
      setEventTrigger(false);
      setShowDots(true);
      setInputValue("");
      setEventStep(0);
      return;
    }
    setEventInfo([...eventInfo, inputValue]);
    setEventStep(eventStep + 1);
    setInputValue("");
  };

  const handleSubmit: () => void = async () => {
    if (eventTrigger) {
      handleCreateEventTrigger();
    } else {
      handleEvent();
    }
  };
  return (
    <Input
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputError={inputError}
      label={eventTrigger ? eventSteps[eventStep] : "Search event"}
      type={eventStep === 2 ? "select" : eventStep === 4 ? "date" : eventStep === 5 ? "number" : "text"}
      handleSubmit={handleSubmit}
      options={["open", "closed", "locked"]}
    />
  );
};

export default MainInput;
