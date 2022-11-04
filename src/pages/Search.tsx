import React, { useEffect, useState } from "react";
import { searchEvent } from "../web3/event";
import { IEvent, IRoute } from "../types";
import Input from "../components/Input";
import Button from "../components/Button";

const Search = ({
  setRoute,
  setEvent,
  setIsLoading,
}: // setEventUser,
{
  setRoute: (input: IRoute) => void;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [showButton, setShowButton] = useState<boolean>(false);
  const [triggerError, setTriggerError] = useState<boolean>(false);

  useEffect(() => {
    if (showButton) {
      setShowButton(false);
    }
  }, [inputValue, showButton]);

  const triggerShake = (delay = 0) => {
    setTimeout(() => {
      setTriggerError(true);
    }, delay);
  };

  const handleSearchEvent = async () => {
    // setIsLoading(true);
    try {
      const response: IEvent = await searchEvent(inputValue);
      console.log(response);

      // setEvent(response);
      // setRoute("show");
    } catch (error: any) {
      triggerShake();
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col space-y-4 font-mono">
      <Input
        inputValue={inputValue}
        setInputValue={setInputValue}
        label="Search event"
        handleSubmit={handleSearchEvent}
        options={["open", "closed", "locked"]}
        showButton={inputValue.length > 0}
        buttonText="Search"
        regex={/^[a-zA-Z0-9]*$/}
        triggerError={triggerError}
        setTriggerError={setTriggerError}
      />
      {!inputValue && <Button text="Create event" callback={() => setRoute("create")} variant="secondary" />}
    </div>
  );
};

export default Search;
