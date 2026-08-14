import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import BeforeAfterController from '@/actions/App/Http/Controllers/Admin/BeforeAfterController';
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

                <div className="divide-y divide-border border border-border">
                    {pairs.map((pair, index) => (
                        <div
                            key={pair.id}
                            className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex min-w-0 flex-1 items-start gap-4">
                                <div className="grid w-28 shrink-0 grid-cols-2 gap-1">
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
                                <div className="min-w-0">
                                    <div className="text-sm font-medium text-ink">
                                        {pair.title}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {pair.is_published
                                            ? t(
                                                  'admin.beforeAfter.statusPublished',
                                              )
                                            : t(
                                                  'admin.beforeAfter.statusDraft',
                                              )}
                                        {' · '}
                                        {t('admin.beforeAfter.sortOrder')}:{' '}
                                        {pair.sort_order}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === 0}
                                    onClick={() =>
                                        router.post(
                                            BeforeAfterController.moveUp.url(
                                                pair.id,
                                            ),
                                        )
                                    }
                                >
                                    {t('admin.beforeAfter.moveUp')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === pairs.length - 1}
                                    onClick={() =>
                                        router.post(
                                            BeforeAfterController.moveDown.url(
                                                pair.id,
                                            ),
                                        )
                                    }
                                >
                                    {t('admin.beforeAfter.moveDown')}
                                </Button>
                                <Link
                                    href={beforeAfterEdit.url(pair.id)}
                                    className="px-2 text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                                >
                                    {t('admin.beforeAfter.edit')}
                                </Link>
                            </div>
                        </div>
                    ))}

                    {pairs.length === 0 && (
                        <p className="px-4 py-8 text-sm text-muted-foreground">
                            {t('admin.beforeAfter.empty')}
                        </p>
                    )}
                </div>
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
