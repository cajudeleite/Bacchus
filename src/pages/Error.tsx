import React, { useState } from "react";
import Button from "../components/Button";
import { testGet } from "../web3/event";

const Error = () => {
  const [text, setText] = useState("No text");
  const testWeb3 = async () => {
    try {
      const response = await testGet();
      setText(response);
    } catch (error) {
      setText("Error");
    }
  };
  return (
    <div className="flex flex-col space-y-5 text-center text-white opacity-70">
      <h1 className="severe-lower-case text-8xl">M</h1>
      <p className="">An error has occurred, please try again later</p>
      <Button text="Explore the metaverse" callback={testWeb3} />
      <p>{text}</p>
    </div>
  );
};

export default Error;
