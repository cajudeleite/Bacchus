import React, { useRef, useState } from "react";
import { logInAPI, signUpAPI } from "../api/session";
import { IRoute } from "../types";
import Button from "../components/Button";
import Input from "../components/Input";

const Register = ({
  setRoute,
  activateLoading,
}: {
  setRoute: (input: IRoute) => void;
  activateLoading: (callback: Promise<any>) => Promise<any>;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const user = useRef({
    username: "",
    email: "",
    password: "",
  });
  const [userStep, setUserStep] = useState<number>(0);

  const handleSignUp: () => void = async () => {
    try {
      await activateLoading(signUpAPI(user.current));
      await logInAPI(user.current.email, user.current.password);
      window.location.reload();
    } catch (error) {}
  };

  const handleSubmit = () => {
    switch (userStep) {
      case 0:
        user.current.username = inputValue;
        setInputValue("");
        setUserStep(1);
        break;
      case 1:
        user.current.email = inputValue;
        setInputValue("");
        setUserStep(2);
        break;
      case 2:
        user.current.password = inputValue;
        setInputValue("");
        handleSignUp();
        break;
      default:
        break;
    }
  };

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (
    <section className="w-1/2 lg:w-1/4 flex flex-col space-y-4 items-center">
      <Input
        inputValue={inputValue}
        setInputValue={setInputValue}
        type={userStep === 0 ? "text" : userStep === 1 ? "email" : "password"}
        handleSubmit={handleSubmit}
        label={Object.keys(user.current)[userStep]}
        labelAlignment="start"
        buttonText={userStep === 2 ? "Register" : undefined}
        regex={userStep === 0 ? /^\S*$/ : undefined}
        errorCondition={userStep === 1 ? !emailRegex.test(inputValue) : undefined}
      />
      {userStep === 0 && inputValue.length === 0 ? (
        <Button text="Connect to account" callback={() => setRoute("login")} variant="secondary" />
      ) : (
        <div className={`w-full flex flex-wrap-reverse ${userStep > 0 ? "justify-between" : "justify-end"}`}>
          {userStep > 0 && (
            <Button
              text="<- Back"
              callback={() => {
                setUserStep(userStep - 1);
                document.querySelector("input")?.focus();
              }}
              variant="secondary"
            />
          )}
          <Button text="Next ->" callback={handleSubmit} variant={userStep === 2 ? "primary" : "secondary"} />
        </div>
      )}
    </section>
  );
};

export default Register;
