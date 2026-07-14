import Link from "next/link";
import { CaetanoLogo } from "./CaetanoLogo";

export function Header() {
  return (
    <header className="border-b border-cinza-medio-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-4 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-cyan"
        >
          <CaetanoLogo className="h-6 w-auto" />
          <span className="sr-only">Caetano</span>
          <span className="text-sm font-medium text-cinza-antracite-200">QR</span>
        </Link>
      </div>
    </header>
  );
}
