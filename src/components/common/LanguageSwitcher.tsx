'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';

const locales = [
  { code: 'en', label: '🇮🇳 English' },
  { code: 'hi', label: '🇮🇳 हिंदी' },
  { code: 'mr', label: '🇮🇳 मराठी' },
  { code: 'gu', label: '🇮🇳 ગુજરાતી' },
  { code: 'ta', label: '🇮🇳 தமிழ்' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    
    // Determine the current path without locale
    // We only remove the prefix if it's one of our locales
    const currentLocales = ['/hi', '/mr', '/gu', '/ta'];
    let pathWithoutLocale = pathname;
    for (const locale of currentLocales) {
      if (pathname === locale || pathname.startsWith(`${locale}/`)) {
        pathWithoutLocale = pathname.replace(locale, '') || '/';
        break;
      }
    }

    const nextPath = nextLocale === 'en' 
      ? pathWithoutLocale
      : `/${nextLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

    startTransition(() => {
      router.replace(nextPath);
    });
  };

  // Find active locale
  const activeLocale = locales.find(l => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`)?.code || 'en';

  return (
    <div className="relative inline-block text-left">
      <select 
        value={activeLocale} 
        onChange={handleLocaleChange}
        disabled={isPending}
        className="bg-white border text-gray-700 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {locales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.label}
          </option>
        ))}
      </select>
    </div>
  );
}
