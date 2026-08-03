import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import type { Locale } from '@/i18n';
import i18n, { supportedLocales } from '@/i18n';

function applyLocale(locale: unknown) {
    if (
        typeof locale === 'string' &&
        supportedLocales.includes(locale as Locale)
    ) {
        if (i18n.language !== locale) {
            void i18n.changeLanguage(locale);
        }

        document.documentElement.lang = locale;
    }
}

type Props = {
    initialLocale?: string;
};

/**
 * Keeps i18next and the HTML lang attribute in sync with the shared Inertia locale.
 * Uses router events so it can live outside the Inertia page context (e.g. withApp).
 */
export function LocaleSync({ initialLocale }: Props) {
    useEffect(() => {
        applyLocale(initialLocale);

        const removeNavigate = router.on('navigate', (event) => {
            applyLocale(event.detail.page.props.locale);
        });

        const removeSuccess = router.on('success', (event) => {
            applyLocale(event.detail.page.props.locale);
        });

        return () => {
            removeNavigate();
            removeSuccess();
        };
    }, [initialLocale]);

    return null;
}
