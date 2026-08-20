import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type GridProps = {
    columns?: 2 | 3;
    className?: string;
    children: ReactNode;
};

export function AdminFieldGrid({
    columns = 2,
    className,
    children,
}: GridProps) {
    return (
        <div
            className={cn(
                'grid items-start gap-x-4 gap-y-4',
                columns === 2 && 'sm:grid-cols-2',
                columns === 3 && 'md:grid-cols-3',
                className,
            )}
        >
            {children}
        </div>
    );
}

type FieldProps = {
    className?: string;
    children: ReactNode;
};

export function AdminField({ className, children }: FieldProps) {
    return (
        <div className={cn('grid content-start gap-2 self-start', className)}>
            {children}
        </div>
    );
}
