import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { dashboard } from '@/routes';

type Props = {
    topic: 'lessons' | 'watchHistory';
};

export default function MemberComingSoon({ topic }: Props) {
    const { t } = useTranslation();
    const title =
        topic === 'lessons'
            ? t('mypage.lessonsTitle')
            : t('mypage.historyTitle');

    return (
        <>
            <Head title={title} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <p className="text-tracking-label text-xs text-muted-foreground uppercase">
                    JBA
                </p>
                <h1 className="font-serif text-2xl font-bold text-ink md:text-3xl">
                    {title}
                </h1>
                <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                    {t('mypage.comingSoon')}
                </p>
            </div>
        </>
    );
}

MemberComingSoon.layout = {
    breadcrumbs: [
        {
            title: 'mypage.title',
            href: dashboard(),
        },
    ],
};
