import React from "react";

const Error = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col space-y-5 text-center text-red-400 opacity-70">
      <h1 className="severe-lower-case text-8xl">B</h1>
      <p>{text}</p>
    </div>
  );
};

export default Error;
