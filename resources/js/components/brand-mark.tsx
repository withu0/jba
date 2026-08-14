import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

const LOGO_BLACK = '/images/JBA_logo-black.svg';
const LOGO_WHITE = '/images/JBA_logo-white.svg';

type Props = {
    className?: string;
    compact?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'black' | 'white';
};

const sizeClasses = {
    sm: 'h-10 sm:h-11',
    md: 'h-12 sm:h-14',
    lg: 'h-24 sm:h-32',
} as const;

export function BrandMark({
    className,
    compact = false,
    size,
    variant = 'black',
}: Props) {
    const resolvedSize = size ?? (compact ? 'sm' : 'md');

    return (
        <Link
            href={home()}
            className={cn(
                'group inline-flex items-center text-foreground no-underline',
                className,
            )}
        >
            <img
                src={variant === 'white' ? LOGO_WHITE : LOGO_BLACK}
                alt="JBA"
                className={cn(
                    'w-auto object-contain object-left',
                    sizeClasses[resolvedSize],
                )}
            />
        </Link>
    );
}
