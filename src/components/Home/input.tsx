import React, { useEffect, useState } from "react";
import { createEvent, searchEvent, checkInvite } from "../../api/event";
import { IEvent, IRoute, IUser } from "../../types";
import Input from "../Input";

const MainInput = ({
  setRoute,
  activateLoading,
  setEvent,
  setEventUser,
}: {
  setRoute: (input: IRoute) => void;
  activateLoading: (callback: Promise<any>) => Promise<any>;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [eventTrigger, setEventTrigger] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);
  const eventSteps = ["Description", "Status", "Address", "Date", "Invite Quantity"];
  const [eventStep, setEventStep] = useState<number>(0);
  const [eventInfo, setEventInfo] = useState<any[]>([]);
  const [checkToken, setCheckToken] = useState<boolean>(false);
  const [eventIdToBeChecked, setEventIdToBeChecked] = useState<string>("");
  const [triggerError, setTriggerError] = useState<boolean>(false);

  useEffect(() => {
    if (showButton && inputValue !== eventInfo[0]) {
      setEventInfo([]);
      setShowButton(false);
    }
  }, [inputValue, eventInfo, showButton]);

  const triggerShake = (delay = 0) => {
    setTimeout(() => {
      setTriggerError(true);
      setTriggerError(false);
    }, delay);
  };

  const handleSubmit: () => void = async () => {
    if (eventTrigger) {
      handleCreateEventTrigger();
    } else if (showButton) {
      setEventTrigger(true);
      setShowButton(false);
      setInputValue("");
    } else {
      checkToken ? handleCheckToken() : handleSearchEvent();
    }
  };

  const handleSearchEvent = async () => {
    try {
      const response: any = await activateLoading(searchEvent(inputValue));
      if (response.status >= 400) throw response;

      setEvent(response.data.event);
      setEventUser(response.data.user);
      setRoute("show");
    } catch (error: any) {
      switch (error.status) {
        case 401:
          setInputValue("");
          setRoute("login");
          break;

        case 403:
          setInputValue("");
          setCheckToken(true);
          setEventIdToBeChecked(error.message.split(" ")[1]);
          break;

        case 404:
          setEventInfo([inputValue]);
          triggerShake(1000);

          setShowButton(true);
          break;

        default:
          break;
      }
    }
  };

  const handleCheckToken: () => void = async () => {
    try {
      const response = await activateLoading(checkInvite(eventIdToBeChecked, inputValue));
      if (response.status >= 400) throw new Error("Wrong token");

      setEvent(response.data.event);
      setEventUser(response.data.user);
      setRoute("show");
    } catch (error) {
      triggerShake(1000);
    }
  };

  const handleCreateEventTrigger: () => void = async () => {
    if ((eventStep === eventSteps.length - 2 && eventInfo[1] !== "locked") || eventStep === eventSteps.length - 1) {
      setInputValue("");
      try {
        const response = await activateLoading(createEvent([...eventInfo, inputValue]));
        if (response.status >= 400) throw response;

        setEventTrigger(false);
        setEvent(response.data.event);
        setEventStep(0);
        setRoute("show");
      } catch (e) {
        triggerShake();
      }
      return;
    }

    setEventInfo([...eventInfo, inputValue]);
    setEventStep(eventStep + 1);
    setInputValue("");
  };

  return (
    <div className="w-1/2 lg:w-1/3 xl:w-1/4">
      <Input
        inputValue={inputValue}
        setInputValue={setInputValue}
        label={eventTrigger ? eventSteps[eventStep] : checkToken ? "Event invite token" : "Search event"}
        type={eventStep === 1 ? "select" : eventStep === 3 ? "date" : eventStep === 4 ? "number" : "text"}
        handleSubmit={handleSubmit}
        options={["open", "closed", "locked"]}
        buttonText={showButton ? "Create event" : undefined}
        regex={eventTrigger ? undefined : /^\S*$/}
        triggerError={triggerError}
      />
    </div>
  );
};

export default MainInput;
