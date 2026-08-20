import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import BeforeAfterController from '@/actions/App/Http/Controllers/Admin/BeforeAfterController';
import { AdminSortableList } from '@/components/admin-sortable-list';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import {
    create as beforeAfterCreate,
    edit as beforeAfterEdit,
    index as beforeAfterIndex,
} from '@/routes/admin/before-after';

type PairRow = {
    id: number;
    is_published: boolean;
    sort_order: number;
    title: string;
    before_image_url: string | null;
    after_image_url: string | null;
};

type Props = {
    pairs: PairRow[];
};

export default function AdminBeforeAfterIndex({ pairs }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.beforeAfter.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.beforeAfter.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.beforeAfter.lead')}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={beforeAfterCreate.url()}>
                            {t('admin.beforeAfter.create')}
                        </Link>
                    </Button>
                </div>

                {pairs.length > 0 ? (
                    <AdminSortableList
                        items={pairs}
                        header={
                            <>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.table.preview')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.table.title')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.table.status')}
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    {t('admin.table.actions')}
                                </th>
                            </>
                        }
                        onReorder={(ids) =>
                            router.post(
                                BeforeAfterController.reorder.url(),
                                { ids },
                                { preserveScroll: true },
                            )
                        }
                        renderItem={(pair) => (
                            <>
                                <td className="px-4 py-3">
                                    <div className="grid w-20 grid-cols-2 gap-1">
                                        {pair.before_image_url && (
                                            <img
                                                src={pair.before_image_url}
                                                alt=""
                                                className="aspect-square object-cover"
                                            />
                                        )}
                                        {pair.after_image_url && (
                                            <img
                                                src={pair.after_image_url}
                                                alt=""
                                                className="aspect-square object-cover"
                                            />
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-medium text-ink">
                                    {pair.title}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {pair.is_published
                                        ? t('admin.beforeAfter.statusPublished')
                                        : t('admin.beforeAfter.statusDraft')}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={beforeAfterEdit.url(pair.id)}
                                        className="text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                                    >
                                        {t('admin.beforeAfter.edit')}
                                    </Link>
                                </td>
                            </>
                        )}
                    />
                ) : (
                    <p className="border border-border px-4 py-8 text-sm text-muted-foreground">
                        {t('admin.beforeAfter.empty')}
                    </p>
                )}
            </div>
        </>
    );
}

AdminBeforeAfterIndex.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.beforeAfter', href: beforeAfterIndex() },
    ],
};
