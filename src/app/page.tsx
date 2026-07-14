import { getDictionary } from "@/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QrGeneratorApp } from "@/features/qr-generator/QrGeneratorApp";

export default function HomePage() {
  const t = getDictionary();

  return (
    <>
      <Header />
      <main id="main-content">
        <h1 className="sr-only">{t.nav.generator}</h1>
        <QrGeneratorApp />
      </main>
      <Footer />
    </>
  );
}
