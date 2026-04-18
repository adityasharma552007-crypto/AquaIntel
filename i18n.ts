import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'hi', 'mr', 'gu', 'ta'];

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as string)) notFound();
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
