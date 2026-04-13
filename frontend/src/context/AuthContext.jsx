import { createContext, useContext, useEffect, useState } from "react";

import { api, attachToken, setUnauthorizedHandler } from "../services/api";


const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = "private-image-share-token";
const ADMIN_STORAGE_KEY = "private-image-share-admin";


function readStoredAdmin() {
  const storedValue = localStorage.getItem(ADMIN_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    return null;
  }
}


attachToken(localStorage.getItem(TOKEN_STORAGE_KEY));


export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [admin, setAdmin] = useState(readStoredAdmin);

  const performLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    attachToken(null);
    setToken(null);
    setAdmin(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      performLogout();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/login", credentials);
    const nextToken = response.data.token;
    const nextAdmin = response.data.admin;

    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(nextAdmin));
    attachToken(nextToken);
    setToken(nextToken);
    setAdmin(nextAdmin);

    return response.data;
  };

  const logout = () => {
    performLogout();
  };

  const value = {
    token,
    admin,
    isReady: true,
    isAuthenticated: Boolean(token),
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
