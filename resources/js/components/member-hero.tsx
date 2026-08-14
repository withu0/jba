import { SparkleDivider } from '@/components/sparkle-divider';

type Props = {
    title: string;
    lead?: string;
    eyebrow?: string;
    image?: string;
    children?: React.ReactNode;
};

export function MemberHero({
    title,
    lead,
    eyebrow = 'Members Only',
    image = '/images/hero-2.jpg',
    children,
}: Props) {
    return (
        <section className="relative isolate overflow-hidden rounded-md bg-ink px-6 py-10 text-white md:px-10 md:py-12">
            <img
                src={image}
                alt=""
                className="absolute inset-0 size-full object-cover opacity-35"
            />
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-[#08202b]/92 via-[#0f4a63]/78 to-[#349cca]/40"
            />
            <div aria-hidden className="bg-noise absolute inset-0 opacity-50" />

            <div className="relative">
                <p className="text-tracking-label text-xs text-white/75 uppercase">
                    {eyebrow}
                </p>
                <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-balance md:text-4xl">
                    {title}
                </h1>
                <SparkleDivider tone="dark" className="mt-6 max-w-32" />
                {lead && (
                    <p className="mt-6 max-w-xl text-sm leading-[1.9] text-white/80 md:text-base">
                        {lead}
                    </p>
                )}
                {children}
            </div>
        </section>
    );
}
