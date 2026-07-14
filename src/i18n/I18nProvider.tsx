"use client";

import { createContext, useContext, useMemo } from "react";
import { type Dictionary, type Locale, defaultLocale, getDictionary } from "./index";

const I18nContext = createContext<Dictionary>(getDictionary(defaultLocale));

export function I18nProvider({
  locale = defaultLocale,
  children,
}: {
  locale?: Locale;
  children: React.ReactNode;
}) {
  const dictionary = useMemo(() => getDictionary(locale), [locale]);
  return <I18nContext.Provider value={dictionary}>{children}</I18nContext.Provider>;
}

export function useTranslations(): Dictionary {
  return useContext(I18nContext);
}
