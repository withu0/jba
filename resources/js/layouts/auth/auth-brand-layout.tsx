import { useTranslation } from 'react-i18next';
import { BrandMark } from '@/components/brand-mark';
import { Sparkle, SparkleDivider } from '@/components/sparkle-divider';
import { VerticalLabel } from '@/components/vertical-label';
import type { AuthLayoutProps } from '@/types';

const benefitKeys = ['auth.benefit1', 'auth.benefit2', 'auth.benefit3'];

export default function AuthBrandLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { t } = useTranslation();

    return (
        <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="flex flex-col justify-center bg-background px-6 py-16 sm:px-10 md:px-14 lg:px-16">
                <div className="mx-auto w-full max-w-md">
                    <BrandMark compact />

                    <h1 className="mt-12 font-serif text-2xl leading-snug font-bold text-balance text-ink sm:text-3xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-4 text-sm leading-[1.9] text-muted-foreground">
                            {description}
                        </p>
                    )}
                    <SparkleDivider className="mt-8 max-w-24" />

                    <div className="mt-10">{children}</div>
                </div>
            </div>

            <aside className="relative isolate hidden overflow-hidden bg-ink lg:block">
                <img
                    src="/images/hero-2.jpg"
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-65"
                />
                <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-[#08202b]/90 via-[#0f4a63]/70 to-[#349cca]/35"
                />
                <div
                    aria-hidden
                    className="bg-noise absolute inset-0 opacity-55"
                />

                <div className="relative flex h-full flex-col justify-end p-14 xl:p-20">
                    <p className="text-tracking-label text-xs text-white/70 uppercase">
                        {t('home.hero.eyebrow')}
                    </p>

                    <blockquote className="mt-8 max-w-md">
                        <p className="font-serif text-2xl leading-[1.6] font-bold text-balance text-white">
                            {t('home.message.quote')}
                        </p>
                        <footer className="mt-6 text-sm text-white/65">
                            {t('home.message.name')} — {t('home.message.role')}
                        </footer>
                    </blockquote>

                    <ul className="mt-14 space-y-4 border-t border-white/15 pt-10">
                        {benefitKeys.map((key) => (
                            <li key={key} className="flex items-start gap-3.5">
                                <Sparkle className="mt-1.5" />
                                <span className="text-sm leading-relaxed text-white/80">
                                    {t(key)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <VerticalLabel tone="dark" className="absolute top-14 right-10">
                    {t('home.concept.vertical')}
                </VerticalLabel>
            </aside>
        </div>
    );
}
