import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ImageCollage } from '@/components/image-collage';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { SparkleDivider } from '@/components/sparkle-divider';
import { VerticalLabel } from '@/components/vertical-label';
import { about } from '@/routes';

export function HomeConcept() {
    const { t } = useTranslation();

    return (
        <section className="relative isolate overflow-hidden bg-background py-24 md:py-32">
            <span
                aria-hidden
                className="pointer-events-none absolute -top-10 right-[-4%] hidden font-serif text-[22rem] leading-none font-bold text-ink/[0.035] select-none lg:block"
            >
                鍼
            </span>

            <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 md:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-24">
                <Reveal>
                    <ImageCollage
                        primary="/images/concept-a.jpg"
                        secondary="/images/concept-b.jpg"
                        primaryAlt={t('home.concept.imageAlt')}
                        secondaryAlt={t('home.concept.detailAlt')}
                        className="mb-14 lg:mb-0"
                    />
                </Reveal>

                <Reveal delay={120}>
                    <SectionHeading
                        eyebrow={t('home.concept.eyebrow')}
                        title={t('home.concept.title')}
                    />
                    <SparkleDivider className="mt-9 max-w-24" />
                    <div className="mt-9 space-y-6 text-base leading-[2] text-muted-foreground">
                        <p>{t('home.concept.body1')}</p>
                        <p>{t('home.concept.body2')}</p>
                    </div>
                    <Link
                        href={about()}
                        className="group mt-10 inline-flex items-center gap-2.5 text-sm font-medium text-brand-blue"
                    >
                        {t('home.concept.link')}
                        <ArrowRight
                            aria-hidden
                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </Reveal>
            </div>

            <VerticalLabel className="absolute top-24 left-6">
                {t('home.concept.vertical')}
            </VerticalLabel>
        </section>
    );
}
