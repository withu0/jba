import { Head, Link } from '@inertiajs/react';
import { Check, Clock3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/empty-state';
import { MemberHero } from '@/components/member-hero';
import { formatDate } from '@/lib/format';
import { dashboard } from '@/routes';
import {
    history as lessonsHistory,
    index as lessonsIndex,
    show as lessonShow,
} from '@/routes/lessons';

type HistoryEntry = {
    id: number;
    title: string;
    thumbnail_url: string | null;
    category_name: string | null;
    started: boolean;
    completed: boolean;
    started_at: string | null;
    completed_at: string | null;
};

export default function MemberLessonHistory({
    entries,
}: {
    entries: HistoryEntry[];
}) {
    const { t, i18n } = useTranslation();

    return (
        <>
            <Head title={t('lessons.historyTitle')} />
            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto p-4 md:p-6">
                <MemberHero
                    title={t('lessons.historyTitle')}
                    lead={t('lessons.historyLead')}
                    image="/images/concept-a.jpg"
                />

                {entries.length === 0 ? (
                    <EmptyState
                        message={t('lessons.historyEmpty')}
                        href={lessonsIndex.url()}
                        actionLabel={t('lessons.browseLessons')}
                    />
                ) : (
                    <ul className="divide-y divide-border overflow-hidden rounded-md border border-border bg-card">
                        {entries.map((entry) => {
                            const stamp =
                                entry.completed_at ?? entry.started_at;

                            return (
                                <li key={entry.id}>
                                    <Link
                                        href={lessonShow(entry.id)}
                                        className="group flex flex-col gap-4 px-4 py-4 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:gap-6 sm:px-5"
                                    >
                                        <div className="aspect-video w-full shrink-0 overflow-hidden rounded-md bg-surface sm:aspect-[16/10] sm:w-36">
                                            {entry.thumbnail_url ? (
                                                <img
                                                    src={entry.thumbnail_url}
                                                    alt=""
                                                    loading="lazy"
                                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div
                                                    aria-hidden
                                                    className="bg-brand-gradient-soft size-full"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            {entry.category_name && (
                                                <p className="text-tracking-label text-[0.6875rem] text-muted-foreground uppercase">
                                                    {entry.category_name}
                                                </p>
                                            )}
                                            <h2 className="mt-1.5 font-serif font-bold text-ink transition-colors group-hover:text-brand-blue">
                                                {entry.title}
                                            </h2>
                                            {stamp && (
                                                <p className="mt-1.5 text-xs text-muted-foreground">
                                                    {formatDate(
                                                        stamp,
                                                        i18n.language,
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        <span
                                            className={
                                                entry.completed
                                                    ? 'text-tracking-label inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-gold/12 px-3 py-1 text-[0.625rem] text-brand-gold uppercase'
                                                    : 'text-tracking-label inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-blue/10 px-3 py-1 text-[0.625rem] text-brand-blue uppercase'
                                            }
                                        >
                                            {entry.completed ? (
                                                <Check
                                                    aria-hidden
                                                    className="size-3"
                                                />
                                            ) : (
                                                <Clock3
                                                    aria-hidden
                                                    className="size-3"
                                                />
                                            )}
                                            {entry.completed
                                                ? t('lessons.statusCompleted')
                                                : t('lessons.statusStarted')}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </>
    );
}

MemberLessonHistory.layout = {
    breadcrumbs: [
        {
            title: 'mypage.title',
            href: dashboard(),
        },
        {
            title: 'lessons.historyTitle',
            href: lessonsHistory(),
        },
    ],
};
