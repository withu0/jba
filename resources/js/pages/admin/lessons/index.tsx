import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LessonController from '@/actions/App/Http/Controllers/Admin/LessonController';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import { index as lessonCategoriesIndex } from '@/routes/admin/lesson-categories';
import {
    create as lessonCreate,
    edit as lessonEdit,
    index as lessonsIndex,
} from '@/routes/admin/lessons';

type LessonRow = {
    id: number;
    lesson_category_id: number;
    category_name: string;
    is_published: boolean;
    sort_order: number;
    images_count: number;
    has_video: boolean;
    title: string;
};

type CategoryOption = {
    id: number;
    slug: string;
    name: string;
};

type Props = {
    lessons: LessonRow[];
    categories: CategoryOption[];
    categoryId: number | null;
};

export default function AdminLessonsIndex({
    lessons,
    categories,
    categoryId,
}: Props) {
    const { t } = useTranslation();

    // Move buttons reorder within a category, so the neighbours that matter are
    // the rows sharing this row's category rather than the whole list.
    const isFirstInCategory = (index: number) =>
        index === 0 ||
        lessons[index - 1].lesson_category_id !==
            lessons[index].lesson_category_id;

    const isLastInCategory = (index: number) =>
        index === lessons.length - 1 ||
        lessons[index + 1].lesson_category_id !==
            lessons[index].lesson_category_id;

    return (
        <>
            <Head title={t('admin.lessons.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.lessons.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.lessons.lead')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={lessonCategoriesIndex()}
                            className="text-sm text-brand-blue underline-offset-4 hover:underline"
                        >
                            {t('admin.lessons.manageCategories')}
                        </Link>
                        <Button asChild disabled={categories.length === 0}>
                            <Link
                                href={lessonCreate.url(
                                    categoryId
                                        ? { query: { category: categoryId } }
                                        : {},
                                )}
                            >
                                {t('admin.lessons.create')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant={categoryId === null ? 'default' : 'outline'}
                        asChild
                    >
                        <Link href={lessonsIndex.url()}>
                            {t('admin.lessons.allCategories')}
                        </Link>
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            type="button"
                            size="sm"
                            variant={
                                categoryId === category.id
                                    ? 'default'
                                    : 'outline'
                            }
                            asChild
                        >
                            <Link
                                href={lessonsIndex.url({
                                    query: { category: category.id },
                                })}
                            >
                                {category.name}
                            </Link>
                        </Button>
                    ))}
                </div>

                <div className="divide-y divide-border border border-border">
                    {lessons.map((lesson, index) => (
                        <div
                            key={lesson.id}
                            className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-ink">
                                    {lesson.title}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {lesson.category_name}
                                    {' · '}
                                    {lesson.is_published
                                        ? t('admin.lessons.statusPublished')
                                        : t('admin.lessons.statusDraft')}
                                    {' · '}
                                    {t('admin.lessons.sortOrder')}:{' '}
                                    {lesson.sort_order}
                                    {' · '}
                                    {t('admin.lessons.imagesCount', {
                                        count: lesson.images_count,
                                    })}
                                    {' · '}
                                    {lesson.has_video
                                        ? t('admin.lessons.hasVideo')
                                        : t('admin.lessons.noVideo')}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isFirstInCategory(index)}
                                    onClick={() =>
                                        router.post(
                                            LessonController.moveUp.url(
                                                lesson.id,
                                            ),
                                        )
                                    }
                                >
                                    {t('admin.lessons.moveUp')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isLastInCategory(index)}
                                    onClick={() =>
                                        router.post(
                                            LessonController.moveDown.url(
                                                lesson.id,
                                            ),
                                        )
                                    }
                                >
                                    {t('admin.lessons.moveDown')}
                                </Button>
                                <Link
                                    href={lessonEdit.url(lesson.id)}
                                    className="px-2 text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                                >
                                    {t('admin.lessons.edit')}
                                </Link>
                            </div>
                        </div>
                    ))}

                    {lessons.length === 0 && (
                        <p className="px-4 py-8 text-sm text-muted-foreground">
                            {t('admin.lessons.empty')}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

AdminLessonsIndex.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.lessons', href: lessonsIndex() },
    ],
};
