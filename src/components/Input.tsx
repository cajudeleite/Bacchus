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
  labelAlignment = "center",
  showButton = false,
  buttonText,
  regex,
  maxLength,
  triggerError = false,
  setTriggerError,
  errorCondition = false,
  replaceCharByAnother,
}: {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  type?: string;
  handleSubmit: any;
  options?: string[];
  label?: string;
  labelAlignment?: "center" | "start";
  showButton?: boolean;
  buttonText?: string;
  regex?: RegExp;
  maxLength?: number;
  triggerError?: boolean;
  setTriggerError?: React.Dispatch<React.SetStateAction<boolean>>;
  errorCondition?: boolean;
  replaceCharByAnother?: string[][];
}) => {
  const [inputError, setInputError] = useState<string>("");

  const shakeInput = useCallback(() => {
    setInputError(" shake-horizontal");
    setTimeout(() => {
      setInputError("");
      setTriggerError && setTriggerError(false);
    }, 400);
  }, [setTriggerError]);

  const checkCondition = useCallback(
    () => (inputValue.length === 0 || errorCondition ? shakeInput() : handleSubmit()),
    [errorCondition, handleSubmit, inputValue, shakeInput]
  );

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") inputValue.length > 0 ? checkCondition() : shakeInput();
    };

    if (triggerError) shakeInput();

    addEventListener("keydown", handleEnter);
    return () => {
      removeEventListener("keydown", handleEnter);
    };
  }, [triggerError, inputValue, handleSubmit, shakeInput, checkCondition]);

  const inputStyle =
    "h-12 w-full px-2 border-2 border-white opacity-40 bg-transparent text-center text-white outline-none appearance-none" + inputError;

  return (
    <div id="form-wrap" className="w-full flex flex-col space-y-4 text-white text-xl">
      {label && (
        <label
          htmlFor="input"
          className={`text-${labelAlignment} opacity-40 capitalize ${inputError} ${labelAlignment === "start" && "after:content-[':']"}`}
        >
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
            const value = event.target.value;

            if (replaceCharByAnother) {
              for (let i = 0; i < replaceCharByAnother.length; i++) {
                const charAndReplacer = replaceCharByAnother[i];
                if (value[value.length - 1] === charAndReplacer[0]) {
                  setInputValue(inputValue + charAndReplacer[1]);
                  return;
                }
              }
            }

            if ((regex && !value.match(regex)) || (maxLength && value.length > maxLength)) {
              shakeInput();
              return;
            }

            setInputValue(value);
          }}
        />
      )}
      {buttonText && showButton && <Button text={buttonText} callback={inputValue.length > 0 ? checkCondition : shakeInput} />}
    </div>
  );
};

export default Input;
