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

                <div className="overflow-x-auto border border-border">
                    <table className="min-w-160 w-full text-left text-sm">
                        <thead className="border-b border-border bg-surface text-xs tracking-wide text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.table.page')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.table.title')}
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    {t('admin.table.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {pages.map((page) => (
                                <tr key={page.id} className="bg-background">
                                    <td className="px-4 py-3 font-medium text-ink">
                                        {t(`admin.pages.keys.${page.key}`)}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {page.titles.ja ??
                                            page.titles.en ??
                                            Object.values(page.titles)[0] ??
                                            page.key}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={pagesEdit.url(page.id)}
                                            className="text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                                        >
                                            {t('admin.pages.edit')}
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {pages.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                                    >
                                        {t('admin.pages.empty')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
