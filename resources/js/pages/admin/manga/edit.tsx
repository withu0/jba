import { Form, Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MangaEpisodeController from '@/actions/App/Http/Controllers/Admin/MangaEpisodeController';
import { AdminMangaFormFields } from '@/components/admin-manga-form-fields';
import type {
    MangaCategoryOption,
    MangaEpisodeTranslationFields,
} from '@/components/admin-manga-form-fields';
import { AdminMangaPageManager } from '@/components/admin-manga-page-manager';
import type { MangaPageRow } from '@/components/admin-manga-page-manager';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import { index as mangaIndex } from '@/routes/admin/manga';

type Props = {
    episode: {
        id: number;
        manga_category_id: number;
        slug: string;
        is_published: boolean;
        sort_order: number;
        translations: Record<string, MangaEpisodeTranslationFields>;
    };
    categories: MangaCategoryOption[];
    locales: string[];
    locale: string;
    pages: MangaPageRow[];
    nextPageSortOrder: number;
};

export default function AdminMangaEdit({
    episode,
    categories,
    locales,
    locale,
    pages,
    nextPageSortOrder,
}: Props) {
    const { t } = useTranslation();

    const handleDelete = () => {
        if (!window.confirm(t('admin.manga.deleteEpisodeConfirm'))) {
            return;
        }

        router.delete(MangaEpisodeController.destroy.url(episode.id));
    };

    return (
        <>
            <Head title={t('admin.manga.editTitle')} />
            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.manga.editTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.manga.formLead')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={mangaIndex()}
                            className="text-sm text-brand-blue underline-offset-4 hover:underline"
                        >
                            {t('admin.manga.backToList')}
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
                    {...MangaEpisodeController.update.form(episode.id)}
                    options={{ preserveScroll: true }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <AdminMangaFormFields
                            locales={locales}
                            translations={episode.translations}
                            categories={categories}
                            categoryId={episode.manga_category_id}
                            slug={episode.slug}
                            isPublished={episode.is_published}
                            sortOrder={episode.sort_order}
                            processing={processing}
                            errors={errors}
                            submitLabel={t('admin.manga.save')}
                        />
                    )}
                </Form>

                <AdminMangaPageManager
                    episodeId={episode.id}
                    locale={locale}
                    locales={locales}
                    pages={pages}
                    nextSortOrder={nextPageSortOrder}
                />
            </div>
        </>
    );
}

AdminMangaEdit.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.manga', href: mangaIndex() },
    ],
};
