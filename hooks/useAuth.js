import { useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (data) => {
    setUser(data);
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    loading,
    setLoading,
    login,
    logout,
  };
}
