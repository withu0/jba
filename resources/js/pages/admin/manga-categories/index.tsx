import { Form, Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MangaCategoryController from '@/actions/App/Http/Controllers/Admin/MangaCategoryController';
import { AdminField, AdminFieldGrid } from '@/components/admin-form-layout';
import { AdminSortableList } from '@/components/admin-sortable-list';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { localeLabels } from '@/lib/locale-labels';
import { dashboard } from '@/routes/admin';
import { index as mangaIndex } from '@/routes/admin/manga';
import {
    edit as categoryEdit,
    index as categoriesIndex,
} from '@/routes/admin/manga-categories';

type CategoryNameFields = {
    name: string;
};

type CategoryRow = {
    id: number;
    slug: string;
    sort_order: number;
    episodes_count: number;
    name: string;
};

type Props = {
    categories: CategoryRow[];
    locales: string[];
    translations: Record<string, CategoryNameFields>;
    nextSortOrder: number;
};

export default function AdminMangaCategoriesIndex({
    categories,
    locales,
    translations,
    nextSortOrder,
}: Props) {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    const deleteCategory = (id: number) => {
        if (!window.confirm(t('admin.mangaCategories.deleteConfirm'))) {
            return;
        }

        router.delete(MangaCategoryController.destroy.url(id));
    };

    return (
        <>
            <Head title={t('admin.mangaCategories.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.mangaCategories.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.mangaCategories.lead')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={mangaIndex()}
                            className="text-sm text-brand-blue underline-offset-4 hover:underline"
                        >
                            {t('admin.mangaCategories.backToEpisodes')}
                        </Link>
                        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                            <DialogTrigger asChild>
                                <Button type="button">
                                    {t('admin.mangaCategories.create')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        {t('admin.mangaCategories.create')}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {t('admin.mangaCategories.lead')}
                                    </DialogDescription>
                                </DialogHeader>
                                <Form
                                    {...MangaCategoryController.store.form()}
                                    options={{ preserveScroll: true }}
                                    resetOnSuccess
                                    onSuccess={() => setCreateOpen(false)}
                                    className="space-y-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <AdminFieldGrid>
                                                <AdminField>
                                                    <Label htmlFor="slug">
                                                        {t(
                                                            'admin.mangaCategories.slug',
                                                        )}
                                                    </Label>
                                                    <Input
                                                        id="slug"
                                                        name="slug"
                                                        required
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        {t(
                                                            'admin.mangaCategories.slugHint',
                                                        )}
                                                    </p>
                                                    <InputError
                                                        message={errors.slug}
                                                    />
                                                </AdminField>
                                                <AdminField>
                                                    <Label htmlFor="sort_order">
                                                        {t(
                                                            'admin.mangaCategories.sortOrder',
                                                        )}
                                                    </Label>
                                                    <Input
                                                        id="sort_order"
                                                        type="number"
                                                        name="sort_order"
                                                        min={0}
                                                        defaultValue={
                                                            nextSortOrder
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.sort_order
                                                        }
                                                    />
                                                </AdminField>
                                            </AdminFieldGrid>

                                            <AdminFieldGrid columns={3}>
                                                {locales.map((locale) => (
                                                    <AdminField key={locale}>
                                                        <Label
                                                            htmlFor={`name-${locale}`}
                                                        >
                                                            {t(
                                                                'admin.mangaCategories.fieldName',
                                                            )}{' '}
                                                            (
                                                            {localeLabels[
                                                                locale
                                                            ] ?? locale}
                                                            )
                                                        </Label>
                                                        <Input
                                                            id={`name-${locale}`}
                                                            name={`translations[${locale}][name]`}
                                                            defaultValue={
                                                                translations[
                                                                    locale
                                                                ]?.name ?? ''
                                                            }
                                                            required
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `translations.${locale}.name`
                                                                ]
                                                            }
                                                        />
                                                    </AdminField>
                                                ))}
                                            </AdminFieldGrid>

                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && <Spinner />}
                                                {t(
                                                    'admin.mangaCategories.create',
                                                )}
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {categories.length > 0 ? (
                    <AdminSortableList
                        items={categories}
                        header={
                            <>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.table.name')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.table.slug')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.table.count')}
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    {t('admin.table.actions')}
                                </th>
                            </>
                        }
                        onReorder={(ids) =>
                            router.post(
                                MangaCategoryController.reorder.url(),
                                { ids },
                                { preserveScroll: true },
                            )
                        }
                        renderItem={(category) => (
                            <>
                                <td className="px-4 py-3 font-medium text-ink">
                                    {category.name}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {category.slug}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {t('admin.mangaCategories.episodesCount', {
                                        count: category.episodes_count,
                                    })}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                category.episodes_count > 0
                                            }
                                            onClick={() =>
                                                deleteCategory(category.id)
                                            }
                                        >
                                            {t('common.delete')}
                                        </Button>
                                        <Link
                                            href={categoryEdit.url(category.id)}
                                            className="px-2 text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                                        >
                                            {t('admin.mangaCategories.edit')}
                                        </Link>
                                    </div>
                                </td>
                            </>
                        )}
                    />
                ) : (
                    <p className="border border-border px-4 py-8 text-sm text-muted-foreground">
                        {t('admin.mangaCategories.empty')}
                    </p>
                )}
            </div>
        </>
    );
}

AdminMangaCategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.manga', href: mangaIndex() },
        { title: 'admin.nav.mangaCategories', href: categoriesIndex() },
    ],
};
