// src/context/AuthContext.js
// Separado do provider: arquivo que exporta componente não pode exportar
// mais nada, senão o Fast Refresh para de funcionar (react-refresh).
import { createContext } from "react";

export const AuthContext = createContext(null);
