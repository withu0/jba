import { cn } from '@/lib/utils';

type Props = {
    primary: string;
    secondary?: string;
    primaryAlt?: string;
    secondaryAlt?: string;
    /** Which corner the smaller image overlaps. */
    overlap?: 'bottom-right' | 'bottom-left';
    className?: string;
};

export function ImageCollage({
    primary,
    secondary,
    primaryAlt = '',
    secondaryAlt = '',
    overlap = 'bottom-right',
    className,
}: Props) {
    return (
        <div className={cn('relative', className)}>
            <span
                aria-hidden
                className="bg-brand-gradient-soft absolute -top-6 -left-6 hidden size-40 rounded-full blur-2xl lg:block"
            />
            <figure className="shadow-lift relative overflow-hidden rounded-md bg-surface">
                <img
                    src={primary}
                    alt={primaryAlt}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover"
                />
            </figure>

            {secondary && (
                <figure
                    className={cn(
                        'shadow-lift absolute w-[46%] overflow-hidden rounded-md border-4 border-background bg-surface',
                        overlap === 'bottom-right'
                            ? '-right-4 bottom-[-2.5rem] sm:-right-8'
                            : 'bottom-[-2.5rem] -left-4 sm:-left-8',
                    )}
                >
                    <img
                        src={secondary}
                        alt={secondaryAlt}
                        loading="lazy"
                        className="aspect-square w-full object-cover"
                    />
                </figure>
            )}
        </div>
    );
}
