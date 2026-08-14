import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    children: React.ReactNode;
    className?: string;
    /** Stagger in milliseconds, applied as a transition delay. */
    delay?: number;
    as?: 'div' | 'li' | 'section' | 'article' | 'span';
};

export function Reveal({
    children,
    className,
    delay = 0,
    as: Tag = 'div',
}: Props) {
    const ref = useRef<HTMLElement | null>(null);

    // The revealed flag lives on the DOM node rather than in state so the
    // markup is identical on the server and on first paint.
    useEffect(() => {
        const node = ref.current;

        if (!node) {
            return;
        }

        const reveal = () => node.setAttribute('data-revealed', 'true');

        if (
            typeof IntersectionObserver === 'undefined' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            reveal();

            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        reveal();
                        observer.disconnect();
                    }
                }
            },
            { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref as never}
            className={cn('reveal', className)}
            data-revealed="false"
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </Tag>
    );
}
