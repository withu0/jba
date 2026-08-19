import { Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CtaBand } from '@/components/cta-band';
import { EmptyState } from '@/components/empty-state';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { SparkleDivider } from '@/components/sparkle-divider';
import { show as mangaShow } from '@/routes/manga';

type EpisodeSummary = {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    cover_url: string | null;
};

type Category = {
    id: number;
    slug: string;
    name: string;
    episodes: EpisodeSummary[];
};

export default function MangaIndex({ categories }: { categories: Category[] }) {
    const { t } = useTranslation();

    return (
        <>
            <PageHero
                title={t('manga.title')}
                lead={t('manga.lead')}
                image="/images/hero-2.jpg"
                verticalLabel="読 む"
                crumbs={[{ label: t('nav.manga') }]}
            >
                <p className="mt-5 text-base font-bold text-white [text-shadow:0_0_12px_rgba(255,255,255,0.85),0_0_28px_rgba(255,255,255,0.45)]">
                    {t('manga.nextIssue')}
                </p>
            </PageHero>

            <section className="relative isolate overflow-hidden bg-ink py-20 md:py-28">
                <div
                    aria-hidden
                    className="bg-noise absolute inset-0 opacity-50"
                />
                <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/4 -left-24 size-96 rounded-full bg-brand-blue/15 blur-[110px]"
                />

                <div className="relative mx-auto max-w-7xl px-4 md:px-6">
                    {categories.length === 0 ? (
                        <div className="rounded-md bg-white/5 p-8">
                            <EmptyState message={t('manga.empty')} href="/" />
                        </div>
                    ) : (
                        <div className="space-y-20">
                            {categories.map((category) => (
                                <section key={category.id}>
                                    <div className="flex items-center gap-6">
                                        <h2 className="font-serif text-xl font-bold text-white md:text-2xl">
                                            {category.name}
                                        </h2>
                                        <SparkleDivider
                                            tone="dark"
                                            className="flex-1"
                                        />
                                    </div>

                                    <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
                                        {category.episodes.map(
                                            (episode, index) => (
                                                <Reveal
                                                    as="li"
                                                    key={episode.id}
                                                    delay={(index % 4) * 80}
                                                >
                                                    <Link
                                                        href={mangaShow(
                                                            episode.slug,
                                                        )}
                                                        className="group block [perspective:1200px]"
                                                    >
                                                        <div className="relative transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-10deg)]">
                                                            <span
                                                                aria-hidden
                                                                className="absolute inset-y-1.5 -right-1 w-2 rounded-r-sm bg-gradient-to-r from-white/60 to-white/20"
                                                            />
                                                            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-white/8 shadow-[0_24px_46px_-20px_rgba(0,0,0,0.75)]">
                                                                {episode.cover_url ? (
                                                                    <img
                                                                        src={
                                                                            episode.cover_url
                                                                        }
                                                                        alt=""
                                                                        loading="lazy"
                                                                        className="size-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex size-full flex-col items-center justify-center gap-3 text-white/40">
                                                                        <BookOpen
                                                                            aria-hidden
                                                                            className="size-8"
                                                                        />
                                                                        <span className="text-xs">
                                                                            {t(
                                                                                'manga.noCover',
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <span
                                                                    aria-hidden
                                                                    className="absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black/40 to-transparent"
                                                                />
                                                            </div>
                                                        </div>

                                                        <h3 className="mt-6 font-serif text-base font-bold text-white transition-colors group-hover:text-brand-turquoise">
                                                            {episode.title}
                                                        </h3>
                                                        {episode.description && (
                                                            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-white/55">
                                                                {
                                                                    episode.description
                                                                }
                                                            </p>
                                                        )}
                                                    </Link>
                                                </Reveal>
                                            ),
                                        )}
                                    </ul>
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <CtaBand />
        </>
    );
}
