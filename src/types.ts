export type IUser = {
  id: string;
  username: string;
  reputation: number;
  verified: boolean;
  admin: boolean;
};

export type IEvent = {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: "open" | "closed " | "locked";
  address: string;
  date: string;
  invite_quantity: number;
  reputation: number;
  censored: boolean;
  closed: boolean;
  location: string;
  views: string[];
};

export type IRoute = "home" | "login" | "register" | "location" | "show" | "error";
