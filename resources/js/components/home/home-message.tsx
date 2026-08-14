import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/reveal';
import { Sparkle } from '@/components/sparkle-divider';

const credentialKeys = [
    'home.message.credential1',
    'home.message.credential2',
    'home.message.credential3',
] as const;

export function HomeMessage() {
    const { t } = useTranslation();

    return (
        <section className="relative isolate overflow-hidden bg-surface py-24 md:py-32">
            <div
                aria-hidden
                className="bg-brand-gradient-soft absolute inset-x-0 top-0 h-64"
            />

            <div className="relative mx-auto grid max-w-7xl gap-16 px-4 md:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
                <Reveal>
                    <figure className="relative">
                        <span
                            aria-hidden
                            className="bg-brand-gradient absolute -top-5 -left-5 size-28 rounded-full opacity-25 blur-2xl"
                        />
                        {/* Placeholder framing: replace with the official portrait of 光本 朱見 when supplied. */}
                        <img
                            src="/AkemiMitsumoto.webp"
                            alt={t('home.message.portraitAlt')}
                            loading="lazy"
                            className="shadow-lift relative aspect-[4/5] w-full rounded-md object-cover"
                        />
                        <figcaption className="relative mt-7 border-l-2 border-brand-gold pl-5">
                            <p className="font-serif text-xl font-bold text-ink">
                                {t('home.message.name')}
                            </p>
                            <p className="text-tracking-label mt-1.5 text-[0.6875rem] text-muted-foreground uppercase">
                                {t('home.message.nameLatin')}
                            </p>
                            <p className="mt-2.5 text-sm text-muted-foreground">
                                {t('home.message.role')}
                            </p>
                        </figcaption>
                    </figure>
                </Reveal>

                <Reveal delay={120} className="lg:pt-8">
                    <p className="text-tracking-label text-xs text-brand-blue uppercase sm:text-sm">
                        {t('home.message.eyebrow')}
                    </p>
                    <h2 className="mt-6 font-serif text-3xl leading-[1.35] font-bold text-balance text-ink sm:text-4xl">
                        {t('home.message.title')}
                    </h2>

                    <blockquote className="relative mt-10 pl-12">
                        <span
                            aria-hidden
                            className="absolute -top-2 left-0 font-serif text-7xl leading-none text-brand-turquoise/45 select-none"
                        >
                            “
                        </span>
                        <p className="font-serif text-lg leading-[1.8] font-bold text-ink sm:text-xl">
                            {t('home.message.quote')}
                        </p>
                    </blockquote>

                    <div className="mt-9 space-y-6 text-base leading-[2] text-muted-foreground">
                        <p>{t('home.message.body1')}</p>
                        <p>{t('home.message.body2')}</p>
                    </div>

                    <ul className="mt-11 space-y-4 border-t border-border pt-9">
                        {credentialKeys.map((key) => (
                            <li key={key} className="flex gap-3.5">
                                <Sparkle className="mt-1.5" />
                                <span className="text-sm leading-relaxed text-ink">
                                    {t(key)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Reveal>
            </div>
        </section>
    );
}
