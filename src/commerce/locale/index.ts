import { useStorefront } from "../provider";

export function useLocale() {
  const { locale, locales, setLocale } = useStorefront();

  return {
    active: locales.find((item) => item.code === locale) ?? null,
    code: locale,
    available: locales,
    setLocale,
  };
}
