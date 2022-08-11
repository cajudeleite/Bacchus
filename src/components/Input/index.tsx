import React from "react";
import "./styles.scss";

const Input = ({
  inputValue,
  setInputValue,
  inputError,
  type = "text",
  handleSubmit,
  options,
  label,
}: {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputError?: boolean;
  type?: string;
  handleSubmit?: any;
  options?: string[];
  label?: string;
}) => (
  <div id="form-wrap" className="wrap">
    {label && (
      <label htmlFor="input" className={"wrap__title" + (inputError ? " shake-horizontal" : "")}>
        {label}
      </label>
    )}
    {type === "select" && options ? (
      <select
        name="input"
        id="input"
        className="wrap__input"
        style={{ textTransform: "capitalize" }}
        value={inputValue ? inputValue : options[0]}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDownCapture={(event) => {
          if (event.key === "Enter") {
            if (!inputValue) setInputValue(options[0]);
            handleSubmit && handleSubmit();
          }
        }}
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
        className={"wrap__input" + (inputError ? " shake-horizontal" : "")}
        autoComplete="off"
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        onKeyDownCapture={(event) => {
          if (event.key === "Enter") {
            handleSubmit && handleSubmit();
          }
        }}
      />
    )}
  </div>
);

export default Input;
