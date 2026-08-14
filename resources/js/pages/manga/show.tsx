import { Link } from '@inertiajs/react';
import { ArrowLeft, ChevronRight, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/empty-state';
import { MangaBook } from '@/components/manga-book';
import { SparkleDivider } from '@/components/sparkle-divider';
import { index as mangaIndex } from '@/routes/manga';

type Props = {
    episode: {
        id: number;
        slug: string;
        title: string;
        description: string | null;
        category_name: string | null;
    };
    pages: string[];
    bookLocale: string;
    usedFallback: boolean;
};

export default function MangaShow({
    episode,
    pages,
    bookLocale,
    usedFallback,
}: Props) {
    const { t } = useTranslation();

    return (
        <div className="relative isolate min-h-svh overflow-hidden bg-ink">
            <div aria-hidden className="bg-noise absolute inset-0 opacity-45" />
            <span
                aria-hidden
                className="pointer-events-none absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-brand-blue/12 blur-[130px]"
            />

            <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-28 pb-20 md:px-6 md:pt-36">
                <nav
                    aria-label="Breadcrumb"
                    className="mb-10 flex w-full flex-wrap items-center gap-1.5 text-xs text-white/50"
                >
                    <Link
                        href="/"
                        className="transition-colors hover:text-white"
                    >
                        {t('nav.home')}
                    </Link>
                    <ChevronRight aria-hidden className="size-3 opacity-50" />
                    <Link
                        href={mangaIndex()}
                        className="transition-colors hover:text-white"
                    >
                        {t('nav.manga')}
                    </Link>
                </nav>

                <header className="text-center">
                    <p className="text-tracking-label text-xs text-brand-turquoise uppercase">
                        {episode.category_name ?? 'JBA'}
                    </p>
                    <h1 className="mt-5 font-serif text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
                        {episode.title}
                    </h1>
                    {episode.description && (
                        <p className="mx-auto mt-5 max-w-xl text-sm leading-[1.9] text-white/65">
                            {episode.description}
                        </p>
                    )}
                    <SparkleDivider tone="dark" className="mx-auto mt-8 w-40" />
                    {usedFallback && (
                        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/60">
                            <Languages aria-hidden className="size-3.5" />
                            {t('manga.fallbackNote', {
                                locale: bookLocale.toUpperCase(),
                            })}
                        </p>
                    )}
                </header>

                <div className="mt-14 w-full">
                    {pages.length > 0 ? (
                        <MangaBook pages={pages} />
                    ) : (
                        <div className="rounded-md bg-white/5 p-8">
                            <EmptyState
                                message={t('manga.empty')}
                                href={mangaIndex.url()}
                            />
                        </div>
                    )}
                </div>

                <Link
                    href={mangaIndex()}
                    className="group mt-16 inline-flex items-center gap-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                    <ArrowLeft
                        aria-hidden
                        className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
                    />
                    {t('manga.backToList')}
                </Link>
            </div>
        </div>
    );
}
