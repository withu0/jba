import { Link } from '@inertiajs/react';
import { Expand, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CompareSlider } from '@/components/compare-slider';
import { CtaBand } from '@/components/cta-band';
import { EmptyState } from '@/components/empty-state';
import { BeforeAfterLightbox } from '@/components/lightbox';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { contraindications } from '@/routes';

type Pair = {
    id: number;
    title: string;
    caption: string | null;
    before_image_url: string | null;
    after_image_url: string | null;
};

export default function BeforeAfterGallery({ pairs }: { pairs: Pair[] }) {
    const { t } = useTranslation();
    const [active, setActive] = useState<Pair | null>(null);

    return (
        <>
            <PageHero
                title={t('beforeAfter.title')}
                lead={t('beforeAfter.lead')}
                image="/images/hero-2.jpg"
                verticalLabel="変 化 を 見 る"
                crumbs={[{ label: t('nav.beforeAfter') }]}
            />

            <section className="bg-background py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <Reveal className="mb-14 flex items-start gap-3 rounded-md border-l-4 border-brand-gold bg-surface px-6 py-5">
                        <TriangleAlert
                            aria-hidden
                            className="mt-0.5 size-5 shrink-0 text-brand-gold"
                        />
                        <p className="text-sm leading-[1.9] text-muted-foreground">
                            {t('beforeAfter.disclaimer')}{' '}
                            <Link
                                href={contraindications()}
                                className="text-brand-blue underline underline-offset-4"
                            >
                                {t('nav.contraindications')}
                            </Link>
                        </p>
                    </Reveal>

                    {pairs.length === 0 ? (
                        <EmptyState message={t('beforeAfter.empty')} href="/" />
                    ) : (
                        <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
                            {pairs.map((pair, index) => (
                                <Reveal
                                    as="li"
                                    key={pair.id}
                                    delay={(index % 2) * 100}
                                >
                                    <article className="flex h-full flex-col">
                                        <div className="relative">
                                            <CompareSlider
                                                beforeUrl={
                                                    pair.before_image_url
                                                }
                                                afterUrl={pair.after_image_url}
                                                title={pair.title}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setActive(pair)}
                                                aria-label={t(
                                                    'beforeAfter.expand',
                                                )}
                                                className="shadow-soft absolute right-3 bottom-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-background/90 text-ink backdrop-blur-sm transition-colors hover:text-brand-blue"
                                            >
                                                <Expand className="size-4" />
                                            </button>
                                        </div>

                                        <h2 className="mt-6 font-serif text-lg font-bold text-ink sm:text-xl">
                                            {pair.title}
                                        </h2>
                                        {pair.caption && (
                                            <p className="mt-3 text-sm leading-[1.9] text-muted-foreground">
                                                {pair.caption}
                                            </p>
                                        )}
                                    </article>
                                </Reveal>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            <BeforeAfterLightbox
                pair={
                    active
                        ? {
                              title: active.title,
                              caption: active.caption,
                              beforeUrl: active.before_image_url,
                              afterUrl: active.after_image_url,
                          }
                        : null
                }
                onClose={() => setActive(null)}
            />

            <CtaBand />
        </>
    );
}
