/* eslint-disable no-restricted-globals */
import React, { useEffect, useRef } from "react";
import "./styles.scss";

const Input = ({
  inputValue,
  onChange,
  onSubmit,
  type = "text",
  label,
  labelAlignment = "center",
  triggerError = false,
  setTriggerError,
}: {
  inputValue: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  type?: string;
  label?: string;
  labelAlignment?: "center" | "start";
  triggerError?: boolean;
  setTriggerError?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const labelRef = useRef<HTMLLabelElement | null>(null);

  useEffect(() => {
    const shakeInput = () => {
      const input = inputRef.current;
      const label = labelRef.current;

      if (!input || !label) return;

      input.classList.add("shake-horizontal");
      label.classList.add("shake-horizontal");

      setTimeout(() => {
        input.classList.remove("shake-horizontal");
        label.classList.remove("shake-horizontal");
        setTriggerError && setTriggerError(false);
      }, 1500);
    };

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") onSubmit();
    };

    if (triggerError) shakeInput();

    addEventListener("keydown", handleEnter);
    return () => {
      removeEventListener("keydown", handleEnter);
    };
  }, [triggerError, setTriggerError, onSubmit]);

  return (
    <div id="form-wrap" className="w-full flex flex-col space-y-4 text-white text-xl">
      {label && (
        <label
          htmlFor="input"
          id="label"
          className={`text-${labelAlignment} opacity-40 capitalize ${labelAlignment === "start" && "after:content-[':']"}`}
          ref={(ref) => (labelRef.current = ref)}
        >
          {label}
        </label>
      )}
      <input
        value={inputValue}
        type={type}
        min="0"
        name="input"
        id="input"
        className="h-12 w-full px-2 border-2 border-white opacity-40 bg-transparent text-center text-white text-lg outline-none appearance-none"
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
        ref={(ref) => (inputRef.current = ref)}
      />
    </div>
  );
};

export default Input;
