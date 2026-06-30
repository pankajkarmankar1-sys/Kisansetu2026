"use client";

import { AuthContext } from "../context/AuthContext";

export default function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
}
