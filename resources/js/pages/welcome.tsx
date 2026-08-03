import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function Welcome() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('welcome.title')} />
            <div className="relative flex min-h-screen items-center justify-center bg-background text-foreground">
                <div className="absolute top-4 right-4">
                    <LanguageSwitcher variant="button" />
                </div>
                <h1 className="text-4xl font-medium tracking-tight">
                    {t('welcome.word')}
                </h1>
            </div>
        </>
    );
}
