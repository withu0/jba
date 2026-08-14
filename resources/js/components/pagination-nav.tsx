import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

/** Laravel ships the arrows as HTML entities, so normalise before rendering. */
function decode(label: string): string {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .trim();
}

export function PaginationNav({
    links,
    className,
}: {
    links: PaginationLink[];
    className?: string;
}) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            aria-label="Pagination"
            className={cn(
                'flex flex-wrap items-center justify-center gap-1.5',
                className,
            )}
        >
            {links.map((link, index) => {
                const label = decode(link.label);
                const shared =
                    'inline-flex h-10 min-w-10 items-center justify-center rounded-md px-3.5 text-sm transition-colors';

                if (!link.url) {
                    return (
                        <span
                            key={`${label}-${index}`}
                            aria-hidden
                            className={cn(shared, 'text-muted-foreground/50')}
                        >
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${label}-${index}`}
                        href={link.url}
                        aria-current={link.active ? 'page' : undefined}
                        className={cn(
                            shared,
                            link.active
                                ? 'bg-brand-gradient font-medium text-white'
                                : 'border border-border text-ink hover:border-brand-blue/40 hover:text-brand-blue',
                        )}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
