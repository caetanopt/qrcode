import Link from "next/link";
import { getDictionary } from "@/i18n";

export function Header() {
  const t = getDictionary();

  return (
    <header className="border-b border-cinza-medio-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-baseline gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan">
          <span className="text-xl font-bold lowercase text-azul-cyan">caetano</span>
          <span className="text-sm font-medium text-cinza-antracite-200">QR</span>
        </Link>
        <nav aria-label={t.nav.generator}>
          <Link
            href="/gerador"
            className="rounded-md bg-azul-profundo px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-azul-profundo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan focus-visible:ring-offset-2"
          >
            {t.nav.generator}
          </Link>
        </nav>
      </div>
    </header>
  );
}
