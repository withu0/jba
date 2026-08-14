import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MangaEpisodeController from '@/actions/App/Http/Controllers/Admin/MangaEpisodeController';
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

    const isFirstInCategory = (index: number) =>
        index === 0 ||
        episodes[index - 1].manga_category_id !==
            episodes[index].manga_category_id;

    const isLastInCategory = (index: number) =>
        index === episodes.length - 1 ||
        episodes[index + 1].manga_category_id !==
            episodes[index].manga_category_id;

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

                <div className="divide-y divide-border border border-border">
                    {episodes.map((episode, index) => (
                        <div
                            key={episode.id}
                            className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-ink">
                                    {episode.title}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {episode.category_name}
                                    {' · '}
                                    {episode.slug}
                                    {' · '}
                                    {episode.is_published
                                        ? t('admin.manga.statusPublished')
                                        : t('admin.manga.statusDraft')}
                                    {' · '}
                                    {t('admin.manga.sortOrder')}:{' '}
                                    {episode.sort_order}
                                    {' · '}
                                    {t('admin.manga.pagesCount', {
                                        count: episode.pages_count,
                                    })}
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
                                            MangaEpisodeController.moveUp.url(
                                                episode.id,
                                            ),
                                        )
                                    }
                                >
                                    {t('admin.manga.moveUp')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isLastInCategory(index)}
                                    onClick={() =>
                                        router.post(
                                            MangaEpisodeController.moveDown.url(
                                                episode.id,
                                            ),
                                        )
                                    }
                                >
                                    {t('admin.manga.moveDown')}
                                </Button>
                                <Link
                                    href={episodeEdit.url(episode.id)}
                                    className="px-2 text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                                >
                                    {t('admin.manga.edit')}
                                </Link>
                            </div>
                        </div>
                    ))}

                    {episodes.length === 0 && (
                        <p className="px-4 py-8 text-sm text-muted-foreground">
                            {t('admin.manga.empty')}
                        </p>
                    )}
                </div>
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
