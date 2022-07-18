import React, { useState } from "react";
import "./styles.scss";
import { logInAPI } from "../../api/session";
import { IRoute } from "../../types";

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
        console.error("Error in log in");
        break;
    }
  };

  return (
    <section className="login">
      <form
        id="form-wrap"
        className="login__wrap"
        onSubmit={(event) => {
          event.preventDefault();
          handleLogIn();
        }}
      >
        <input
          value={login}
          type="text"
          name="input"
          id="input"
          className="login__wrap__input"
          onChange={(event) => {
            setLogin(event.target.value);
          }}
        />
        <input
          value={password}
          type="password"
          name="input"
          id="password"
          className="login__wrap__input"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button type="submit" className="login__wrap__submit">
          Log In
        </button>
        <p className="login__wrap__link" onClick={() => setRoute("register")}>
          Create new account
        </p>
      </form>
    </section>
  );
};

export default LogIn;
