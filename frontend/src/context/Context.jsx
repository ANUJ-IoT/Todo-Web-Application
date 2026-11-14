import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export default function ContextProvider({ children }) {
  const [user, setUser] = useState("");
  const time = new Date();

  const day = time.toLocaleDateString("en-US", { weekday: "long" });
  const date = time.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <AuthContext.Provider value={{ user, setUser, day, date }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
