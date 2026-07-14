import Link from "next/link";
import { getDictionary } from "@/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const t = getDictionary();
  const featureKeys = ["types", "design", "preview", "export"] as const;

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-azul-profundo px-4 py-16 text-center text-white lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{t.home.title}</h1>
            <p className="mt-4 text-base text-azul-profundo-50 sm:text-lg">{t.home.subtitle}</p>
            <Link
              href="/gerador"
              className="mt-8 inline-flex items-center justify-center rounded-md bg-azul-cyan px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-azul-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-azul-profundo"
            >
              {t.home.cta}
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-cinza-antracite">{t.home.featuresTitle}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featureKeys.map((key) => (
              <div key={key} className="rounded-lg border border-cinza-medio-100 p-6">
                <h3 className="mb-2 text-lg font-semibold text-azul-profundo">{t.home.features[key].title}</h3>
                <p className="text-sm text-cinza-antracite-200">{t.home.features[key].description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
