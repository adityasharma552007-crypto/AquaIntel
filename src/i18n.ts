import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'hi', 'mr', 'gu', 'ta'];

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  const validLocale = locales.includes(locale as any) ? locale : 'en';
  console.log("I18N VALID LOCALE:", validLocale);
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});
