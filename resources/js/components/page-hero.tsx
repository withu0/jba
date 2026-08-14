import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VerticalLabel } from '@/components/vertical-label';
import { cn } from '@/lib/utils';

type Crumb = {
    label: string;
    href?: string;
};

type Props = {
    title: string;
    eyebrow?: string;
    lead?: string;
    image?: string;
    /** `caution` swaps the brand gradient for a warmer, more serious scrim. */
    tone?: 'brand' | 'caution';
    verticalLabel?: string;
    crumbs?: Crumb[];
    children?: React.ReactNode;
};

export function PageHero({
    title,
    eyebrow = 'Japanese Beauty ✦ Acupuncture',
    lead,
    image = '/images/hero-3.jpg',
    tone = 'brand',
    verticalLabel,
    crumbs = [],
    children,
}: Props) {
    const { t } = useTranslation();

    return (
        <section className="relative isolate overflow-hidden bg-ink">
            <img
                src={image}
                alt=""
                className="absolute inset-0 size-full object-cover object-center opacity-70"
                fetchPriority="high"
            />
            <div
                aria-hidden
                className={cn(
                    'absolute inset-0',
                    tone === 'brand'
                        ? 'bg-gradient-to-br from-[#0f2d3a]/92 via-[#1a6f96]/72 to-[#349cca]/45'
                        : 'bg-gradient-to-br from-[#241d12]/92 via-[#4a3a1f]/72 to-[#c9a15a]/35',
                )}
            />
            <div aria-hidden className="bg-noise absolute inset-0 opacity-60" />

            <div className="relative mx-auto flex max-w-7xl flex-col px-4 pt-32 pb-20 md:px-6 md:pt-40 md:pb-28">
                {crumbs.length > 0 && (
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-white/60"
                    >
                        <Link
                            href="/"
                            className="transition-colors hover:text-white"
                        >
                            {t('nav.home')}
                        </Link>
                        {crumbs.map((crumb) => (
                            <span
                                key={crumb.label}
                                className="flex items-center gap-1.5"
                            >
                                <ChevronRight
                                    className="size-3 opacity-50"
                                    aria-hidden
                                />
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="transition-colors hover:text-white"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-white/85">
                                        {crumb.label}
                                    </span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}

                <p className="text-tracking-label text-xs text-white/80 uppercase sm:text-sm">
                    {eyebrow}
                </p>
                <span
                    aria-hidden
                    className="bg-brand-gradient mt-5 h-0.5 w-14 rounded-full"
                />
                <h1 className="mt-6 max-w-4xl font-serif text-3xl leading-[1.25] font-bold tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
                    {title}
                </h1>
                {lead && (
                    <p className="mt-6 max-w-2xl text-base leading-[1.9] text-white/80">
                        {lead}
                    </p>
                )}
                {children}
            </div>

            {verticalLabel && (
                <VerticalLabel
                    tone="dark"
                    className="absolute top-1/2 right-6 -translate-y-1/2"
                >
                    {verticalLabel}
                </VerticalLabel>
            )}
        </section>
    );
}
