import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { SparkleDivider } from '@/components/sparkle-divider';
import { Button } from '@/components/ui/button';
import { contraindications, counseling, register } from '@/routes';

export function CtaBand() {
    const { t } = useTranslation();

    return (
        <section className="bg-brand-gradient-dark relative isolate overflow-hidden">
            <img
                src="/images/hero-1.jpg"
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover opacity-20"
            />
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-[#0f2d3a]/90 via-[#1a6f96]/80 to-[#349cca]/60"
            />
            <div aria-hidden className="bg-noise absolute inset-0 opacity-70" />

            <div className="relative mx-auto max-w-3xl px-4 py-20 text-center md:px-6 md:py-28">
                <p className="text-tracking-label text-xs text-white/75 uppercase sm:text-sm">
                    {t('cta.eyebrow')}
                </p>
                <h2 className="mt-6 font-serif text-3xl leading-[1.35] font-bold text-balance text-white sm:text-4xl">
                    {t('cta.title')}
                </h2>
                <SparkleDivider tone="dark" className="mx-auto mt-8 max-w-xs" />
                <p className="mt-8 text-base leading-[1.9] text-white/80">
                    {t('cta.lead')}
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-3">
                    <Button
                        asChild
                        size="lg"
                        className="rounded-md bg-white px-8 text-brand-blue hover:bg-white/90"
                    >
                        <Link href={counseling()}>{t('cta.primary')}</Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="rounded-md border-white/60 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
                    >
                        <Link href={register()}>{t('cta.secondary')}</Link>
                    </Button>
                </div>
                <p className="mt-8 text-xs text-white/60">
                    <Link
                        href={contraindications()}
                        className="underline underline-offset-4 transition-colors hover:text-white"
                    >
                        {t('cta.note')}
                    </Link>
                </p>
            </div>
        </section>
    );
}
