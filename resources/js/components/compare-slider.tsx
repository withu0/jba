import { MoveHorizontal } from 'lucide-react';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

type Props = {
    beforeUrl: string | null;
    afterUrl: string | null;
    title: string;
    className?: string;
};

/**
 * Before sits on top of after, clipped from the left, and an invisible range
 * input drives the divider so keyboard and pointer both work for free.
 */
export function CompareSlider({
    beforeUrl,
    afterUrl,
    title,
    className,
}: Props) {
    const { t } = useTranslation();
    const [position, setPosition] = useState(50);
    const id = useId();

    if (!beforeUrl || !afterUrl) {
        return (
            <div
                className={cn(
                    'aspect-[4/3] overflow-hidden rounded-md bg-surface',
                    className,
                )}
            >
                {(beforeUrl ?? afterUrl) && (
                    <img
                        src={(beforeUrl ?? afterUrl) as string}
                        alt={title}
                        loading="lazy"
                        className="size-full object-cover"
                    />
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                'group relative aspect-[4/3] overflow-hidden rounded-md bg-surface select-none',
                className,
            )}
        >
            <img
                src={afterUrl}
                alt={t('beforeAfter.afterAlt', { title })}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
            />
            <img
                src={beforeUrl}
                alt={t('beforeAfter.beforeAlt', { title })}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            />

            <span
                aria-hidden
                className="text-tracking-label absolute top-3 left-3 rounded-sm bg-ink/70 px-2 py-0.5 text-[0.5625rem] text-white uppercase backdrop-blur-sm"
            >
                {t('beforeAfter.beforeLabel')}
            </span>
            <span
                aria-hidden
                className="text-tracking-label absolute top-3 right-3 rounded-sm bg-brand-gold/85 px-2 py-0.5 text-[0.5625rem] text-white uppercase backdrop-blur-sm"
            >
                {t('beforeAfter.afterLabel')}
            </span>

            <span
                aria-hidden
                className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90 shadow-[0_0_14px_rgba(0,0,0,0.35)]"
                style={{ left: `${position}%` }}
            >
                <span className="shadow-lift absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-blue transition-transform duration-300 group-hover:scale-110">
                    <MoveHorizontal className="size-4" />
                </span>
            </span>

            <label htmlFor={id} className="sr-only">
                {t('beforeAfter.compareLabel', { title })}
            </label>
            <input
                id={id}
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={position}
                onChange={(event) => setPosition(Number(event.target.value))}
                className="absolute inset-0 size-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus-visible:opacity-0"
            />
        </div>
    );
}
