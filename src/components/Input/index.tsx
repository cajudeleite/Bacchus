/* eslint-disable no-restricted-globals */
import React, { useCallback, useEffect, useState } from "react";
import "./styles.scss";

const Input = ({
  inputValue,
  setInputValue,
  type = "text",
  handleSubmit,
  options,
  label,
  buttonText,
  regex,
  triggerError,
}: {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  type?: string;
  handleSubmit: any;
  options?: string[];
  label?: string;
  buttonText?: string;
  regex?: RegExp;
  triggerError: boolean;
}) => {
  const [inputError, setInputError] = useState<string>("");

  const shakeInput = () => {
    setInputError(" shake-horizontal");
    setTimeout(() => {
      setInputError("");
    }, 400);
  };

  const handleEvent = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && inputValue.length > 0) handleSubmit();
      else shakeInput();
    },
    [handleSubmit, inputValue]
  );

  useEffect(() => {
    if (triggerError) shakeInput();
  }, [triggerError]);

  useEffect(() => {
    addEventListener("keydown", handleEvent);
    return () => {
      removeEventListener("keydown", handleEvent);
    };
  }, [handleEvent]);

  return (
    <div id="form-wrap" className="wrap">
      {label && (
        <label htmlFor="input" className={"wrap__title" + inputError}>
          {label}
        </label>
      )}
      {type === "select" && options ? (
        <select
          name="input"
          id="input"
          className={"wrap__input" + inputError}
          style={{ textTransform: "capitalize" }}
          value={inputValue ? inputValue : options[0]}
          onChange={(event) => setInputValue(event.target.value)}
        >
          {options &&
            options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      ) : (
        <input
          value={inputValue}
          type={type}
          min="0"
          name="input"
          id="input"
          className={"wrap__input" + inputError}
          autoComplete="off"
          onChange={(event) => {
            regex && !event.target.value.match(regex) ? shakeInput() : setInputValue(event.target.value);
          }}
        />
      )}
      {buttonText && (
        <button className="wrap__button" onClick={inputValue.length > 0 ? handleSubmit : shakeInput}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Input;
