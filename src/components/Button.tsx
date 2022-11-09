import React from "react";

const Button = ({
  text,
  onClick,
  variant = "primary",
  size = "normal",
}: {
  text: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  size?: "normal" | "full";
}) => (
  <button
    className={`${size === "full" && "w-full"} flex justify-center items-center bg-transparent opacity-40 text-center text-white ${
      variant === "primary" ? "h-12 px-6 border-2 border-white text-xl" : "underline text-lg"
    }`}
    onClick={onClick}
  >
    {text}
  </button>
);

export default Button;
