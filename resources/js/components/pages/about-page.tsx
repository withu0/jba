import { useTranslation } from 'react-i18next';
import { ArticleProse } from '@/components/article-prose';
import { CtaBand } from '@/components/cta-band';
import { EmptyState } from '@/components/empty-state';
import { ImageCollage } from '@/components/image-collage';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { SparkleDivider } from '@/components/sparkle-divider';

const milestones = [1, 2, 3, 4] as const;

export function AboutPage({ title, body }: { title: string; body: string }) {
    const { t } = useTranslation();

    return (
        <>
            <PageHero
                title={title}
                lead={t('pages.about.lead')}
                image="/images/hero-3.jpg"
                verticalLabel={t('pages.about.vertical')}
                crumbs={[{ label: t('nav.about') }]}
            />

            <section className="bg-background py-24 md:py-32">
                <div className="mx-auto grid max-w-7xl items-start gap-16 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:gap-24">
                    <Reveal>
                        <p className="text-tracking-label text-xs text-brand-blue uppercase sm:text-sm">
                            {t('pages.about.storyEyebrow')}
                        </p>
                        <SparkleDivider className="mt-6 max-w-24" />
                        {body.trim() === '' ? (
                            <div className="mt-10">
                                <EmptyState
                                    message={t('placeholder.comingSoon')}
                                    href="/"
                                />
                            </div>
                        ) : (
                            <ArticleProse
                                body={body}
                                dropCap
                                className="mt-10"
                            />
                        )}
                    </Reveal>

                    <Reveal delay={120} className="lg:sticky lg:top-28">
                        <ImageCollage
                            primary="/images/concept-a.jpg"
                            secondary="/images/concept-b.jpg"
                            overlap="bottom-left"
                        />
                    </Reveal>
                </div>
            </section>

            <section className="bg-surface py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <SectionHeading
                        eyebrow={t('pages.about.timelineEyebrow')}
                        title={t('pages.about.timelineTitle')}
                        align="center"
                    />

                    <ol className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                        {milestones.map((n, index) => (
                            <Reveal as="li" key={n} delay={index * 100}>
                                <div className="flex h-full flex-col border-t-2 border-brand-turquoise/50 bg-background px-6 py-7">
                                    <span className="font-serif text-3xl leading-none font-bold text-brand-blue">
                                        {t(`pages.about.m${n}Year`)}
                                    </span>
                                    <h3 className="mt-5 font-serif text-base font-bold text-ink">
                                        {t(`pages.about.m${n}Title`)}
                                    </h3>
                                    <p className="mt-3 flex-1 text-sm leading-[1.9] text-muted-foreground">
                                        {t(`pages.about.m${n}Body`)}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </ol>
                </div>
            </section>

            <CtaBand />
        </>
    );
}
