import React, { useRef, useState } from "react";
import "./styles.scss";
import { searchEvent, createEvent } from "../../api/event";
import { logInAPI, signUpAPI } from "../../api/session";

type IEvent = [name: string, description: string, status: string, address: string, date: string, invite_quantity: number];

const Home = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [logIn, setLogIn] = useState<boolean>(false);
  const [signUp, setSignUp] = useState<boolean>(false);
  const [createEventTrigger, setCreateEventTrigger] = useState<boolean>(false);
  const eventSteps = ["Name", "Description", "Status", "Address", "Date", "Invite Quantity"];
  const [eventStep, setEventStep] = useState<number>(0);
  const eventInfo: IEvent = useRef<IEvent>(["", "", "open", "", "", 0]).current;

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
        setLogIn(true);
        setInputValue("");
        break;

      default:
        console.error("Error in event get");
        break;
    }
  };

  const handleLogIn: () => void = async () => {
    const response: any = await logInAPI(inputValue, password);
    switch (response) {
      case 202:
        setLogIn(false);
        setInputValue("");
        setPassword("");
        break;
      case 404:
        console.log("User does not exist");
        setLogIn(false);
        setSignUp(true);
        break;
      case 406:
        console.log("Wrong password");
        setSignUp(false);
        setLogIn(true);
        break;
      default:
        console.error("Error in log in");
        break;
    }
  };

  const handleSignUp: () => void = async () => {
    const response: any = await signUpAPI(inputValue, password);
    if (response.status === 201) {
      await logInAPI(inputValue, password);
      setSignUp(false);
      setLogIn(false);
      setInputValue("");
      setPassword("");
    } else {
      console.log("Error in sign up");
    }
  };

  const handleCreateEventTrigger: () => void = async () => {
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

  const handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void = async (event) => {
    event.preventDefault();
    if (logIn) {
      handleLogIn();
    } else if (signUp) {
      handleSignUp();
    } else if (createEventTrigger) {
      console.log(eventInfo);
      handleCreateEventTrigger();
    } else {
      handleEvent();
    }
  };

  return (
    <section className="home">
      <form id="form-wrap" className="home__wrap" onSubmit={handleSubmit}>
        {createEventTrigger && <h1 className="home__wrap__title">{eventSteps[eventStep]}</h1>}
        <input
          value={inputValue}
          type="text"
          name="input"
          id="input"
          className="home__wrap__input"
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
        {(logIn || signUp) && (
          <input
            value={password}
            type="password"
            name="input"
            id="password"
            className="home__wrap__input"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            onFocus={() => handleLogIn()}
          />
        )}
        {(logIn || signUp || createEventTrigger) && (
          <button type="submit" className="home__wrap__submit">
            {logIn && "Log In"}
            {signUp && "Sign Up"}
            {createEventTrigger && "Create Event"}
          </button>
        )}
      </form>
    </section>
  );
};

export default Home;
