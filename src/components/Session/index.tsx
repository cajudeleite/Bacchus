import React, { useState } from "react";
import "./styles.scss";
import { logInAPI, signUpAPI } from "../../api/session";

const Session = ({
  route,
  setRoute,
}: {
  route: "home" | "signin" | "signup";
  setRoute: (input: "home" | "signin" | "signup") => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogIn: (verify?: boolean) => void = async (
    verify: boolean = false
  ) => {
    const response: any = await logInAPI(email, password);
    switch (response) {
      case 202:
        setRoute("home");
        setEmail("");
        setPassword("");
        break;
      case 404:
        if (!verify) {
          console.log("User does not exist");
          setRoute("signup");
        }
        break;
      case 406:
        console.log("Password incorrect");
        setPassword("");
        break;
      default:
        console.error("Error in log in");
        break;
    }
  };

  const handleSignUp: () => void = async () => {
    const response: any = await signUpAPI(email, password);
    if (response.status === 201) {
      await logInAPI(email, password);
      setEmail("");
      setPassword("");
      setRoute("home");
    } else {
      console.log("Error in sign up");
    }
  };

  const handleSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => void = async (event) => {
    event.preventDefault();
    if (route === "signin") {
      handleLogIn();
    } else if (route === "signup") {
      handleSignUp();
    }
  };

  return (
    <section className="session">
      <form id="form-wrap" className="session__wrap" onSubmit={handleSubmit}>
        <input
          value={email}
          type="text"
          name="input"
          id="input"
          className="session__wrap__input"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          value={password}
          type="password"
          name="input"
          id="password"
          className="session__wrap__input"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          onFocus={() => handleLogIn(true)}
        />
        <button type="submit" className="session__wrap__submit">
          {route === "signin" && "Log In"}
          {route === "signup" && "Sign Up"}
        </button>
      </form>
    </section>
  );
};

export default Session;
