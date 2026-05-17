/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const normalizeAuthResponse = (data) => {
  const token = data?.token || data?.data?.token;
  const user =
    data?.user ||
    data?.data?.user ||
    (data?._id && {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    }) ||
    (data?.data?._id && {
      _id: data.data._id,
      name: data.data.name,
      email: data.data.email,
      role: data.data.role,
    });

  if (!token || !user) {
    throw new Error("Invalid authentication response");
  }

  return { token, user };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const saveAuth = useCallback((authData) => {
    const normalizedAuth = normalizeAuthResponse(authData);

    localStorage.setItem("token", normalizedAuth.token);
    localStorage.setItem("user", JSON.stringify(normalizedAuth.user));
    setToken(normalizedAuth.token);
    setUser(normalizedAuth.user);

    return normalizedAuth;
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return saveAuth(data);
  }, [saveAuth]);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return saveAuth(data);
  }, [saveAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      register,
    }),
    [login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
