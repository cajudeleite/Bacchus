import React, { useRef, useState } from "react";
import "./styles.scss";
import { logInAPI, signUpAPI } from "../../api/session";
import { IUser } from "../../types";

const Register = ({ setRoute }: { setRoute: (input: "home" | "login" | "register") => void }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const user = useRef<IUser>({
    username: "",
    email: "",
    password: "",
  });
  const [userStep, setUserStep] = useState<number>(0);

  const handleSignUp: () => void = async () => {
    const response: any = await signUpAPI(user.current);
    if (response.status === 201) {
      await logInAPI(user.current.email, user.current.password);
      window.location.reload();
    } else {
      console.log("Error in sign up");
    }
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

  return (
    <section className="register">
      <form
        id="form-wrap"
        className="register__wrap"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <label htmlFor="input" className="register__wrap__label">
          {Object.keys(user.current)[userStep]}
        </label>
        <input
          value={inputValue}
          type={userStep === 0 ? "text" : userStep === 1 ? "email" : "password"}
          name="input"
          id="input"
          className="register__wrap__input"
          autoComplete="off"
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
        {userStep === 2 && (
          <button type="submit" className="register__wrap__submit">
            Register
          </button>
        )}
        {userStep === 0 && (
          <p className="register__wrap__link" onClick={() => setRoute("login")}>
            Connect to account
          </p>
        )}
      </form>
    </section>
  );
};

export default Register;