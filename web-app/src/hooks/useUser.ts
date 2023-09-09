import { useContext } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { AuthContext } from "../context/AuthContext";

// NOTE: optimally move this into a separate file
export interface User {
  username: string;
  authToken?: string;
}

export const useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setItem, removeItem } = useLocalStorage();

  const addUser = (user: User) => {
    setUser(user);
    setItem("user", JSON.stringify(user));
  };

  const removeUser = () => {
    setUser(null);
    removeItem("user");
  };

  return { user, addUser, removeUser };
};
