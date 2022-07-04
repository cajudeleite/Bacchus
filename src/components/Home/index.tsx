import React, { useRef, useState } from "react";
import "./styles.scss";
import { searchEvent, createEvent } from "../../api/event";
import Dots from "./dots";

type IEvent = [name: string, description: string, status: string, address: string, date: string, invite_quantity: number];

const Home = ({
  setRoute,
  clientCoordinates,
}: {
  setRoute: (input: "home" | "login" | "register") => void;
  clientCoordinates: { lat: number; lng: number };
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [createEventTrigger, setCreateEventTrigger] = useState<boolean>(false);
  const eventSteps = ["Name", "Description", "Status", "Address", "Date", "Invite Quantity"];
  const [eventStep, setEventStep] = useState<number>(0);
  const eventInfo: IEvent = useRef<IEvent>(["", "", "open", "", "", 0]).current;
  const [inputError, setInputError] = useState<boolean>(false);

  const handleEvent: () => void = async () => {
    const response: any = await searchEvent(inputValue);
    switch (response.status) {
      case 404:
        console.log("Event does not exist");
        setCreateEventTrigger(true);
        break;

      case 200:
        console.log(response.data);
        break;

      case 401:
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
    if (eventStep === eventSteps.length - 1) {
      await createEvent(eventInfo);
      setCreateEventTrigger(false);
      setInputValue("");
      setEventStep(0);
      return;
    }
    eventInfo[eventStep] = inputValue;
    setEventStep(eventStep + 1);
    setInputValue("");
  };

  const handleSubmit: () => void = async () => {
    if (createEventTrigger) {
      handleCreateEventTrigger();
    } else {
      handleEvent();
    }
  };

  return (
    <section className="home">
      <form
        id="form-wrap"
        className="home__wrap"
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
        }}
      >
        {createEventTrigger && (
          <label htmlFor="input" className={"home__wrap__title" + (inputError ? " shake-horizontal" : "")}>
            {eventSteps[eventStep]}
          </label>
        )}
        {eventStep !== 2 && (
          <input
            value={inputValue}
            type={eventStep === 4 ? "date" : eventStep === 5 ? "number" : "text"}
            min="0"
            name="input"
            id="input"
            className={"home__wrap__input" + (inputError ? " shake-horizontal" : "")}
            autoComplete="off"
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            onKeyDownCapture={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        )}
        {eventStep === 2 && (
          <select
            name="input"
            id="input"
            className="home__wrap__input"
            onChange={(event) => {
              setInputValue(event.target.value);
              console.log(event.target.value);
            }}
            onKeyDownCapture={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="locked">Locked</option>
          </select>
        )}
      </form>
      <Dots clientCoordinates={clientCoordinates} />
    </section>
  );
};

export default Home;
