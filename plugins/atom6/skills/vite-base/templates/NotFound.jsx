import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-eyebrow text-muted uppercase">Erro 404</p>
      <h1 className="text-responsive-xl font-bold text-heading">Página não encontrada</h1>
      <p className="max-w-prose text-responsive-md text-muted">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary-hover"
      >
        Voltar para a home
      </Link>
    </main>
  );
}
