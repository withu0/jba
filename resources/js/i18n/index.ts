import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/i18n/locales/en';
import ja from '@/i18n/locales/ja';
import zh from '@/i18n/locales/zh';

export const supportedLocales = ['ja', 'en', 'zh'] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = 'ja';

export const localeLabels: Record<Locale, string> = {
    ja: '日本語',
    en: 'English',
    zh: '中文',
};

void i18n.use(initReactI18next).init({
    resources: {
        ja: { translation: ja },
        en: { translation: en },
        zh: { translation: zh },
    },
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    supportedLngs: [...supportedLocales],
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
