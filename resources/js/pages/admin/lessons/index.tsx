import { Head, Link, router } from '@inertiajs/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LessonController from '@/actions/App/Http/Controllers/Admin/LessonController';
import { AdminSortableList } from '@/components/admin-sortable-list';
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

    const groups = useMemo(() => {
        const map = new Map<number, LessonRow[]>();

        for (const lesson of lessons) {
            const list = map.get(lesson.lesson_category_id) ?? [];
            list.push(lesson);
            map.set(lesson.lesson_category_id, list);
        }

        return Array.from(map.entries()).map(([id, items]) => ({
            id,
            name: items[0]?.category_name ?? '',
            items,
        }));
    }, [lessons]);

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

                {groups.length > 0 ? (
                    <div className="space-y-8">
                        {groups.map((group) => (
                            <div key={group.id} className="space-y-3">
                                {categoryId === null && (
                                    <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                        {group.name}
                                    </h2>
                                )}
                                <AdminSortableList
                                    items={group.items}
                                    colgroup={
                                        <>
                                            <col />
                                            <col className="w-28" />
                                            <col className="w-32" />
                                            <col className="w-40" />
                                            <col className="w-24" />
                                        </>
                                    }
                                    header={
                                        <>
                                            <th className="px-4 py-3 font-medium">
                                                {t('admin.table.title')}
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                {t('admin.table.status')}
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                {t('admin.table.video')}
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                {t('admin.table.images')}
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                {t('admin.table.actions')}
                                            </th>
                                        </>
                                    }
                                    onReorder={(ids) =>
                                        router.post(
                                            LessonController.reorder.url(
                                                group.items[0].id,
                                            ),
                                            { ids },
                                            { preserveScroll: true },
                                        )
                                    }
                                    renderItem={(lesson) => (
                                        <>
                                            <td className="truncate px-4 py-3 font-medium text-ink">
                                                {lesson.title}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                                {lesson.is_published
                                                    ? t(
                                                          'admin.lessons.statusPublished',
                                                      )
                                                    : t(
                                                          'admin.lessons.statusDraft',
                                                      )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                                {lesson.has_video
                                                    ? t('admin.lessons.hasVideo')
                                                    : t('admin.lessons.noVideo')}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                                {t('admin.lessons.imagesCount', {
                                                    count: lesson.images_count,
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={lessonEdit.url(
                                                        lesson.id,
                                                    )}
                                                    className="text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                                                >
                                                    {t('admin.lessons.edit')}
                                                </Link>
                                            </td>
                                        </>
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="border border-border px-4 py-8 text-sm text-muted-foreground">
                        {t('admin.lessons.empty')}
                    </p>
                )}
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
