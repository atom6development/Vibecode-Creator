// src/pages/Forbidden.jsx
import { Link } from "react-router";

export default function Forbidden() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-eyebrow text-muted uppercase">Acesso negado</p>
      <h1 className="text-responsive-xl font-bold text-heading">Você não tem permissão</h1>
      <p className="max-w-prose text-responsive-md text-muted">
        Esta área é restrita ao seu perfil de acesso. Fale com o administrador se precisar entrar.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary-hover"
      >
        Voltar para o início
      </Link>
    </main>
  );
}
