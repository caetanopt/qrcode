import type { Metadata } from "next";
import { getDictionary } from "@/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QrGeneratorApp } from "@/features/qr-generator/QrGeneratorApp";

export const metadata: Metadata = {
  title: "Gerador de QR Code",
  robots: { index: false, follow: false },
};

export default function GeneratorPage() {
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
