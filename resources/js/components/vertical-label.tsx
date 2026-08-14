import { cn } from '@/lib/utils';

/**
 * Vertical (縦書き) accent text used along section edges. Decorative only —
 * the same wording always exists as real horizontal copy nearby.
 */
export function VerticalLabel({
    children,
    className,
    tone = 'light',
}: {
    children: React.ReactNode;
    className?: string;
    tone?: 'light' | 'dark';
}) {
    return (
        <span
            aria-hidden
            className={cn(
                'tategaki pointer-events-none hidden font-serif text-xs select-none lg:inline-block',
                tone === 'light' ? 'text-ink/25' : 'text-white/40',
                className,
            )}
        >
            {children}
        </span>
    );
}
