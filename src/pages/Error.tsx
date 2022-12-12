import React from "react";
import Button from "../components/Button";

const Error = ({ text, onClick }: { text: string; onClick?: (() => () => void) | undefined }) => (
  <div className="flex flex-col space-y-5 text-center items-center text-red-400 opacity-80">
    <h1 className="severe-lower-case text-8xl">B</h1>
    <p className="w-2/3 break-words">{text}</p>
    {onClick && <Button text="Try again" onClick={onClick} />}
  </div>
);

export default Error;
