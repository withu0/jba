import { useTranslation } from 'react-i18next';
import { ArticleProse } from '@/components/article-prose';
import { ContactForm } from '@/components/contact-form';
import { FaqAccordion } from '@/components/faq-accordion';
import type { FaqItem } from '@/components/faq-accordion';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';

const steps = [1, 2, 3] as const;
const questions = [1, 3, 6] as const;

export function CounselingPage({
    title,
    body,
}: {
    title: string;
    body: string;
}) {
    const { t } = useTranslation();

    const faqItems: FaqItem[] = questions.map((n) => ({
        question: t(`home.faq.q${n}`),
        answer: t(`home.faq.a${n}`),
    }));

    return (
        <>
            <PageHero
                title={title}
                lead={t('pages.counseling.lead')}
                image="/images/hero-1.jpg"
                verticalLabel={t('pages.counseling.vertical')}
                crumbs={[{ label: t('nav.counseling') }]}
            />

            <section className="bg-background py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <SectionHeading
                        eyebrow={t('pages.counseling.flowEyebrow')}
                        title={t('pages.counseling.flowTitle')}
                        align="center"
                        className="mx-auto max-w-2xl"
                    />

                    <ol className="mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
                        {steps.map((n, index) => (
                            <Reveal as="li" key={n} delay={index * 110}>
                                <div className="relative flex h-full flex-col rounded-md border border-border bg-surface px-7 py-8">
                                    <span className="font-serif text-4xl leading-none font-bold text-brand-turquoise">
                                        {`0${n}`}
                                    </span>
                                    <h3 className="mt-6 font-serif text-lg font-bold text-ink">
                                        {t(`pages.counseling.step${n}Title`)}
                                    </h3>
                                    <p className="mt-3 flex-1 text-sm leading-[1.9] text-muted-foreground">
                                        {t(`pages.counseling.step${n}Body`)}
                                    </p>
                                    {index < steps.length - 1 && (
                                        <span
                                            aria-hidden
                                            className="absolute top-1/2 -right-3 hidden h-px w-6 bg-border md:block"
                                        />
                                    )}
                                </div>
                            </Reveal>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="bg-surface py-24 md:py-32">
                <div className="mx-auto grid max-w-7xl items-start gap-14 px-4 md:px-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-20">
                    <Reveal className="lg:sticky lg:top-28">
                        <ArticleProse body={body} />
                        <div className="mt-12">
                            <SectionHeading
                                eyebrow={t('home.faq.eyebrow')}
                                title={t('home.faq.title')}
                                as="h2"
                            />
                            <div className="mt-8">
                                <FaqAccordion items={faqItems} />
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={120}>
                        <ContactForm />
                    </Reveal>
                </div>
            </section>
        </>
    );
}
