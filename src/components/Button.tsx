import React from "react";

const Button = ({
  text,
  callback,
  variant = "primary",
  size = "normal",
}: {
  text: string;
  callback: () => void;
  variant?: "primary" | "secondary";
  size?: "normal" | "full";
}) => (
  <button
    className={`${size === "full" && "w-full"} h-12 flex justify-center ${
      variant === "primary" ? "items-center px-6 border-2 border-white text-xl" : "items-end underline text-lg"
    } bg-transparent opacity-40 text-center text-white`}
    onClick={callback}
  >
    {text}
  </button>
);

export default Button;
