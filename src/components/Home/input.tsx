import React, { useState } from "react";
import { createEvent, searchEvent, checkInvite } from "../../api/event";
import { IEvent, IRoute, IUser } from "../../types";
import Input from "../Input";

const MainInput = ({
  setShowDots,
  setRoute,
  activateLoading,
  event,
  setEvent,
  setEventUser,
}: {
  setShowDots: React.Dispatch<React.SetStateAction<boolean>>;
  setRoute: (input: IRoute) => void;
  activateLoading: (callback: Promise<any>) => Promise<any>;
  event: IEvent | undefined;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [eventTrigger, setEventTrigger] = useState<boolean>(false);
  const eventSteps = ["Name", "Description", "Status", "Address", "Date", "Invite Quantity"];
  const [eventStep, setEventStep] = useState<number>(0);
  const [eventInfo, setEventInfo] = useState<any[]>([]);
  const [inputError, setInputError] = useState<boolean>(false);
  const [checkToken, setCheckToken] = useState<boolean>(false);

  const shakeInput = () => {
    setInputError(true);
    setTimeout(() => {
      setInputError(false);
    }, 400);
  };

  const handleSubmit: () => void = async () => {
    if (eventTrigger) {
      handleCreateEventTrigger();
    } else {
      checkToken ? handleCheckToken() : handleSearchEvent();
    }
  };

  const handleSearchEvent = async () => {
    try {
      const response: any = await activateLoading(searchEvent(inputValue));
      if (response.status >= 400) throw response;
      if (response.data.event.status === "locked") {
        setEvent(response.data.event);
        setEventUser(response.data.user);
        setInputValue("");
        setCheckToken(true);
      } else {
        setEvent(response.data.event);
        setEventUser(response.data.user);
        setRoute("show");
      }
    } catch (error: any) {
      switch (error.status) {
        case 401:
          setShowDots(false);
          setInputValue("");
          setRoute("login");
          break;

        case 404:
          setShowDots(false);
          setEventTrigger(true);
          break;

        default:
          console.error("Error in event search", error);
          break;
      }
    }
  };

  const handleCheckToken: () => void = async () => {
    if (!event) return;
    try {
      const response = await activateLoading(checkInvite(event.id, inputValue));
      if (response.status >= 400) throw new Error("Wrong token");
      setRoute("show");
    } catch (error) {
      setTimeout(() => {
        shakeInput();
      }, 1000);
    }
  };

  const handleCreateEventTrigger: () => void = async () => {
    if (!inputValue) {
      shakeInput();
      return;
    }

    if ((eventStep === eventSteps.length - 2 && eventInfo[2] !== "locked") || eventStep === eventSteps.length - 1) {
      setInputValue("");
      try {
        await activateLoading(createEvent([...eventInfo, inputValue]));
        setEventTrigger(false);
        setShowDots(true);
        setEventStep(0);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    setEventInfo([...eventInfo, inputValue]);
    setEventStep(eventStep + 1);
    setInputValue("");
  };

  return (
    <Input
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputError={inputError}
      label={eventTrigger ? eventSteps[eventStep] : checkToken ? "Event invite token" : "Search event"}
      type={eventStep === 2 ? "select" : eventStep === 4 ? "date" : eventStep === 5 ? "number" : "text"}
      handleSubmit={handleSubmit}
      options={["open", "closed", "locked"]}
    />
  );
};

export default MainInput;
