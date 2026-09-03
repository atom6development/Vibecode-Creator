// src/components/layout/AppLayout.jsx
// O que está fora do <Outlet /> não remonta na troca de rota.
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
