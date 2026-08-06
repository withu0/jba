import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';
import { WelcomeBook } from '@/components/welcome-book';

const WORD_EN = 'HARIDO';
const WORD_JA = '鍼道';

const englishTitleClass =
    "font-['Arial_Black','Helvetica_Neue','Arial',sans-serif] font-black tracking-tight";

export default function Welcome() {
    const { t, i18n } = useTranslation();
    const isJapanese = i18n.language.startsWith('ja');

    const primary = isJapanese ? WORD_JA : WORD_EN;
    const secondary = isJapanese ? WORD_EN : WORD_JA;
    const primaryIsEnglish = !isJapanese;

    return (
        <>
            <Head title={t('welcome.title')} />
            <div className="relative flex min-h-dvh flex-col items-center justify-center gap-10 bg-background px-4 pt-[max(4rem,calc(env(safe-area-inset-top)+2rem))] pb-[max(7rem,calc(env(safe-area-inset-bottom)+5rem))] text-foreground">
                <div className="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-10">
                    <LanguageSwitcher variant="button" />
                </div>
                <h1 className="flex flex-col items-center gap-1 text-center leading-none">
                    <span
                        className={
                            primaryIsEnglish
                                ? `text-5xl ${englishTitleClass}`
                                : 'text-5xl font-extrabold tracking-tight'
                        }
                    >
                        {primary}
                    </span>
                    <span
                        className={
                            primaryIsEnglish
                                ? 'text-xl font-bold tracking-tight'
                                : `text-xl ${englishTitleClass}`
                        }
                    >
                        {secondary}
                    </span>
                </h1>
                <WelcomeBook />
            </div>
        </>
    );
}
