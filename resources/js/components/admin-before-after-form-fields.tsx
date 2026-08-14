import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { localeLabels } from '@/lib/locale-labels';
import { useTranslation } from 'react-i18next';

export type BeforeAfterTranslationFields = {
    title: string;
    caption: string;
};

type Props = {
    locales: string[];
    translations: Record<string, BeforeAfterTranslationFields>;
    isPublished?: boolean;
    sortOrder?: number;
    beforeImageUrl?: string | null;
    afterImageUrl?: string | null;
    processing: boolean;
    errors: Record<string, string>;
    submitLabel: string;
    requireImages?: boolean;
};

export function AdminBeforeAfterFormFields({
    locales,
    translations,
    isPublished = true,
    sortOrder = 0,
    beforeImageUrl = null,
    afterImageUrl = null,
    processing,
    errors,
    submitLabel,
    requireImages = false,
}: Props) {
    const { t } = useTranslation();

    return (
        <>
            <section className="space-y-4 border border-border p-4 md:p-5">
                <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                    {t('admin.beforeAfter.metaSection')}
                </h2>

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
                        {t('admin.beforeAfter.published')}
                    </Label>
                </div>
                <InputError message={errors.is_published} />

                <div className="grid gap-2">
                    <Label htmlFor="sort_order">
                        {t('admin.beforeAfter.sortOrder')}
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
                        {t('admin.beforeAfter.sortOrderHint')}
                    </p>
                    <InputError message={errors.sort_order} />
                </div>
            </section>

            <section className="space-y-4 border border-border p-4 md:p-5">
                <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                    {t('admin.beforeAfter.imagesSection')}
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="before_image">
                            {t('admin.beforeAfter.beforeImage')}
                        </Label>
                        {beforeImageUrl && (
                            <img
                                src={beforeImageUrl}
                                alt=""
                                className="mb-2 aspect-[4/3] w-full max-w-sm object-cover"
                            />
                        )}
                        <Input
                            id="before_image"
                            type="file"
                            name="before_image"
                            accept="image/*"
                            required={requireImages}
                        />
                        <p className="text-xs text-muted-foreground">
                            {t('admin.beforeAfter.imageHint')}
                        </p>
                        <InputError message={errors.before_image} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="after_image">
                            {t('admin.beforeAfter.afterImage')}
                        </Label>
                        {afterImageUrl && (
                            <img
                                src={afterImageUrl}
                                alt=""
                                className="mb-2 aspect-[4/3] w-full max-w-sm object-cover"
                            />
                        )}
                        <Input
                            id="after_image"
                            type="file"
                            name="after_image"
                            accept="image/*"
                            required={requireImages}
                        />
                        <p className="text-xs text-muted-foreground">
                            {t('admin.beforeAfter.imageHint')}
                        </p>
                        <InputError message={errors.after_image} />
                    </div>
                </div>
            </section>

            {locales.map((locale) => {
                const fields = translations[locale] ?? {
                    title: '',
                    caption: '',
                };
                const titleError = errors[`translations.${locale}.title`];
                const captionError = errors[`translations.${locale}.caption`];

                return (
                    <section
                        key={locale}
                        className="space-y-4 border border-border p-4 md:p-5"
                    >
                        <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                            {localeLabels[locale] ?? locale}
                        </h2>

                        <div className="grid gap-2">
                            <Label htmlFor={`title-${locale}`}>
                                {t('admin.beforeAfter.fieldTitle')}
                            </Label>
                            <Input
                                id={`title-${locale}`}
                                name={`translations[${locale}][title]`}
                                defaultValue={fields.title}
                                required
                            />
                            <InputError message={titleError} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`caption-${locale}`}>
                                {t('admin.beforeAfter.fieldCaption')}
                            </Label>
                            <Textarea
                                id={`caption-${locale}`}
                                name={`translations[${locale}][caption]`}
                                defaultValue={fields.caption}
                                rows={3}
                            />
                            <InputError message={captionError} />
                        </div>
                    </section>
                );
            })}

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing}>
                    {processing && <Spinner />}
                    {submitLabel}
                </Button>
            </div>
        </>
    );
}
