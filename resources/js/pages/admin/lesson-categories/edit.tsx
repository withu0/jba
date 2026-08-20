import { Form, Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LessonCategoryController from '@/actions/App/Http/Controllers/Admin/LessonCategoryController';
import { AdminField, AdminFieldGrid } from '@/components/admin-form-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { localeLabels } from '@/lib/locale-labels';
import { dashboard } from '@/routes/admin';
import { index as categoriesIndex } from '@/routes/admin/lesson-categories';
import { index as lessonsIndex } from '@/routes/admin/lessons';

type CategoryNameFields = {
    name: string;
};

type Props = {
    category: {
        id: number;
        slug: string;
        sort_order: number;
        translations: Record<string, CategoryNameFields>;
    };
    locales: string[];
};

export default function AdminLessonCategoryEdit({ category, locales }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.lessonCategories.editTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.lessonCategories.editTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.lessonCategories.formLead')}
                        </p>
                    </div>
                    <Link
                        href={categoriesIndex()}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {t('admin.lessonCategories.backToList')}
                    </Link>
                </div>

                <Form
                    {...LessonCategoryController.update.form(category.id)}
                    options={{ preserveScroll: true }}
                    className="space-y-4 border border-border p-4 md:p-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <AdminFieldGrid>
                                <AdminField>
                                    <Label htmlFor="slug">
                                        {t('admin.lessonCategories.slug')}
                                    </Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        defaultValue={category.slug}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t('admin.lessonCategories.slugHint')}
                                    </p>
                                    <InputError message={errors.slug} />
                                </AdminField>
                                <AdminField>
                                    <Label htmlFor="sort_order">
                                        {t('admin.lessonCategories.sortOrder')}
                                    </Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        name="sort_order"
                                        min={0}
                                        defaultValue={category.sort_order}
                                    />
                                    <InputError message={errors.sort_order} />
                                </AdminField>
                            </AdminFieldGrid>

                            <AdminFieldGrid columns={3}>
                                {locales.map((locale) => (
                                    <AdminField key={locale}>
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
                                                category.translations[locale]
                                                    ?.name ?? ''
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

                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                {t('admin.lessonCategories.save')}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminLessonCategoryEdit.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.lessons', href: lessonsIndex() },
        { title: 'admin.nav.lessonCategories', href: categoriesIndex() },
    ],
};
