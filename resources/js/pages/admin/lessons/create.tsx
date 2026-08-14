import { Form, Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LessonController from '@/actions/App/Http/Controllers/Admin/LessonController';
import { AdminLessonFormFields } from '@/components/admin-lesson-form-fields';
import type {
    LessonCategoryOption,
    LessonTranslationFields,
} from '@/components/admin-lesson-form-fields';
import { dashboard } from '@/routes/admin';
import { index as lessonsIndex } from '@/routes/admin/lessons';

type Props = {
    categories: LessonCategoryOption[];
    categoryId: number | null;
    locales: string[];
    translations: Record<string, LessonTranslationFields>;
    nextSortOrder: number;
};

export default function AdminLessonCreate({
    categories,
    categoryId,
    locales,
    translations,
    nextSortOrder,
}: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.lessons.createTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.lessons.createTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.lessons.formLead')}
                        </p>
                    </div>
                    <Link
                        href={lessonsIndex()}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {t('admin.lessons.backToList')}
                    </Link>
                </div>

                <p className="text-xs text-muted-foreground">
                    {t('admin.lessons.imagesAfterCreate')}
                </p>

                <Form
                    {...LessonController.store.form()}
                    options={{ preserveScroll: true, forceFormData: true }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <AdminLessonFormFields
                            locales={locales}
                            translations={translations}
                            categories={categories}
                            categoryId={categoryId}
                            sortOrder={nextSortOrder}
                            processing={processing}
                            errors={errors}
                            submitLabel={t('admin.lessons.create')}
                        />
                    )}
                </Form>
            </div>
        </>
    );
}

AdminLessonCreate.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.lessons', href: lessonsIndex() },
    ],
};
