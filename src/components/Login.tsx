import React, { useState } from "react";
import "./styles.scss";
import { logInAPI } from "../api/session";
import { IRoute } from "../types";
import Input from "./Input";
import Button from "./Button";

const LogIn = ({ setRoute, activateLoading }: { setRoute: (input: IRoute) => void; activateLoading: (callback: Promise<any>) => Promise<any> }) => {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogIn: (verify?: boolean) => void = async () => {
    const response: any = await activateLoading(logInAPI(login, password));

    switch (response.status) {
      case 202:
        window.location.reload();
        break;
      case 404:
        setRoute("register");
        break;
      case 401:
        setPassword("");
        break;
      default:
        break;
    }
  };

  return (
    <section className="w-full flex flex-col space-y-4 items-center">
      <Input
        inputValue={login}
        setInputValue={setLogin}
        label="Log In"
        handleSubmit={handleLogIn}
        errorCondition={login.length === 0 && password.length === 0}
      />
      <Input
        inputValue={password}
        setInputValue={setPassword}
        type="password"
        handleSubmit={handleLogIn}
        errorCondition={login.length === 0 && password.length === 0}
        buttonText="Log In"
      />
      <Button text="Create new account" callback={() => setRoute("register")} variant="secondary" />
    </section>
  );
};

export default LogIn;
