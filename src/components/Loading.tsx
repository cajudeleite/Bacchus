import React, { useEffect, useState } from "react";
import { randomNumber } from "../utils";
import "./styles.scss";

const Loading = () => {
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
    <div className="h-screen w-screen absolute flex justify-center items-center bg-background z-20">
      <h1 style={{ color: "rgba(255, 255, 255, 0.8)" }} className={`severe-lower-case text-8xl rotate-${rotateDirection}`}>
        B
      </h1>
    </div>
  );
};

export default Loading;
