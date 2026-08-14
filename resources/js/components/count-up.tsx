import { useEffect, useRef } from 'react';

type Props = {
    to: number;
    durationMs?: number;
    className?: string;
};

/**
 * Renders the final number in the markup so server output and no-JS readers see
 * the real figure, then rewinds and counts up once the element scrolls in.
 */
export function CountUp({ to, durationMs = 1600, className }: Props) {
    const ref = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        const node = ref.current;

        if (
            !node ||
            typeof IntersectionObserver === 'undefined' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return;
        }

        let frame = 0;
        let start: number | null = null;

        node.textContent = '0';

        const step = (now: number) => {
            start ??= now;

            const progress = Math.min((now - start) / durationMs, 1);
            // easeOutExpo so the number lands softly instead of stopping dead
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            node.textContent = `${Math.round(to * eased)}`;

            if (progress < 1) {
                frame = requestAnimationFrame(step);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        frame = requestAnimationFrame(step);
                        observer.disconnect();
                    }
                }
            },
            { threshold: 0.4 },
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [to, durationMs]);

    return (
        <span ref={ref} className={className}>
            {to}
        </span>
    );
}
