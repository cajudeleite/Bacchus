import React, { useEffect, useState } from "react";
import { randomNumber } from "../../utils";
import "./styles.scss";

const Loading = ({
  callback,
  setIsLoading,
}: {
  callback?: Promise<any> | undefined;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [rotateDirection, setRotateDirection] = useState<string>("right");
  const [loadingColor, setLoadingColor] = useState<string>("rgba(255, 255, 255, 0.8)");

  useEffect(() => {
    if (callback === undefined) return;

    const waitForResponse = async () => {
      try {
        const response = await callback;
        if (response.status.toString()[0] !== "2") throw new Error("Error in loading");
      } catch (error) {
        console.error(error);
        setLoadingColor("rgba(255, 0, 0, 0.8)");
        setRotateDirection("out");
      }

      const closeItself = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(closeItself);
    };

    waitForResponse().catch(console.error);
  }, [callback, setIsLoading]);

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
    <div className="loading">
      <h1 style={{ color: loadingColor }} className={`loading__logo rotate-${rotateDirection}`}>
        M
      </h1>
    </div>
  );
};

export default Loading;
