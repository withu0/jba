import { Head, Link, router } from '@inertiajs/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MangaEpisodeController from '@/actions/App/Http/Controllers/Admin/MangaEpisodeController';
import { AdminSortableList } from '@/components/admin-sortable-list';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import {
    create as episodeCreate,
    edit as episodeEdit,
    index as mangaIndex,
} from '@/routes/admin/manga';
import { index as mangaCategoriesIndex } from '@/routes/admin/manga-categories';

type EpisodeRow = {
    id: number;
    manga_category_id: number;
    category_name: string;
    slug: string;
    is_published: boolean;
    sort_order: number;
    pages_count: number;
    title: string;
};

type CategoryOption = {
    id: number;
    slug: string;
    name: string;
};

type Props = {
    episodes: EpisodeRow[];
    categories: CategoryOption[];
    categoryId: number | null;
};

export default function AdminMangaIndex({
    episodes,
    categories,
    categoryId,
}: Props) {
    const { t } = useTranslation();

    const groups = useMemo(() => {
        const map = new Map<number, EpisodeRow[]>();

        for (const episode of episodes) {
            const list = map.get(episode.manga_category_id) ?? [];
            list.push(episode);
            map.set(episode.manga_category_id, list);
        }

        return Array.from(map.entries()).map(([id, items]) => ({
            id,
            name: items[0]?.category_name ?? '',
            items,
        }));
    }, [episodes]);

    return (
        <>
            <Head title={t('admin.manga.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.manga.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.manga.lead')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={mangaCategoriesIndex()}
                            className="text-sm text-brand-blue underline-offset-4 hover:underline"
                        >
                            {t('admin.manga.manageCategories')}
                        </Link>
                        <Button asChild disabled={categories.length === 0}>
                            <Link
                                href={episodeCreate.url(
                                    categoryId
                                        ? { query: { category: categoryId } }
                                        : {},
                                )}
                            >
                                {t('admin.manga.create')}
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
                        <Link href={mangaIndex.url()}>
                            {t('admin.manga.allCategories')}
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
                                href={mangaIndex.url({
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
                                            <col className="w-40" />
                                            <col className="w-28" />
                                            <col className="w-32" />
                                            <col className="w-24" />
                                        </>
                                    }
                                    header={
                                        <>
                                            <th className="px-4 py-3 font-medium">
                                                {t('admin.table.title')}
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                {t('admin.table.slug')}
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                {t('admin.table.status')}
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                {t('admin.table.pages')}
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                {t('admin.table.actions')}
                                            </th>
                                        </>
                                    }
                                    onReorder={(ids) =>
                                        router.post(
                                            MangaEpisodeController.reorder.url(
                                                group.items[0].id,
                                            ),
                                            { ids },
                                            { preserveScroll: true },
                                        )
                                    }
                                    renderItem={(episode) => (
                                        <>
                                            <td className="truncate px-4 py-3 font-medium text-ink">
                                                {episode.title}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {episode.slug}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {episode.is_published
                                                    ? t(
                                                          'admin.manga.statusPublished',
                                                      )
                                                    : t(
                                                          'admin.manga.statusDraft',
                                                      )}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {t('admin.manga.pagesCount', {
                                                    count: episode.pages_count,
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={episodeEdit.url(
                                                        episode.id,
                                                    )}
                                                    className="text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                                                >
                                                    {t('admin.manga.edit')}
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
                        {t('admin.manga.empty')}
                    </p>
                )}
            </div>
        </>
    );
}

AdminMangaIndex.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.manga', href: mangaIndex() },
    ],
};
