import { Form, Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LessonCategoryController from '@/actions/App/Http/Controllers/Admin/LessonCategoryController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { localeLabels } from '@/lib/locale-labels';
import { dashboard } from '@/routes/admin';
import {
    edit as categoryEdit,
    index as categoriesIndex,
} from '@/routes/admin/lesson-categories';
import { index as lessonsIndex } from '@/routes/admin/lessons';

type CategoryNameFields = {
    name: string;
};

type CategoryRow = {
    id: number;
    slug: string;
    sort_order: number;
    lessons_count: number;
    name: string;
};

type Props = {
    categories: CategoryRow[];
    locales: string[];
    translations: Record<string, CategoryNameFields>;
    nextSortOrder: number;
};

export default function AdminLessonCategoriesIndex({
    categories,
    locales,
    translations,
    nextSortOrder,
}: Props) {
    const { t } = useTranslation();

    const deleteCategory = (id: number) => {
        if (!window.confirm(t('admin.lessonCategories.deleteConfirm'))) {
            return;
        }

        router.delete(LessonCategoryController.destroy.url(id));
    };

    return (
        <>
            <Head title={t('admin.lessonCategories.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.lessonCategories.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.lessonCategories.lead')}
                        </p>
                    </div>
                    <Link
                        href={lessonsIndex()}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {t('admin.lessonCategories.backToLessons')}
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
                                    {t(
                                        'admin.lessonCategories.sortOrder',
                                    )}: {category.sort_order}
                                    {' · '}
                                    {t('admin.lessonCategories.lessonsCount', {
                                        count: category.lessons_count,
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
                                            LessonCategoryController.moveUp.url(
                                                category.id,
                                            ),
                                        )
                                    }
                                >
                                    {t('admin.lessonCategories.moveUp')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={index === categories.length - 1}
                                    onClick={() =>
                                        router.post(
                                            LessonCategoryController.moveDown.url(
                                                category.id,
                                            ),
                                        )
                                    }
                                >
                                    {t('admin.lessonCategories.moveDown')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={category.lessons_count > 0}
                                    onClick={() => deleteCategory(category.id)}
                                >
                                    {t('common.delete')}
                                </Button>
                                <Link
                                    href={categoryEdit.url(category.id)}
                                    className="px-2 text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                                >
                                    {t('admin.lessonCategories.edit')}
                                </Link>
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <p className="px-4 py-8 text-sm text-muted-foreground">
                            {t('admin.lessonCategories.empty')}
                        </p>
                    )}
                </div>

                <Form
                    {...LessonCategoryController.store.form()}
                    options={{ preserveScroll: true }}
                    resetOnSuccess
                    className="space-y-4 border border-border p-4 md:p-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                                {t('admin.lessonCategories.create')}
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">
                                        {t('admin.lessonCategories.slug')}
                                    </Label>
                                    <Input id="slug" name="slug" required />
                                    <p className="text-xs text-muted-foreground">
                                        {t('admin.lessonCategories.slugHint')}
                                    </p>
                                    <InputError message={errors.slug} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="sort_order">
                                        {t('admin.lessonCategories.sortOrder')}
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
                                                'admin.lessonCategories.fieldName',
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
                                {t('admin.lessonCategories.create')}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminLessonCategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.lessons', href: lessonsIndex() },
        { title: 'admin.nav.lessonCategories', href: categoriesIndex() },
    ],
};
