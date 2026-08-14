import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/empty-state';

type Props = {
    slug: string;
};

export default function Placeholder({ slug }: Props) {
    const { t } = useTranslation();
    const title = t(`nav.${slug}`);

    return (
        <>
            <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
                <p className="text-tracking-label text-xs text-muted-foreground uppercase">
                    JBA
                </p>
                <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                    {title}
                </h1>
                <div className="mt-8">
                    <EmptyState
                        message={t('placeholder.comingSoon')}
                        href="/"
                    />
                </div>
            </div>
        </>
    );
}
