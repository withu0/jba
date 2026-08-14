import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Sparkle } from '@/components/sparkle-divider';

const pointKeys = [
    'home.signature.point1',
    'home.signature.point2',
    'home.signature.point3',
] as const;

export function HomeSignature() {
    const { t } = useTranslation();

    return (
        <section className="relative isolate overflow-hidden bg-ink py-24 text-white md:py-32">
            <img
                src="/images/concept-b.jpg"
                alt=""
                loading="lazy"
                className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-30 lg:block"
            />
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-ink via-ink/95 to-ink/55"
            />
            <div aria-hidden className="bg-noise absolute inset-0 opacity-50" />

            <div className="relative mx-auto max-w-7xl px-4 md:px-6">
                <div className="max-w-2xl">
                    <SectionHeading
                        eyebrow={t('home.signature.eyebrow')}
                        title={t('home.signature.title')}
                        lead={t('home.signature.lead')}
                        tone="dark"
                    />
                </div>

                <Reveal className="mt-14 flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
                    <figure className="relative shrink-0 rounded-md bg-gradient-to-br from-white/12 to-white/[0.03] p-8 backdrop-blur-sm sm:p-10">
                        <img
                            src="/images/tool-gold.png"
                            alt={t('home.signature.toolAlt')}
                            loading="lazy"
                            className="w-full max-w-sm drop-shadow-[0_10px_24px_rgba(201,161,90,0.35)]"
                        />
                    </figure>

                    <ul className="flex-1 divide-y divide-white/10">
                        {pointKeys.map((key, index) => (
                            <li
                                key={key}
                                className="flex items-start gap-5 py-6"
                            >
                                <span className="text-tracking-label mt-1 text-xs text-brand-gold">
                                    {`0${index + 1}`}
                                </span>
                                <span className="flex-1 font-serif text-lg leading-snug font-bold text-white sm:text-xl">
                                    {t(key)}
                                </span>
                                <Sparkle className="mt-2" />
                            </li>
                        ))}
                    </ul>
                </Reveal>
            </div>
        </section>
    );
}
