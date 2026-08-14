import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VerticalLabel } from '@/components/vertical-label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { register } from '@/routes';
import { index as manga } from '@/routes/manga';

const SLIDE_MS = 6500;

const slides = [
    { src: '/images/hero-1.jpg', altKey: 'home.hero.slide1Alt' },
    { src: '/hero.webp', altKey: 'home.hero.slide2Alt' },
    { src: '/images/hero-3.jpg', altKey: 'home.hero.slide3Alt' },
] as const;

export function HomeHero() {
    const { t } = useTranslation();
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const timer = window.setInterval(
            () => setActive((current) => (current + 1) % slides.length),
            SLIDE_MS,
        );

        return () => window.clearInterval(timer);
    }, []);

    return (
        <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
            {slides.map((slide, index) => (
                <img
                    key={slide.src}
                    src={slide.src}
                    alt={index === 0 ? t(slide.altKey) : ''}
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className={cn(
                        'absolute inset-0 size-full object-cover object-[center_28%] transition-opacity duration-[2000ms] ease-in-out',
                        index === active
                            ? 'animate-ken-burns opacity-100'
                            : 'opacity-0',
                    )}
                />
            ))}

            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-[#08202b]/88 via-[#0f4a63]/62 to-[#349cca]/28"
            />
            <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#08202b]/85 to-transparent"
            />
            <div aria-hidden className="bg-noise absolute inset-0 opacity-50" />

            <div className="relative mx-auto w-full max-w-7xl px-4 pt-36 pb-28 md:px-6 md:pt-44 md:pb-36">
                <p className="text-tracking-label animate-fade-up text-xs text-white/85 uppercase sm:text-sm">
                    {t('home.hero.eyebrow')}
                </p>
                <h1
                    className="mt-7 max-w-4xl animate-fade-up font-serif text-[2.5rem] leading-[1.18] font-bold tracking-tight text-balance text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]"
                    style={{ animationDelay: '120ms' }}
                >
                    {t('home.hero.headline')}
                </h1>
                <p
                    className="mt-8 max-w-xl animate-fade-up text-base leading-[1.95] text-white/85 sm:text-lg"
                    style={{ animationDelay: '240ms' }}
                >
                    {t('home.hero.lead')}
                </p>
                <div
                    className="mt-11 flex animate-fade-up flex-wrap gap-3"
                    style={{ animationDelay: '360ms' }}
                >
                    <Button
                        asChild
                        size="lg"
                        className="shadow-lift rounded-md bg-white px-8 text-brand-blue hover:bg-white/90"
                    >
                        <Link href={register()}>
                            {t('home.hero.ctaPrimary')}
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="rounded-md border-white/50 bg-white/5 px-8 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
                    >
                        <Link href={manga()}>
                            {t('home.hero.ctaSecondary')}
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-7xl items-center gap-3 px-4 pb-10 md:px-6">
                <span className="text-tracking-label text-[0.625rem] text-white/60 uppercase">
                    {t('home.hero.scroll')}
                </span>
                <span
                    aria-hidden
                    className="h-10 w-px animate-scroll-hint bg-gradient-to-b from-white/60 to-transparent"
                />
                <div className="ml-auto flex gap-2" aria-hidden>
                    {slides.map((slide, index) => (
                        <span
                            key={slide.src}
                            className={cn(
                                'h-px w-8 transition-colors duration-500',
                                index === active ? 'bg-white' : 'bg-white/30',
                            )}
                        />
                    ))}
                </div>
            </div>

            <VerticalLabel
                tone="dark"
                className="absolute top-1/2 right-7 -translate-y-1/2"
            >
                {t('home.hero.vertical')}
            </VerticalLabel>
        </section>
    );
}
