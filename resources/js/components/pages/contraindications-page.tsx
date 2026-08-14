import { Link } from '@inertiajs/react';
import { ArrowRight, Check, TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ArticleProse } from '@/components/article-prose';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { counseling } from '@/routes';

const items = [1, 2, 3, 4, 5, 6] as const;

export function ContraindicationsPage({
    title,
    body,
}: {
    title: string;
    body: string;
}) {
    const { t } = useTranslation();

    return (
        <>
            <PageHero
                title={title}
                lead={t('pages.contraindications.lead')}
                image="/images/concept-b.jpg"
                tone="caution"
                verticalLabel={t('pages.contraindications.vertical')}
                crumbs={[{ label: t('nav.contraindications') }]}
            />

            <section className="bg-background py-20 md:py-28">
                <div className="mx-auto max-w-4xl px-4 md:px-6">
                    <Reveal>
                        <div className="flex gap-5 rounded-md border-l-4 border-brand-gold bg-surface px-6 py-7 sm:px-8">
                            <TriangleAlert
                                aria-hidden
                                className="mt-0.5 size-6 shrink-0 text-brand-gold"
                            />
                            <div>
                                <h2 className="font-serif text-lg font-bold text-ink">
                                    {t('pages.contraindications.alertTitle')}
                                </h2>
                                <p className="mt-3 text-sm leading-[1.9] text-muted-foreground">
                                    {t('pages.contraindications.alertBody')}
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={100} className="mt-20">
                        <SectionHeading
                            eyebrow={t(
                                'pages.contraindications.checklistEyebrow',
                            )}
                            title={t('pages.contraindications.checklistTitle')}
                        />
                        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
                            {items.map((n, index) => (
                                <Reveal as="li" key={n} delay={index * 60}>
                                    <div className="flex h-full items-start gap-4 rounded-md border border-border bg-background px-5 py-5">
                                        <span
                                            aria-hidden
                                            className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/12"
                                        >
                                            <Check className="size-3.5 text-brand-gold" />
                                        </span>
                                        <span className="text-sm leading-[1.8] text-ink">
                                            {t(`pages.contraindications.i${n}`)}
                                        </span>
                                    </div>
                                </Reveal>
                            ))}
                        </ul>
                    </Reveal>

                    {body.trim() !== '' && (
                        <Reveal className="mt-20 border-t border-border pt-14">
                            <ArticleProse body={body} />
                        </Reveal>
                    )}

                    <Reveal className="mt-20">
                        <div className="bg-brand-gradient-soft flex flex-col gap-5 rounded-md px-7 py-8 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm leading-relaxed text-ink">
                                {t('pages.contraindications.contactNote')}
                            </p>
                            <Link
                                href={counseling()}
                                className="group inline-flex shrink-0 items-center gap-2.5 text-sm font-medium text-brand-blue"
                            >
                                {t('nav.counseling')}
                                <ArrowRight
                                    aria-hidden
                                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
