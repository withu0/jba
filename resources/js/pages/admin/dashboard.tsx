import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    Image,
    Mail,
    MessagesSquare,
    Newspaper,
    PlayCircle,
    Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { dashboard } from '@/routes/admin';
import { index as beforeAfterIndex } from '@/routes/admin/before-after';
import {
    index as contactsIndex,
    show as contactsShow,
} from '@/routes/admin/contacts';
import { index as interviewsIndex } from '@/routes/admin/interviews';
import { index as lessonCategoriesIndex } from '@/routes/admin/lesson-categories';
import {
    edit as lessonEdit,
    index as lessonsIndex,
} from '@/routes/admin/lessons';
import { index as mangaIndex } from '@/routes/admin/manga';
import { index as mangaCategoriesIndex } from '@/routes/admin/manga-categories';
import { index as membersIndex } from '@/routes/admin/members';
import { index as newsIndex } from '@/routes/admin/news';
import { index as pagesIndex } from '@/routes/admin/pages';

type CountStat = {
    total: number;
    published?: number;
    this_month?: number;
    new?: number;
    completed_this_month?: number;
};

type Props = {
    stats: {
        members: CountStat;
        lessons: CountStat;
        news: CountStat;
        interviews: CountStat;
        manga: CountStat;
        before_after: CountStat;
        contacts: CountStat;
        lesson_views: CountStat;
    };
    lesson_view_chart: Array<{ date: string; count: number }>;
    recent_contacts: Array<{
        id: number;
        name: string;
        email: string;
        subject: string | null;
        status: string;
        created_at: string | null;
    }>;
    popular_lessons: Array<{
        id: number;
        title: string | null;
        views: number;
    }>;
};

const modules = [
    { key: 'lessons', href: lessonsIndex.url() },
    { key: 'lessonCategories', href: lessonCategoriesIndex.url() },
    { key: 'news', href: newsIndex.url() },
    { key: 'interviews', href: interviewsIndex.url() },
    { key: 'beforeAfter', href: beforeAfterIndex.url() },
    { key: 'manga', href: mangaIndex.url() },
    { key: 'mangaCategories', href: mangaCategoriesIndex.url() },
    { key: 'pages', href: pagesIndex.url() },
    { key: 'contacts', href: contactsIndex.url() },
] as const;

function formatDate(value: string | null, locale: string): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function formatChartLabel(value: string, locale: string): string {
    return new Intl.DateTimeFormat(locale, {
        month: 'numeric',
        day: 'numeric',
    }).format(new Date(`${value}T00:00:00`));
}

export default function AdminDashboard({
    stats,
    lesson_view_chart: lessonViewChart,
    recent_contacts: recentContacts,
    popular_lessons: popularLessons,
}: Props) {
    const { t, i18n } = useTranslation();
    const maxViews = Math.max(
        ...lessonViewChart.map((point) => point.count),
        1,
    );

    const cards = [
        {
            key: 'members',
            href: membersIndex.url(),
            icon: Users,
            value: stats.members.total,
            hint: t('admin.dashboardStats.thisMonth', {
                count: stats.members.this_month ?? 0,
            }),
        },
        {
            key: 'lessons',
            href: lessonsIndex.url(),
            icon: BookOpen,
            value: stats.lessons.total,
            hint: t('admin.dashboardStats.published', {
                count: stats.lessons.published ?? 0,
            }),
        },
        {
            key: 'lessonViews',
            href: lessonsIndex.url(),
            icon: PlayCircle,
            value: stats.lesson_views.this_month ?? 0,
            hint: t('admin.dashboardStats.completedThisMonth', {
                count: stats.lesson_views.completed_this_month ?? 0,
            }),
        },
        {
            key: 'contacts',
            href: contactsIndex.url(),
            icon: Mail,
            value: stats.contacts.total,
            hint: t('admin.dashboardStats.new', {
                count: stats.contacts.new ?? 0,
            }),
        },
        {
            key: 'news',
            href: newsIndex.url(),
            icon: Newspaper,
            value: stats.news.total,
            hint: t('admin.dashboardStats.published', {
                count: stats.news.published ?? 0,
            }),
        },
        {
            key: 'interviews',
            href: interviewsIndex.url(),
            icon: MessagesSquare,
            value: stats.interviews.total,
            hint: t('admin.dashboardStats.published', {
                count: stats.interviews.published ?? 0,
            }),
        },
        {
            key: 'manga',
            href: mangaIndex.url(),
            icon: BookOpen,
            value: stats.manga.total,
            hint: t('admin.dashboardStats.published', {
                count: stats.manga.published ?? 0,
            }),
        },
        {
            key: 'beforeAfter',
            href: beforeAfterIndex.url(),
            icon: Image,
            value: stats.before_after.total,
            hint: t('admin.dashboardStats.published', {
                count: stats.before_after.published ?? 0,
            }),
        },
    ] as const;

    return (
        <>
            <Head title={t('admin.nav.dashboard')} />
            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-ink">
                        {t('admin.dashboardTitle')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('admin.dashboardLead')}
                    </p>
                </div>

                <section>
                    <h2 className="mb-3 text-sm font-medium text-ink">
                        {t('admin.dashboardStats.overview')}
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {cards.map((card) => {
                            const Icon = card.icon;
                            const content = (
                                <>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-sm font-medium text-ink">
                                            {t(
                                                `admin.dashboardStats.cards.${card.key}`,
                                            )}
                                        </div>
                                        <Icon className="size-4 text-brand-blue" />
                                    </div>
                                    <div className="mt-3 font-serif text-3xl font-bold text-ink">
                                        {card.value.toLocaleString(
                                            i18n.language,
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {card.hint}
                                    </p>
                                </>
                            );

                            const className =
                                'rounded-md border border-border bg-card px-4 py-4';

                            if (!card.href) {
                                return (
                                    <div key={card.key} className={className}>
                                        {content}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={card.key}
                                    href={card.href}
                                    className={`${className} transition-colors hover:border-brand-blue hover:bg-surface`}
                                >
                                    {content}
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-md border border-border bg-card p-4">
                        <h2 className="text-sm font-medium text-ink">
                            {t('admin.dashboardStats.lessonViewsTitle')}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {t('admin.dashboardStats.lessonViewsLead')}
                        </p>
                        <div className="mt-4 flex h-40 items-end gap-1">
                            {lessonViewChart.map((point) => (
                                <div
                                    key={point.date}
                                    className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
                                >
                                    <div
                                        className="w-full rounded-sm bg-brand-blue/80"
                                        style={{
                                            height: `${Math.max((point.count / maxViews) * 100, point.count > 0 ? 8 : 2)}%`,
                                        }}
                                        title={`${formatChartLabel(point.date, i18n.language)}: ${point.count}`}
                                    />
                                    <span className="text-[10px] text-muted-foreground">
                                        {formatChartLabel(
                                            point.date,
                                            i18n.language,
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-medium text-ink">
                                {t('admin.dashboardStats.popularLessonsTitle')}
                            </h2>
                            <Link
                                href={lessonsIndex.url()}
                                className="text-xs font-medium text-brand-blue underline-offset-4 hover:underline"
                            >
                                {t('admin.dashboardStats.viewAll')}
                            </Link>
                        </div>
                        <div className="mt-3 divide-y divide-border">
                            {popularLessons.map((lesson) => (
                                <Link
                                    key={lesson.id}
                                    href={lessonEdit.url(lesson.id)}
                                    className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-brand-blue"
                                >
                                    <span className="min-w-0 truncate text-ink">
                                        {lesson.title?.trim() ||
                                            t(
                                                'admin.dashboardStats.untitledLesson',
                                            )}
                                    </span>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {t('admin.dashboardStats.viewsCount', {
                                            count: lesson.views,
                                        })}
                                    </span>
                                </Link>
                            ))}
                            {popularLessons.length === 0 && (
                                <p className="py-6 text-sm text-muted-foreground">
                                    {t(
                                        'admin.dashboardStats.popularLessonsEmpty',
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="rounded-md border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-medium text-ink">
                            {t('admin.dashboardStats.recentContactsTitle')}
                        </h2>
                        <Link
                            href={contactsIndex.url()}
                            className="text-xs font-medium text-brand-blue underline-offset-4 hover:underline"
                        >
                            {t('admin.dashboardStats.viewAll')}
                        </Link>
                    </div>
                    <div className="mt-3 divide-y divide-border">
                        {recentContacts.map((contact) => (
                            <Link
                                key={contact.id}
                                href={contactsShow.url(contact.id)}
                                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-medium text-ink">
                                        {contact.subject?.trim() ||
                                            t('admin.contacts.noSubject')}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {contact.name} · {contact.email} ·{' '}
                                        {t(
                                            `admin.contacts.status.${contact.status}`,
                                        )}
                                    </p>
                                </div>
                                <span className="shrink-0 text-xs text-muted-foreground">
                                    {formatDate(
                                        contact.created_at,
                                        i18n.language,
                                    )}
                                </span>
                            </Link>
                        ))}
                        {recentContacts.length === 0 && (
                            <p className="py-6 text-sm text-muted-foreground">
                                {t('admin.dashboardStats.recentContactsEmpty')}
                            </p>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="mb-3 text-sm font-medium text-ink">
                        {t('admin.dashboardStats.shortcuts')}
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {modules.map((module) => (
                            <Link
                                key={module.key}
                                href={module.href}
                                className="rounded-md border border-border bg-card px-4 py-5 transition-colors hover:border-brand-blue hover:bg-surface"
                            >
                                <div className="text-sm font-medium text-ink">
                                    {t(`admin.nav.${module.key}`)}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'admin.nav.dashboard',
            href: dashboard(),
        },
    ],
};
