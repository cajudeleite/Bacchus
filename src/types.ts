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
  date: number;
};

export type IPartialEvent = {
  id: number;
  name: string;
  location: string;
};

export type IRoute = "map" | "search" | "login" | "location" | "show" | "error";

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}
