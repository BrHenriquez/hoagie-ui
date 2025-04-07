import { createContext, useState, Dispatch, SetStateAction } from "react";

type User = {
  id: string;
  name: string;
  email: string;
} | null;


type UserContextType = {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {
    throw new Error("setUser function must be used within a UserProvider");
  },
});

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

