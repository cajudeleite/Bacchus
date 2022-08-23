import React from "react";

const Button = ({ text, callback, variant = "primary" }: { text: string; callback: () => void; variant?: "primary" | "secondary" }) => (
  <button
    className={`h-12 ${
      variant === "primary" ? "w-full border-2 border-white text-xl" : "underline text-lg"
    } bg-transparent opacity-40 text-center text-white`}
    onClick={callback}
  >
    {text}
  </button>
);

export default Button;
