export type IUser = {
  id: string;
  username: string;
  reputation: number;
  verified: boolean;
  admin: boolean;
};

export type IEvent = {
  name: string;
  description: string;
  location: string;
  username: string;
  date: Date;
};

export type IPartialEvent = {
  id: number;
  name: string;
  location: string;
};

export type IRoute = "onboarding" | "map" | "search" | "create" | "connection" | "location" | "show" | "error";

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}
