import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Sparkle } from '@/components/sparkle-divider';

const promises = [1, 2, 3, 4, 5] as const;

export function HomePromises() {
    const { t } = useTranslation();

    return (
        <section className="bg-surface py-24 md:py-32">
            <div className="mx-auto grid max-w-7xl gap-14 px-4 md:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
                <SectionHeading
                    eyebrow={t('home.promises.eyebrow')}
                    title={t('home.promises.title')}
                    lead={t('home.promises.lead')}
                    className="lg:sticky lg:top-28 lg:self-start"
                />

                <ul className="divide-y divide-border border-t border-border">
                    {promises.map((n, index) => (
                        <Reveal as="li" key={n} delay={index * 80}>
                            <div className="flex gap-6 py-7 sm:gap-8">
                                <span className="font-serif text-3xl leading-none font-bold text-brand-turquoise sm:text-4xl">
                                    {`0${n}`}
                                </span>
                                <div className="flex-1">
                                    <h3 className="flex items-center gap-2.5 font-serif text-lg font-bold text-ink">
                                        <Sparkle className="size-2.5" />
                                        {t(`home.promises.p${n}Title`)}
                                    </h3>
                                    <p className="mt-2.5 text-sm leading-[1.9] text-muted-foreground">
                                        {t(`home.promises.p${n}Body`)}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}
