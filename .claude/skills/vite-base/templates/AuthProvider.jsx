// src/context/AuthProvider.jsx
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { loginRequest } from "@/lib/api/auth";

const USER_KEY = "atom.auth.user";
const TOKEN_KEY = "atom.auth.token";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // inicializador lazy, não useEffect: a sessão precisa existir já no
  // primeiro render, senão o guard vê user=null e desloga a cada F5
  const [user, setUser] = useState(readStoredUser);
  const queryClient = useQueryClient();

  async function login(credentials) {
    const { user: loggedUser, token } = await loginRequest(credentials);

    localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedUser);
    return loggedUser;
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    // sem isto, o próximo login enxerga os dados em cache do usuário anterior
    queryClient.clear();
  }

  const value = { user, isAuthenticated: Boolean(user), login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
