// src/lib/api/mock.js
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

// latência fake: sem ela o loading nunca aparece em dev
export function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
