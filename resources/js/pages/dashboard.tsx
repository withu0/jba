import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, Clock3, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MemberHero } from '@/components/member-hero';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes';
import {
    history as lessonsHistory,
    index as lessonsIndex,
    show as lessonShow,
} from '@/routes/lessons';
import { edit as editProfile } from '@/routes/profile';
import type { Auth } from '@/types';

type HistoryItem = {
    id: number;
    title: string;
    category_name: string | null;
    started: boolean;
    completed: boolean;
    started_at: string | null;
    completed_at: string | null;
};

type PageProps = {
    auth: Auth;
    recentHistory: HistoryItem[];
};

export default function Dashboard({ recentHistory }: PageProps) {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const getInitials = useInitials();
    const user = auth.user;

    if (!user) {
        return null;
    }

    return (
        <>
            <Head title={t('mypage.title')} />
            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto p-4 md:p-6">
                <MemberHero title={t('mypage.title')} lead={t('mypage.lead')} />

                <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                    <div className="shadow-soft rounded-md border border-border bg-card p-6">
                        <div className="flex flex-wrap items-start gap-5">
                            <Avatar className="size-20 overflow-hidden rounded-full border border-border">
                                <AvatarImage
                                    src={user.avatar ?? undefined}
                                    alt={user.name}
                                />
                                <AvatarFallback className="bg-surface text-lg text-ink">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1 space-y-2">
                                <h2 className="font-serif text-2xl font-bold text-ink">
                                    {user.name}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink/90">
                                    {user.bio?.trim()
                                        ? user.bio
                                        : t('mypage.bioEmpty')}
                                </p>
                            </div>

                            <Button asChild variant="outline" size="sm">
                                <Link href={editProfile()}>
                                    <Settings2 className="size-4" />
                                    {t('mypage.editProfile')}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <Link
                            href={lessonsIndex()}
                            className="hover:shadow-soft rounded-md border border-border bg-card px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/50"
                        >
                            <div className="flex items-center gap-3">
                                <BookOpen className="size-5 text-brand-blue" />
                                <div>
                                    <div className="text-sm font-medium text-ink">
                                        {t('mypage.lessonsTitle')}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {t('mypage.lessonsLead')}
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={lessonsHistory()}
                            className="hover:shadow-soft rounded-md border border-border bg-card px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/50"
                        >
                            <div className="flex items-center gap-3">
                                <Clock3 className="size-5 text-brand-blue" />
                                <div>
                                    <div className="text-sm font-medium text-ink">
                                        {t('mypage.historyTitle')}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {recentHistory.length > 0
                                            ? t('mypage.historyCount', {
                                                  count: recentHistory.length,
                                              })
                                            : t('mypage.historyEmpty')}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="font-serif text-xl font-bold text-ink md:text-2xl">
                                {t('mypage.historyTitle')}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('mypage.historyLead')}
                            </p>
                        </div>
                        <Link
                            href={lessonsHistory()}
                            className="text-sm text-brand-blue hover:underline"
                        >
                            {t('mypage.viewAllHistory')}
                        </Link>
                    </div>

                    {recentHistory.length === 0 ? (
                        <p className="rounded-md border border-border bg-card px-5 py-6 text-sm text-muted-foreground">
                            {t('mypage.historyEmpty')}
                        </p>
                    ) : (
                        <ul className="divide-y divide-border rounded-md border border-border bg-card">
                            {recentHistory.map((entry) => (
                                <li key={entry.id}>
                                    <Link
                                        href={lessonShow(entry.id)}
                                        className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            {entry.category_name && (
                                                <p className="text-xs text-muted-foreground">
                                                    {entry.category_name}
                                                </p>
                                            )}
                                            <p className="font-medium text-ink">
                                                {entry.title}
                                            </p>
                                        </div>
                                        <span className="text-xs tracking-wide text-muted-foreground uppercase">
                                            {entry.completed
                                                ? t('lessons.statusCompleted')
                                                : t('lessons.statusStarted')}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'mypage.title',
            href: dashboard(),
        },
    ],
};
