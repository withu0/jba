import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';
import { WelcomeBook } from '@/components/welcome-book';

export default function Welcome() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('welcome.title')} />
            <div className="relative flex min-h-dvh flex-col items-center justify-center gap-10 bg-background px-4 pt-[max(4rem,calc(env(safe-area-inset-top)+2rem))] pb-[max(7rem,calc(env(safe-area-inset-bottom)+5rem))] text-foreground">
                <div className="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-10">
                    <LanguageSwitcher variant="button" />
                </div>
                <h1 className="text-4xl font-medium tracking-tight">
                    {t('welcome.word')}
                </h1>
                <WelcomeBook />
            </div>
        </>
    );
}
