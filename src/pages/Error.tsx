import React from "react";
import Button from "../components/Button";

const Error = ({ text, onClick }: { text: string; onClick?: (() => () => void) | undefined }) => (
  <div className="flex flex-col space-y-5 text-center text-red-400 opacity-70">
    <h1 className="severe-lower-case text-8xl">B</h1>
    <p>{text}</p>
    {onClick && <Button text="Try again" onClick={onClick} />}
  </div>
);

export default Error;
