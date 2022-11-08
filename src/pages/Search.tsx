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
}: // setEventUser,
{
  setRoute: (input: IRoute) => void;
  setEvent: React.Dispatch<React.SetStateAction<IEvent | undefined>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean | string>>;
  // setEventUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [triggerError, setTriggerError] = useState(false);
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

  const triggerShake = (delay = 0) => {
    setTimeout(() => {
      setTriggerError(true);
    }, delay);
  };

  const handleSearchEvent = async () => {
    setIsLoading(true);
    try {
      if (inputValue.length < minAndMaxNameLength[0]) throw new Error("Name is too short");

      const response = await searchEvent(inputValue);

      setEvent(response);
      setRoute("show");
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
        label={triggerError ? "Couldn't find event" : "Search event"}
        handleSubmit={handleSearchEvent}
        options={["open", "closed", "locked"]}
        showButton={inputValue.length > 0}
        buttonText="Search"
        regex={/^[a-z0-9-]*$/}
        maxLength={minAndMaxNameLength[1]}
        triggerError={triggerError}
        setTriggerError={setTriggerError}
        replaceCharByAnother={[[" ", "-"]]}
      />
      {!inputValue && (
        <Button
          text={userHasEvent ? "See my event" : "Create event"}
          callback={() => setRoute(userHasEvent ? "show" : "create")}
          variant="secondary"
        />
      )}
    </div>
  );
};

export default Search;
