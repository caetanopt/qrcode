import { getDictionary } from "@/i18n";

export function Footer() {
  const t = getDictionary();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cinza-medio-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center lg:px-8">
        <p className="text-sm font-medium text-claim">{t.common.claim}</p>
        <p className="text-xs text-cinza-antracite-200">© {year} Caetano. {t.common.appName}.</p>
      </div>
    </footer>
  );
}
