// src/lib/api/users.js
// Único lugar do projeto que sabe da existência do mock.
import { api } from "@/lib/api/client";
import { delay, USE_MOCKS } from "@/lib/api/mock";
import { toPublicUser, users } from "@/lib/mocks/users";

export async function getUsers() {
  if (USE_MOCKS) {
    await delay();
    return users.map(toPublicUser);
  }
  return api.get("/users");
}

export async function getUser(id) {
  if (USE_MOCKS) {
    await delay();
    const found = users.find((u) => u.id === Number(id));
    if (!found) throw new Error("Usuário não encontrado.");
    return toPublicUser(found);
  }
  return api.get(`/users/${id}`);
}

export async function createUser(payload) {
  if (USE_MOCKS) {
    await delay();
    return { id: Date.now(), ...payload };
  }
  return api.post("/users", payload);
}

export async function updateUser(id, payload) {
  if (USE_MOCKS) {
    await delay();
    return { id, ...payload };
  }
  return api.put(`/users/${id}`, payload);
}

export async function deleteUser(id) {
  if (USE_MOCKS) {
    await delay();
    return { id };
  }
  return api.delete(`/users/${id}`);
}
