import { Link } from '@inertiajs/react';
import { ArrowRight, TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Sparkle } from '@/components/sparkle-divider';
import { beforeAfter, contraindications } from '@/routes';

export type Pair = {
    id: number;
    title: string;
    caption: string | null;
    before_image_url: string | null;
    after_image_url: string | null;
};

export function HomeBeforeAfter({ pairs }: { pairs: Pair[] }) {
    const { t } = useTranslation();

    if (pairs.length === 0) {
        return null;
    }

    return (
        <section className="bg-background py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <SectionHeading
                        eyebrow={t('home.beforeAfter.eyebrow')}
                        title={t('home.beforeAfter.title')}
                        lead={t('home.beforeAfter.lead')}
                        className="max-w-2xl"
                    />
                    <Link
                        href={beforeAfter()}
                        className="group inline-flex shrink-0 items-center gap-2.5 text-sm font-medium text-brand-blue"
                    >
                        {t('home.beforeAfter.cta')}
                        <ArrowRight
                            aria-hidden
                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                <ul className="mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
                    {pairs.map((pair, index) => (
                        <Reveal as="li" key={pair.id} delay={index * 110}>
                            <figure className="h-full overflow-hidden rounded-md border border-border bg-background">
                                <div className="relative grid grid-cols-2">
                                    {(
                                        [
                                            ['before', pair.before_image_url],
                                            ['after', pair.after_image_url],
                                        ] as const
                                    ).map(([side, url]) => (
                                        <div
                                            key={side}
                                            className="relative aspect-[3/4] bg-surface"
                                        >
                                            {url ? (
                                                <img
                                                    src={url}
                                                    alt={t(
                                                        side === 'before'
                                                            ? 'beforeAfter.beforeAlt'
                                                            : 'beforeAfter.afterAlt',
                                                        { title: pair.title },
                                                    )}
                                                    loading="lazy"
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <div className="size-full bg-surface" />
                                            )}
                                            <span className="text-tracking-label absolute bottom-3 left-3 rounded-sm bg-ink/70 px-2 py-0.5 text-[0.5625rem] text-white uppercase backdrop-blur-sm">
                                                {t(
                                                    side === 'before'
                                                        ? 'beforeAfter.beforeLabel'
                                                        : 'beforeAfter.afterLabel',
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                    <span
                                        aria-hidden
                                        className="absolute inset-y-0 left-1/2 flex w-px -translate-x-1/2 items-center justify-center bg-background/80"
                                    >
                                        <Sparkle className="size-3 rounded-full bg-background" />
                                    </span>
                                </div>
                                <figcaption className="px-5 py-5">
                                    <h3 className="font-serif text-base font-bold text-ink">
                                        {pair.title}
                                    </h3>
                                    {pair.caption && (
                                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                            {pair.caption}
                                        </p>
                                    )}
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </ul>

                <p className="mt-12 flex items-start gap-3 rounded-md border border-border bg-surface px-5 py-4 text-xs leading-relaxed text-muted-foreground">
                    <TriangleAlert
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-brand-gold"
                    />
                    <span>
                        {t('home.beforeAfter.note')}{' '}
                        <Link
                            href={contraindications()}
                            className="text-brand-blue underline underline-offset-4"
                        >
                            {t('nav.contraindications')}
                        </Link>
                    </span>
                </p>
            </div>
        </section>
    );
}
