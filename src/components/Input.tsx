/* eslint-disable no-restricted-globals */
import React, { useCallback, useEffect, useState } from "react";
import Button from "./Button";
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
  triggerError = false,
  errorCondition = false,
}: {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  type?: string;
  handleSubmit: any;
  options?: string[];
  label?: string;
  buttonText?: string;
  regex?: RegExp;
  triggerError?: boolean;
  errorCondition?: boolean;
}) => {
  const [inputError, setInputError] = useState<string>("");

  const shakeInput = () => {
    setInputError(" shake-horizontal");
    setTimeout(() => {
      setInputError("");
    }, 400);
  };

  const handleEnter = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") inputValue.length > 0 ? handleSubmit() : shakeInput();
    },
    [handleSubmit, inputValue]
  );

  useEffect(() => {
    if (triggerError) shakeInput();
  }, [triggerError]);

  useEffect(() => {
    addEventListener("keydown", handleEnter);
    return () => {
      removeEventListener("keydown", handleEnter);
    };
  }, [handleEnter]);

  const inputStyle =
    "h-12 w-full px-2 border-2 border-white opacity-40 bg-transparent text-center text-white outline-none appearance-none" + inputError;

  return (
    <div id="form-wrap" className="w-1/4 flex flex-col space-y-4 text-white text-xl">
      {label && (
        <label htmlFor="input" className={"text-center opacity-40" + inputError}>
          {label}
        </label>
      )}
      {type === "select" && options ? (
        <select
          name="input"
          id="input"
          className={inputStyle}
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
          className={inputStyle}
          autoComplete="off"
          onChange={(event) => {
            regex && !event.target.value.match(regex) ? shakeInput() : setInputValue(event.target.value);
          }}
        />
      )}
      {buttonText && <Button text={buttonText} callback={inputValue.length > 0 ? handleSubmit : shakeInput} />}
    </div>
  );
};

export default Input;
