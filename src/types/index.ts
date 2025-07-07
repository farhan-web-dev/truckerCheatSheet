export type User = {
  _id: string;
  name: string;
  email: string;
  isOnline: boolean;
};

export type Message = {
  _id?: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp?: string;
};
