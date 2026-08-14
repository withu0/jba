import { cn } from '@/lib/utils';

/**
 * The logo's ✦ mark reused as the site-wide divider, per docs/design_guide.md §3.
 */
export function Sparkle({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden
            className={cn('size-3 shrink-0 fill-brand-gold', className)}
        >
            <path d="M12 0l1.9 8.2c.2.9.9 1.7 1.9 1.9L24 12l-8.2 1.9c-.9.2-1.7.9-1.9 1.9L12 24l-1.9-8.2c-.2-.9-.9-1.7-1.9-1.9L0 12l8.2-1.9c.9-.2 1.7-.9 1.9-1.9L12 0z" />
        </svg>
    );
}

export function SparkleDivider({
    className,
    tone = 'light',
}: {
    className?: string;
    tone?: 'light' | 'dark';
}) {
    return (
        <div className={cn('flex items-center gap-3', className)} aria-hidden>
            <span
                className={cn(
                    'h-px flex-1 bg-gradient-to-r from-transparent',
                    tone === 'light' ? 'to-border' : 'to-white/30',
                )}
            />
            <Sparkle />
            <span
                className={cn(
                    'h-px flex-1 bg-gradient-to-l from-transparent',
                    tone === 'light' ? 'to-border' : 'to-white/30',
                )}
            />
        </div>
    );
}
