import React, { useEffect, useState } from "react";
import { randomNumber } from "../utils";
import "./styles.scss";

const Loading = ({ isLoading }: { isLoading?: boolean | string }) => {
  const [rotateDirection, setRotateDirection] = useState<string>("right");

  useEffect(() => {
    if (rotateDirection === "out") return;
    const possibleRotateDirections = ["left", "right", "top", "bottom"];
    const changeRotationToARandomDirection = () => {
      const randomIndex = randomNumber(0, possibleRotateDirections.length - 2);
      setRotateDirection(possibleRotateDirections.filter((e) => e !== rotateDirection)[randomIndex]);
    };

    const changeRotationDirection = setTimeout(changeRotationToARandomDirection, 2000);

    return () => {
      clearTimeout(changeRotationDirection);
    };
  }, [rotateDirection]);

  return (
    <div className="h-screen w-screen absolute flex flex-col space-y-4 justify-center items-center text-white bg-background z-20">
      <h1 className={`severe-lower-case text-8xl opacity-80 rotate-${rotateDirection}`}>B</h1>
      {isLoading?.toString() !== "true" && <h2 className="opacity-40">{isLoading}</h2>}
    </div>
  );
};

export default Loading;
