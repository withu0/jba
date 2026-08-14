import { Form, Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LessonController from '@/actions/App/Http/Controllers/Admin/LessonController';
import { AdminLessonFormFields } from '@/components/admin-lesson-form-fields';
import type {
    LessonCategoryOption,
    LessonTranslationFields,
} from '@/components/admin-lesson-form-fields';
import { AdminLessonImageManager } from '@/components/admin-lesson-image-manager';
import type {
    LessonImageCaptionFields,
    LessonImageRow,
} from '@/components/admin-lesson-image-manager';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import { index as lessonsIndex } from '@/routes/admin/lessons';

type Props = {
    lesson: {
        id: number;
        lesson_category_id: number;
        is_published: boolean;
        sort_order: number;
        video_url: string | null;
        video_file_url: string | null;
        translations: Record<string, LessonTranslationFields>;
        images: LessonImageRow[];
    };
    categories: LessonCategoryOption[];
    locales: string[];
    emptyCaptions: Record<string, LessonImageCaptionFields>;
    nextImageSortOrder: number;
};

export default function AdminLessonEdit({
    lesson,
    categories,
    locales,
    emptyCaptions,
    nextImageSortOrder,
}: Props) {
    const { t } = useTranslation();

    const handleDelete = () => {
        if (!window.confirm(t('admin.lessons.deleteConfirm'))) {
            return;
        }

        router.delete(LessonController.destroy.url(lesson.id));
    };

    return (
        <>
            <Head title={t('admin.lessons.editTitle')} />
            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.lessons.editTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.lessons.formLead')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={lessonsIndex()}
                            className="text-sm text-brand-blue underline-offset-4 hover:underline"
                        >
                            {t('admin.lessons.backToList')}
                        </Link>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDelete}
                        >
                            {t('common.delete')}
                        </Button>
                    </div>
                </div>

                <Form
                    {...LessonController.update.form(lesson.id)}
                    options={{ preserveScroll: true, forceFormData: true }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <AdminLessonFormFields
                            locales={locales}
                            translations={lesson.translations}
                            categories={categories}
                            categoryId={lesson.lesson_category_id}
                            isPublished={lesson.is_published}
                            sortOrder={lesson.sort_order}
                            videoFileUrl={lesson.video_file_url}
                            videoUrl={lesson.video_url}
                            processing={processing}
                            errors={errors}
                            submitLabel={t('admin.lessons.save')}
                        />
                    )}
                </Form>

                <AdminLessonImageManager
                    lessonId={lesson.id}
                    images={lesson.images}
                    locales={locales}
                    emptyCaptions={emptyCaptions}
                    nextSortOrder={nextImageSortOrder}
                />
            </div>
        </>
    );
}

AdminLessonEdit.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.lessons', href: lessonsIndex() },
    ],
};
