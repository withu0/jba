import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

type Props = {
    message: string;
    href?: string;
    actionLabel?: string;
};

export function EmptyState({ message, href, actionLabel }: Props) {
    const { t } = useTranslation();

    return (
        <div className="rounded-md border border-dashed border-border bg-surface px-6 py-12 text-center">
            <p className="text-muted-foreground">{message}</p>
            {href && (
                <p className="mt-4">
                    <Link
                        href={href}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {actionLabel ?? t('pages.backHome')}
                    </Link>
                </p>
            )}
        </div>
    );
}
