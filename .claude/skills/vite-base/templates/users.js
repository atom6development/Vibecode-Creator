// src/lib/mocks/users.js
// Credenciais da POC — informe na entrega.
export const users = [
  { id: 1, name: "Ana Souza", email: "admin@exemplo.com", password: "123456", role: "admin" },
  { id: 2, name: "Bruno Lima", email: "user@exemplo.com", password: "123456", role: "user" },
];

// a senha nunca sai daqui
export function toPublicUser({ id, name, email, role }) {
  return { id, name, email, role };
}

export function findUser(email, password) {
  return users.find((u) => u.email === email && u.password === password) ?? null;
}
