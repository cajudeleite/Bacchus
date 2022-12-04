import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { IRoute } from "../types";
import { getMinAndMaxUsernameLength, setUsername } from "../web3/bacchus";

const Onboarding = ({
  setRoute,
  setIsLoading,
  setErrorText,
}: {
  setRoute: (input: IRoute) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean | string>>;
  setErrorText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [triggerError, setTriggerError] = useState(false);
  const [minAndMaxÙsernameLength, setMinAndMaxUsernameLength] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const getUsernameLengthValues = async () => {
      try {
        const response = await getMinAndMaxUsernameLength();
        setMinAndMaxUsernameLength(response);
      } catch (error) {
        console.error(error);

        setRoute("error");
      }
    };

    getUsernameLengthValues();
  }, [setRoute]);

  const onChange = (value: string) => {
    const newValue = value[value.length - 1] === " " ? inputValue + "-" : value;

    if (newValue.match(/^[a-z0-9-]*$/) && newValue.length <= minAndMaxÙsernameLength[1]) {
      setInputValue(newValue);
    } else {
      setTriggerError(true);
    }
  };

  const onSubmit = async () => {
    if (inputValue.length < minAndMaxÙsernameLength[0]) {
      setTriggerError(true);
      return;
    }

    setIsLoading("Setting your username");
    try {
      await setUsername(inputValue);
      setRoute("map");
    } catch (error: any) {
      setErrorText(error.message);
      setRoute("error");
    }
    setIsLoading(false);
  };

  return (
    <section className="w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col space-y-4 font-mono">
      <Input
        inputValue={inputValue}
        onChange={onChange}
        onSubmit={onSubmit}
        label="Username"
        triggerError={triggerError}
        setTriggerError={setTriggerError}
      />
      {inputValue && !triggerError && <Button text="Set Username" onClick={onSubmit} />}
    </section>
  );
};

export default Onboarding;