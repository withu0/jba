import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '@/components/brand-mark';
import { LanguageSwitcher } from '@/components/language-switcher';
import { SparkleDivider } from '@/components/sparkle-divider';
import {
    about,
    beforeAfter,
    contact,
    contraindications,
    counseling,
    dashboard,
    home,
    login,
} from '@/routes';
import { index as interviews } from '@/routes/interviews';
import { index as lessons } from '@/routes/lessons';
import { index as manga } from '@/routes/manga';
import { index as news } from '@/routes/news';

const columns = [
    {
        heading: 'footer.explore',
        links: [
            { key: 'home', href: home.url() },
            { key: 'about', href: about.url() },
            { key: 'manga', href: manga.url() },
            { key: 'beforeAfter', href: beforeAfter.url() },
        ],
    },
    {
        heading: 'footer.read',
        links: [
            { key: 'news', href: news.url() },
            { key: 'interviews', href: interviews.url() },
            { key: 'contraindications', href: contraindications.url() },
        ],
    },
    {
        heading: 'footer.connect',
        links: [
            { key: 'counseling', href: counseling.url() },
            { key: 'contact', href: contact.url() },
        ],
    },
    {
        heading: 'footer.members',
        links: [
            { key: 'dashboard', href: dashboard.url() },
            { key: 'lessons', href: lessons.url() },
            { key: 'logIn', href: login.url() },
        ],
    },
] as const;

export function PublicFooter() {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <footer className="relative isolate overflow-hidden bg-ink text-white">
            <div aria-hidden className="bg-noise absolute inset-0 opacity-50" />
            <span
                aria-hidden
                className="pointer-events-none absolute -top-32 -right-16 size-80 rounded-full bg-brand-blue/20 blur-[110px]"
            />

            <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-10 md:px-6">
                <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
                    <div>
                        <BrandMark size="md" variant="white" />
                        <p className="mt-7 max-w-xs text-sm leading-[1.9] text-white/60">
                            {t('footer.tagline')}
                        </p>
                        <SparkleDivider tone="dark" className="mt-8 max-w-40" />
                        <LanguageSwitcher
                            variant="button"
                            className="mt-6 -ml-2 text-white/70 hover:bg-white/10 hover:text-white"
                        />
                    </div>

                    <nav className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
                        {columns.map((column) => (
                            <div key={column.heading}>
                                <h2 className="text-tracking-label text-[0.625rem] text-white/45 uppercase">
                                    {t(column.heading)}
                                </h2>
                                <ul className="mt-5 space-y-3">
                                    {column.links.map((link) => (
                                        <li key={link.key}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-white/75 transition-colors hover:text-brand-turquoise"
                                            >
                                                {t(`nav.${link.key}`)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/45">
                        {t('footer.copyright', { year })}
                    </p>
                    <p className="text-tracking-label text-[0.625rem] text-white/35 uppercase">
                        {t('home.hero.eyebrow')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
