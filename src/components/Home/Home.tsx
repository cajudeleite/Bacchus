import React, { useState } from "react";
import "./styles.scss";
import { searchEvent } from "../../api/event";
import { logInAPI, signUpAPI } from "../../api/session";

const Home = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [logIn, setLogIn] = useState<boolean>(false);
  const [signUp, setSignUp] = useState<boolean>(false);
  const [createParty, setCreateParty] = useState<boolean>(false);

  const handleParty: () => void = async () => {
    const response: any = await searchEvent(inputValue);
    switch (response.status) {
      case 404:
        console.log("Party does not exist");
        setCreateParty(true);
        break;

      case 200:
        console.log(response.data);
        break;

      case 401:
        setLogIn(true);
        setInputValue("");
        break;

      default:
        console.error("Error in party get");
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

  return (
    <section className="home">
      <form
        id="form-wrap"
        className="home__wrap"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!logIn && !signUp) {
            console.log("Party");
            handleParty();
          } else if (logIn) {
            console.log("Log In");
            handleLogIn();
          } else if (signUp) {
            console.log("Sign Up");
            handleSignUp();
          }
        }}
      >
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
        {(logIn || signUp || createParty) && (
          <button type="submit" className="home__wrap__submit">
            {logIn && "Log In"}
            {signUp && "Sign Up"}
            {createParty && "Create Party"}
          </button>
        )}
      </form>
    </section>
  );
};

export default Home;
