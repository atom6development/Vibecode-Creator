// src/lib/api/auth.js
import { api } from "@/lib/api/client";
import { delay, USE_MOCKS } from "@/lib/api/mock";
import { findUser, toPublicUser } from "@/lib/mocks/users";

export async function loginRequest({ email, password }) {
  if (USE_MOCKS) {
    await delay();
    const found = findUser(email, password);
    if (!found) throw new Error("E-mail ou senha inválidos.");

    const user = toPublicUser(found);
    return { user, token: `mock-token-${user.id}` };
  }
  return api.post("/auth/login", { email, password });
}
