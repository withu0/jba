import { cn } from '@/lib/utils';

type Props = {
    eyebrow?: string;
    title: string;
    lead?: string;
    align?: 'left' | 'center';
    tone?: 'light' | 'dark';
    className?: string;
    as?: 'h1' | 'h2' | 'h3';
};

export function SectionHeading({
    eyebrow,
    title,
    lead,
    align = 'left',
    tone = 'light',
    className,
    as: Tag = 'h2',
}: Props) {
    return (
        <div
            className={cn(
                'flex flex-col',
                align === 'center' && 'items-center text-center',
                className,
            )}
        >
            {eyebrow && (
                <p
                    className={cn(
                        'text-tracking-label text-xs uppercase sm:text-sm',
                        tone === 'light'
                            ? 'text-brand-blue'
                            : 'text-brand-turquoise',
                    )}
                >
                    {eyebrow}
                </p>
            )}
            <span
                aria-hidden
                className={cn(
                    'bg-brand-gradient mt-4 h-0.5 w-14 rounded-full',
                    align === 'center' && 'self-center',
                )}
            />
            <Tag
                className={cn(
                    'mt-6 font-serif text-3xl leading-[1.3] font-bold tracking-tight text-balance sm:text-4xl md:text-[2.75rem]',
                    tone === 'light' ? 'text-ink' : 'text-white',
                )}
            >
                {title}
            </Tag>
            {lead && (
                <p
                    className={cn(
                        'mt-6 max-w-2xl text-base leading-[1.9]',
                        tone === 'light'
                            ? 'text-muted-foreground'
                            : 'text-white/75',
                    )}
                >
                    {lead}
                </p>
            )}
        </div>
    );
}
