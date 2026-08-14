import { Form, Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MangaEpisodeController from '@/actions/App/Http/Controllers/Admin/MangaEpisodeController';
import { AdminMangaFormFields } from '@/components/admin-manga-form-fields';
import type {
    MangaCategoryOption,
    MangaEpisodeTranslationFields,
} from '@/components/admin-manga-form-fields';
import { dashboard } from '@/routes/admin';
import { index as mangaIndex } from '@/routes/admin/manga';

type Props = {
    categories: MangaCategoryOption[];
    categoryId: number | null;
    locales: string[];
    translations: Record<string, MangaEpisodeTranslationFields>;
    nextSortOrder: number;
};

export default function AdminMangaCreate({
    categories,
    categoryId,
    locales,
    translations,
    nextSortOrder,
}: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.manga.createTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.manga.createTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.manga.formLead')}
                        </p>
                    </div>
                    <Link
                        href={mangaIndex()}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {t('admin.manga.backToList')}
                    </Link>
                </div>

                <p className="text-xs text-muted-foreground">
                    {t('admin.manga.pagesAfterCreate')}
                </p>

                <Form
                    {...MangaEpisodeController.store.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <AdminMangaFormFields
                            locales={locales}
                            translations={translations}
                            categories={categories}
                            categoryId={categoryId}
                            sortOrder={nextSortOrder}
                            processing={processing}
                            errors={errors}
                            submitLabel={t('admin.manga.create')}
                        />
                    )}
                </Form>
            </div>
        </>
    );
}

AdminMangaCreate.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.manga', href: mangaIndex() },
    ],
};
