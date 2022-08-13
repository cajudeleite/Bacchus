export type IUser = {
  username: string;
  email: string;
  password: string;
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

export type IRoute = "home" | "login" | "register" | "location" | "show";
