import { useTranslation } from 'react-i18next';
import { FaqAccordion } from '@/components/faq-accordion';
import type { FaqItem } from '@/components/faq-accordion';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';

const questions = [1, 2, 3, 4, 5, 6] as const;

export function HomeFaq() {
    const { t } = useTranslation();

    const items: FaqItem[] = questions.map((n) => ({
        question: t(`home.faq.q${n}`),
        answer: t(`home.faq.a${n}`),
    }));

    return (
        <section className="bg-background py-24 md:py-32">
            <div className="mx-auto max-w-3xl px-4 md:px-6">
                <SectionHeading
                    eyebrow={t('home.faq.eyebrow')}
                    title={t('home.faq.title')}
                    lead={t('home.faq.lead')}
                    align="center"
                />
                <Reveal className="mt-14">
                    <FaqAccordion items={items} />
                </Reveal>
            </div>
        </section>
    );
}
