import { useTranslation } from 'react-i18next';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { localeLabels } from '@/lib/locale-labels';
import { cn } from '@/lib/utils';

export type MangaEpisodeTranslationFields = {
    title: string;
    description: string;
};

export type MangaCategoryOption = {
    id: number;
    slug: string;
    name: string;
};

type Props = {
    locales: string[];
    translations: Record<string, MangaEpisodeTranslationFields>;
    categories: MangaCategoryOption[];
    categoryId: number | null;
    slug?: string;
    isPublished?: boolean;
    sortOrder?: number;
    processing: boolean;
    errors: Record<string, string>;
    submitLabel: string;
};

const selectClasses =
    'border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm';

export function AdminMangaFormFields({
    locales,
    translations,
    categories,
    categoryId,
    slug = '',
    isPublished = false,
    sortOrder = 0,
    processing,
    errors,
    submitLabel,
}: Props) {
    const { t } = useTranslation();

    return (
        <>
            <section className="space-y-4 border border-border p-4 md:p-5">
                <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                    {t('admin.manga.metaSection')}
                </h2>

                <div className="grid gap-2">
                    <Label htmlFor="manga_category_id">
                        {t('admin.manga.category')}
                    </Label>
                    <select
                        id="manga_category_id"
                        name="manga_category_id"
                        defaultValue={categoryId ?? ''}
                        className={cn(selectClasses, 'max-w-sm')}
                        required
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.manga_category_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="slug">{t('admin.manga.slug')}</Label>
                    <Input
                        id="slug"
                        name="slug"
                        defaultValue={slug}
                        required
                        className="max-w-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                        {t('admin.manga.slugHint')}
                    </p>
                    <InputError message={errors.slug} />
                </div>

                <div className="flex items-center gap-3">
                    <input type="hidden" name="is_published" value="0" />
                    <input
                        id="is_published"
                        type="checkbox"
                        name="is_published"
                        value="1"
                        defaultChecked={isPublished}
                        className="size-4 rounded border-border"
                    />
                    <Label htmlFor="is_published">
                        {t('admin.manga.published')}
                    </Label>
                </div>
                <InputError message={errors.is_published} />

                <div className="grid gap-2">
                    <Label htmlFor="sort_order">
                        {t('admin.manga.sortOrder')}
                    </Label>
                    <Input
                        id="sort_order"
                        type="number"
                        name="sort_order"
                        min={0}
                        defaultValue={sortOrder}
                        className="max-w-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                        {t('admin.manga.sortOrderHint')}
                    </p>
                    <InputError message={errors.sort_order} />
                </div>
            </section>

            <section className="space-y-4 border border-border p-4 md:p-5">
                <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                    {t('admin.manga.contentSection')}
                </h2>

                {locales.map((locale) => (
                    <div
                        key={locale}
                        className="space-y-4 border border-border p-4"
                    >
                        <h3 className="text-sm font-medium text-ink">
                            {localeLabels[locale] ?? locale}
                        </h3>
                        <div className="grid gap-2">
                            <Label htmlFor={`title-${locale}`}>
                                {t('admin.manga.fieldTitle')}
                            </Label>
                            <Input
                                id={`title-${locale}`}
                                name={`translations[${locale}][title]`}
                                defaultValue={translations[locale]?.title ?? ''}
                                required
                            />
                            <InputError
                                message={errors[`translations.${locale}.title`]}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor={`description-${locale}`}>
                                {t('admin.manga.fieldDescription')}
                            </Label>
                            <Textarea
                                id={`description-${locale}`}
                                name={`translations[${locale}][description]`}
                                defaultValue={
                                    translations[locale]?.description ?? ''
                                }
                                rows={3}
                            />
                            <InputError
                                message={
                                    errors[`translations.${locale}.description`]
                                }
                            />
                        </div>
                    </div>
                ))}
            </section>

            <Button type="submit" disabled={processing}>
                {processing && <Spinner />}
                {submitLabel}
            </Button>
        </>
    );
}
