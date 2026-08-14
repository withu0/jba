import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { counseling } from '@/routes';
import { index as lessons } from '@/routes/lessons';
import { index as manga } from '@/routes/manga';

const pillars = [
    {
        key: 'learn',
        href: lessons.url(),
        image: '/images/hero-1.jpg',
    },
    {
        key: 'know',
        href: manga.url(),
        image: '/images/concept-b.jpg',
    },
    {
        key: 'consult',
        href: counseling.url(),
        image: '/images/hero-3.jpg',
    },
] as const;

export function HomePillars() {
    const { t } = useTranslation();

    return (
        <section className="bg-background py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <SectionHeading
                    eyebrow={t('home.pillars.eyebrow')}
                    title={t('home.pillars.title')}
                    lead={t('home.pillars.lead')}
                    align="center"
                    className="mx-auto max-w-3xl"
                />

                <ul className="mt-16 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
                    {pillars.map((pillar, index) => (
                        <Reveal as="li" key={pillar.key} delay={index * 110}>
                            <Link
                                href={pillar.href}
                                className="group hover:shadow-lift flex h-full flex-col overflow-hidden rounded-md border border-border bg-background transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-blue/40"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                                    <img
                                        src={pillar.image}
                                        alt=""
                                        loading="lazy"
                                        className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                                    />
                                    <span className="text-tracking-label absolute top-4 left-4 rounded-sm bg-background/90 px-2.5 py-1 text-[0.625rem] text-brand-blue">
                                        {`0${index + 1}`}
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col px-6 py-7">
                                    <h3 className="font-serif text-xl font-bold text-ink transition-colors group-hover:text-brand-blue">
                                        {t(`home.pillars.${pillar.key}Title`)}
                                    </h3>
                                    <p className="mt-3.5 flex-1 text-sm leading-[1.9] text-muted-foreground">
                                        {t(`home.pillars.${pillar.key}Body`)}
                                    </p>
                                    <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-brand-blue">
                                        {t(`home.pillars.${pillar.key}Link`)}
                                        <ArrowRight
                                            aria-hidden
                                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}
