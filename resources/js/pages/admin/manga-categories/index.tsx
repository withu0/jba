import { Form, Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MangaCategoryController from '@/actions/App/Http/Controllers/Admin/MangaCategoryController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
                    <Link
                        href={mangaIndex()}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {t('admin.mangaCategories.backToEpisodes')}
                    </Link>
                </div>

                <div className="divide-y divide-border border border-border">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-ink">
                                    {category.name}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {category.slug}
                                    {' · '}
                                    {t('admin.mangaCategories.sortOrder')}:{' '}
                                    {category.sort_order}
                                    {' · '}
                                    {t('admin.mangaCategories.episodesCount', {
                                        count: category.episodes_count,
                                    })}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === 0}
                                    onClick={() =>
                                        router.post(
                                            MangaCategoryController.moveUp.url(
                                                category.id,
                                            ),
                                        )
                                    }
                                >
                                    {t('admin.mangaCategories.moveUp')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === categories.length - 1}
                                    onClick={() =>
                                        router.post(
                                            MangaCategoryController.moveDown.url(
                                                category.id,
                                            ),
                                        )
                                    }
                                >
                                    {t('admin.mangaCategories.moveDown')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={category.episodes_count > 0}
                                    onClick={() => deleteCategory(category.id)}
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
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <p className="px-4 py-8 text-sm text-muted-foreground">
                            {t('admin.mangaCategories.empty')}
                        </p>
                    )}
                </div>

                <Form
                    {...MangaCategoryController.store.form()}
                    options={{ preserveScroll: true }}
                    resetOnSuccess
                    className="space-y-4 border border-border p-4 md:p-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                                {t('admin.mangaCategories.create')}
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">
                                        {t('admin.mangaCategories.slug')}
                                    </Label>
                                    <Input id="slug" name="slug" required />
                                    <p className="text-xs text-muted-foreground">
                                        {t('admin.mangaCategories.slugHint')}
                                    </p>
                                    <InputError message={errors.slug} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="sort_order">
                                        {t('admin.mangaCategories.sortOrder')}
                                    </Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        name="sort_order"
                                        min={0}
                                        defaultValue={nextSortOrder}
                                    />
                                    <InputError message={errors.sort_order} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {locales.map((locale) => (
                                    <div key={locale} className="grid gap-2">
                                        <Label htmlFor={`name-${locale}`}>
                                            {t(
                                                'admin.mangaCategories.fieldName',
                                            )}{' '}
                                            ({localeLabels[locale] ?? locale})
                                        </Label>
                                        <Input
                                            id={`name-${locale}`}
                                            name={`translations[${locale}][name]`}
                                            defaultValue={
                                                translations[locale]?.name ?? ''
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
                                    </div>
                                ))}
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                {t('admin.mangaCategories.create')}
                            </Button>
                        </>
                    )}
                </Form>
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
