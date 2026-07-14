import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { I18nProvider } from "@/i18n/I18nProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { getDictionary } from "@/i18n";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const SITE_URL = "https://qrcode.caetano.pt";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Caetano QR — Gerador de QR Codes personalizados",
    template: "%s | Caetano QR",
  },
  description:
    "Crie, personalize e descarregue QR Codes profissionais para marketing, eventos, restauração e comunicação empresarial.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: SITE_URL,
    siteName: "Caetano QR",
    title: "Caetano QR — Gerador de QR Codes personalizados",
    description:
      "Crie, personalize e descarregue QR Codes profissionais para marketing, eventos, restauração e comunicação empresarial.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caetano QR — Gerador de QR Codes personalizados",
    description:
      "Crie, personalize e descarregue QR Codes profissionais para marketing, eventos, restauração e comunicação empresarial.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const t = getDictionary();

  return (
    <html lang="pt-PT" className={montserrat.variable}>
      <body className="font-sans">
        <a href="#main-content" className="skip-link">
          {t.a11y.skipToContent}
        </a>
        <I18nProvider>
          <ToastProvider>{children}</ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
