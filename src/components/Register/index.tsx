import React, { useState } from "react";
import "./styles.scss";
import { logInAPI, signUpAPI } from "../../api/session";

const Register = ({ setRoute }: { setRoute: (input: "home" | "login" | "register") => void }) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignUp: () => void = async () => {
    const response: any = await signUpAPI(username, email, password);
    if (response.status === 201) {
      await logInAPI(email, password);
      setUsername("");
      setEmail("");
      setPassword("");
      setRoute("home");
    } else {
      console.log("Error in sign up");
    }
  };

  return (
    <section className="register">
      <form
        id="form-wrap"
        className="register__wrap"
        onSubmit={(event) => {
          event.preventDefault();
          handleSignUp();
        }}
      >
        <input
          value={username}
          type="text"
          name="username"
          id="username"
          className="register__wrap__input"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          value={email}
          type="email"
          name="email"
          id="email"
          className="register__wrap__input"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          value={password}
          type="password"
          name="password"
          id="password"
          className="register__wrap__input"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button type="submit" className="register__wrap__submit">
          Register
        </button>
        <p className="login__link" onClick={() => setRoute("login")}>
          Connect to account
        </p>
      </form>
    </section>
  );
};

export default Register;
