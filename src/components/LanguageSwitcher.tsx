'use client';

import {useEffect, useMemo, useState} from 'react';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';

const LANGUAGES = [
  {code: 'en', label: 'English'},
  {code: 'hi', label: 'हिंदी'},
  {code: 'mr', label: 'मराठी'},
  {code: 'gu', label: 'ગુજરાતી'},
  {code: 'ta', label: 'தமிழ்'}
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = useState(locale);

  useEffect(() => {
    setSelected(locale);
  }, [locale]);

  const languageOptions = useMemo(
    () => LANGUAGES.map((language) => ({...language, display: `🇮🇳 ${language.label}`})),
    []
  );

  const buildLocalePath = (nextLocale: string) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return `/${nextLocale}`;
    segments[0] = nextLocale;
    return `/${segments.join('/')}`;
  };

  const onChangeLocale = (nextLocale: string) => {
    setSelected(nextLocale);
    localStorage.setItem('preferred-locale', nextLocale);
    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000`;
    router.replace(buildLocalePath(nextLocale));
  };

  useEffect(() => {
    const savedLocale = localStorage.getItem('preferred-locale');
    if (!savedLocale || savedLocale === locale) return;
    onChangeLocale(savedLocale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <select
      value={selected}
      onChange={(event) => onChangeLocale(event.target.value)}
      className="h-8 rounded-full border border-slate-200 bg-white px-2 text-[10px] font-bold text-slate-700 shadow-sm"
      aria-label="Select language"
    >
      {languageOptions.map((language) => (
        <option key={language.code} value={language.code}>
          {language.display}
        </option>
      ))}
    </select>
  );
}
