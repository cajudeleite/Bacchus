import React, { useEffect, useState } from "react";
import { randomNumber } from "../utils";
import "./styles.scss";

const Loading = ({
  callbackSuccess,
  setIsLoading,
}: {
  callbackSuccess?: boolean | undefined;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [rotateDirection, setRotateDirection] = useState<string>("right");

  useEffect(() => {
    if (callbackSuccess === undefined) return;
    if (callbackSuccess) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
    setRotateDirection("out");
  }, [callbackSuccess, setIsLoading]);

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
    <div className="h-full w-full absolute flex justify-center items-center bg-background">
      <h1
        style={{ color: callbackSuccess === false ? "rgba(255, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)" }}
        className={`severe-lower-case text-8xl rotate-${rotateDirection}`}
      >
        M
      </h1>
    </div>
  );
};

export default Loading;
