import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { dashboard } from '@/routes/admin';
import { index as beforeAfterIndex } from '@/routes/admin/before-after';
import { index as contactsIndex } from '@/routes/admin/contacts';
import { index as interviewsIndex } from '@/routes/admin/interviews';
import { index as lessonCategoriesIndex } from '@/routes/admin/lesson-categories';
import { index as lessonsIndex } from '@/routes/admin/lessons';
import { index as mangaIndex } from '@/routes/admin/manga';
import { index as mangaCategoriesIndex } from '@/routes/admin/manga-categories';
import { index as newsIndex } from '@/routes/admin/news';
import { index as pagesIndex } from '@/routes/admin/pages';

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

export default function AdminDashboard() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.nav.dashboard')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-ink">
                        {t('admin.dashboardTitle')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('admin.dashboardLead')}
                    </p>
                </div>

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
