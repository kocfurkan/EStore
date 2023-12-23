import { Cart } from "./basket";

export interface User {
  email: string;
  token: string;
  cart?: Cart;
}
