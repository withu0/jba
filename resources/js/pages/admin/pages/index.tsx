import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { dashboard } from '@/routes/admin';
import { edit as pagesEdit, index as pagesIndex } from '@/routes/admin/pages';

type PageRow = {
    id: number;
    key: string;
    titles: Record<string, string>;
};

type Props = {
    pages: PageRow[];
};

export default function AdminPagesIndex({ pages }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.pages.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-ink">
                        {t('admin.pages.title')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('admin.pages.lead')}
                    </p>
                </div>

                <div className="divide-y divide-border border border-border">
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <div className="text-sm font-medium text-ink">
                                    {t(`admin.pages.keys.${page.key}`)}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {page.titles.ja ??
                                        page.titles.en ??
                                        Object.values(page.titles)[0] ??
                                        page.key}
                                </p>
                            </div>
                            <Link
                                href={pagesEdit.url(page.id)}
                                className="text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                            >
                                {t('admin.pages.edit')}
                            </Link>
                        </div>
                    ))}

                    {pages.length === 0 && (
                        <p className="px-4 py-8 text-sm text-muted-foreground">
                            {t('admin.pages.empty')}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

AdminPagesIndex.layout = {
    breadcrumbs: [
        {
            title: 'admin.nav.dashboard',
            href: dashboard(),
        },
        {
            title: 'admin.nav.pages',
            href: pagesIndex(),
        },
    ],
};
