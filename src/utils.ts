export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatErrorFromContract = (error: any) => new Error(error.message.slice(error.message.indexOf("'") + 1, error.message.length - 1));
