import React, { useEffect, useState } from "react";
import { getEvent, searchEvent, userEvent } from "../web3/event";
import { IEvent, IRoute } from "../types";
import Input from "../components/Input";
import Button from "../components/Button";
import { getMinAndMaxNameLength } from "../web3/bacchus";

const Search = ({
  setRoute,
  setEvent,
  setIsLoading,
}: {
  setRoute: (input: IRoute) => void;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean | string>>;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [triggerError, setTriggerError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error occured");
  const [userHasEvent, setUserHasEvent] = useState(false);
  const [minAndMaxNameLength, setMinAndMaxNameLength] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const userHasEvent = async () => {
      setIsLoading(true);
      try {
        const response = await userEvent();
        setUserHasEvent(response > 0);
        if (response > 0) {
          const event = await getEvent(response);

          setEvent(event);
        }
      } catch (error) {
        setRoute("error");
      }
      setIsLoading(false);
    };

    const getNameLengthValues = async () => {
      try {
        const response = await getMinAndMaxNameLength();
        setMinAndMaxNameLength(response);
      } catch (error) {
        console.error(error);

        setRoute("error");
      }
    };

    userHasEvent();
    getNameLengthValues();
  }, [setRoute, setIsLoading, setEvent]);

  const onChange = (value: string) => {
    const newValue = value[value.length - 1] === " " ? inputValue + "-" : value;

    if (!newValue.match(/^[a-z0-9-]*$/)) {
      setErrorMessage("Invalid Character");
      setTriggerError(true);
    } else if (newValue.length > minAndMaxNameLength[1]) {
      setErrorMessage("Too Long");
      setTriggerError(true);
    } else {
      setInputValue(newValue);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      if (inputValue.length < minAndMaxNameLength[0]) throw new Error("Too short");

      const response = await searchEvent(inputValue);

      setEvent(response);
      setRoute("show");
    } catch (error: any) {
      setErrorMessage(error.message);
      setTriggerError(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col space-y-4 font-mono">
      <Input
        inputValue={inputValue}
        onChange={onChange}
        onSubmit={onSubmit}
        label={triggerError ? errorMessage : "Search Event"}
        triggerError={triggerError}
        setTriggerError={setTriggerError}
      />
      {inputValue && <Button text="Search" onClick={onSubmit} />}
      {!inputValue && (
        <Button
          text={userHasEvent ? "See my event" : "Create event"}
          onClick={() => setRoute(userHasEvent ? "show" : "create")}
          variant="secondary"
        />
      )}
    </div>
  );
};

export default Search;
