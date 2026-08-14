import { Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { index as manga, show as mangaShow } from '@/routes/manga';

export type FeaturedEpisode = {
    slug: string;
    title: string;
    description: string | null;
    cover_url: string | null;
};

export function HomeManga({ episode }: { episode: FeaturedEpisode | null }) {
    const { t } = useTranslation();
    const href = episode ? mangaShow.url(episode.slug) : manga.url();

    return (
        <section className="bg-brand-gradient-dark relative isolate overflow-hidden py-24 text-white md:py-32">
            <div aria-hidden className="bg-noise absolute inset-0 opacity-60" />
            <span
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -left-16 size-96 rounded-full bg-brand-turquoise/20 blur-[100px]"
            />

            <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-24">
                <div>
                    <SectionHeading
                        eyebrow={t('home.manga.eyebrow')}
                        title={t('home.manga.title')}
                        lead={t('home.manga.lead')}
                        tone="dark"
                    />
                    {episode && (
                        <p className="mt-8 border-l-2 border-brand-gold pl-5 font-serif text-lg font-bold text-white/90">
                            {episode.title}
                        </p>
                    )}
                    <Button
                        asChild
                        size="lg"
                        className="mt-10 rounded-md bg-white px-8 text-brand-blue hover:bg-white/90"
                    >
                        <Link href={href}>
                            <BookOpen aria-hidden className="size-4" />
                            {t('home.manga.cta')}
                        </Link>
                    </Button>
                </div>

                <Reveal delay={120} className="flex justify-center">
                    <Link
                        href={href}
                        aria-label={t('home.manga.cta')}
                        className="group relative block w-full max-w-xs [perspective:1400px]"
                    >
                        <div className="relative [transform:rotateY(-16deg)_rotateX(4deg)] transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-6deg)_rotateX(2deg)]">
                            {/* Stacked page edges give the cover a physical spine */}
                            <span
                                aria-hidden
                                className="absolute inset-y-2 -right-1.5 w-3 rounded-r-sm bg-gradient-to-r from-white/70 to-white/25"
                            />
                            <span
                                aria-hidden
                                className="absolute inset-y-1 -right-0.5 w-2 rounded-r-sm bg-white/85"
                            />
                            {episode?.cover_url ? (
                                <img
                                    src={episode.cover_url}
                                    alt={t('home.manga.coverAlt')}
                                    loading="lazy"
                                    className="relative aspect-[3/4] w-full rounded-sm object-cover shadow-[0_34px_60px_-24px_rgba(0,0,0,0.7)]"
                                />
                            ) : (
                                <div className="relative flex aspect-[3/4] w-full items-center justify-center rounded-sm bg-white/10 shadow-[0_34px_60px_-24px_rgba(0,0,0,0.7)]">
                                    <BookOpen
                                        aria-hidden
                                        className="size-10 text-white/40"
                                    />
                                </div>
                            )}
                            <span
                                aria-hidden
                                className="absolute inset-y-0 left-0 w-6 rounded-l-sm bg-gradient-to-r from-black/35 to-transparent"
                            />
                        </div>
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
