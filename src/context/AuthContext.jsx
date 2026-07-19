import React, { createContext, useContext } from "react";
import { useGithubBridge } from "../hooks/useGithub.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useGithubBridge();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
