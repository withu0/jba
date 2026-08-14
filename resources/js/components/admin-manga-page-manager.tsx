import { Form, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MangaPageController from '@/actions/App/Http/Controllers/Admin/MangaPageController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit as episodeEdit } from '@/routes/admin/manga';

export type MangaPageRow = {
    id: number;
    locale: string;
    sort_order: number;
    image_url: string | null;
};

type Props = {
    episodeId: number;
    locale: string;
    locales: string[];
    pages: MangaPageRow[];
    nextSortOrder: number;
};

export function AdminMangaPageManager({
    episodeId,
    locale,
    locales,
    pages,
    nextSortOrder,
}: Props) {
    const { t } = useTranslation();

    const deletePage = (id: number) => {
        if (!confirm(t('admin.manga.deleteConfirm'))) {
            return;
        }

        router.delete(MangaPageController.destroy.url(id));
    };

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                    {t('admin.manga.pagesSection')}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t('admin.manga.pagesLead')}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                    {t('admin.manga.zhFallback')}
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {locales.map((item) => (
                    <Button
                        key={item}
                        type="button"
                        size="sm"
                        variant={item === locale ? 'default' : 'outline'}
                        asChild
                    >
                        <Link
                            href={episodeEdit.url(episodeId, {
                                query: { locale: item },
                            })}
                        >
                            {t(`admin.manga.locales.${item}`)}
                        </Link>
                    </Button>
                ))}
            </div>

            <Form
                {...MangaPageController.store.form(episodeId)}
                options={{ preserveScroll: true, forceFormData: true }}
                className="space-y-4 border border-border p-4"
            >
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="locale" value={locale} />
                        <div>
                            <h3 className="text-sm font-medium text-ink">
                                {t('admin.manga.uploadTitle')}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {t('admin.manga.uploadLead', {
                                    locale: t(`admin.manga.locales.${locale}`),
                                })}
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="image">
                                    {t('admin.manga.image')}
                                </Label>
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t('admin.manga.imageHint')}
                                </p>
                                <InputError message={errors.image} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sort_order">
                                    {t('admin.manga.pageSortOrder')}
                                </Label>
                                <Input
                                    id="sort_order"
                                    name="sort_order"
                                    type="number"
                                    min={0}
                                    max={9999}
                                    defaultValue={nextSortOrder}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t('admin.manga.pageSortOrderHint')}
                                </p>
                                <InputError message={errors.sort_order} />
                            </div>
                        </div>
                        <Button type="submit" disabled={processing}>
                            {t('admin.manga.upload')}
                        </Button>
                    </>
                )}
            </Form>

            <div className="divide-y divide-border border border-border">
                {pages.map((page, index) => (
                    <div
                        key={page.id}
                        className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                            {page.image_url && (
                                <img
                                    src={page.image_url}
                                    alt=""
                                    className="h-20 w-16 shrink-0 object-cover"
                                />
                            )}
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-ink">
                                    {t('admin.manga.pageLabel', {
                                        n: index + 1,
                                    })}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {t('admin.manga.pageSortOrder')}:{' '}
                                    {page.sort_order}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={index === 0}
                                onClick={() =>
                                    router.post(
                                        MangaPageController.moveUp.url(page.id),
                                    )
                                }
                            >
                                {t('admin.manga.moveUp')}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={index === pages.length - 1}
                                onClick={() =>
                                    router.post(
                                        MangaPageController.moveDown.url(
                                            page.id,
                                        ),
                                    )
                                }
                            >
                                {t('admin.manga.moveDown')}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => deletePage(page.id)}
                            >
                                {t('admin.manga.delete')}
                            </Button>
                        </div>
                    </div>
                ))}

                {pages.length === 0 && (
                    <p className="px-4 py-8 text-sm text-muted-foreground">
                        {t('admin.manga.emptyPages')}
                    </p>
                )}
            </div>
        </section>
    );
}
