import { useTranslation } from 'react-i18next';
import { AdminField, AdminFieldGrid } from '@/components/admin-form-layout';
import { FileDropzone } from '@/components/file-dropzone';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { localeLabels } from '@/lib/locale-labels';

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
    const defaultLocale = locales[0] ?? 'ja';

    return (
        <>
            <section className="space-y-4 border border-border p-4 md:p-5">
                <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                    {t('admin.beforeAfter.metaSection')}
                </h2>

                <AdminFieldGrid>
                    <div className="flex items-center gap-3 self-start">
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

                    <AdminField>
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
                    </AdminField>
                </AdminFieldGrid>
                <InputError message={errors.is_published} />
            </section>

            <section className="space-y-4 border border-border p-4 md:p-5">
                <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                    {t('admin.beforeAfter.imagesSection')}
                </h2>

                <AdminFieldGrid>
                    <AdminField>
                        <Label htmlFor="before_image">
                            {t('admin.beforeAfter.beforeImage')}
                        </Label>
                        <FileDropzone
                            id="before_image"
                            name="before_image"
                            accept="image/*"
                            required={requireImages}
                            existingUrl={beforeImageUrl}
                            hint={t('admin.beforeAfter.imageHint')}
                        />
                        <InputError message={errors.before_image} />
                    </AdminField>

                    <AdminField>
                        <Label htmlFor="after_image">
                            {t('admin.beforeAfter.afterImage')}
                        </Label>
                        <FileDropzone
                            id="after_image"
                            name="after_image"
                            accept="image/*"
                            required={requireImages}
                            existingUrl={afterImageUrl}
                            hint={t('admin.beforeAfter.imageHint')}
                        />
                        <InputError message={errors.after_image} />
                    </AdminField>
                </AdminFieldGrid>
            </section>

            <section className="space-y-4 border border-border p-4 md:p-5">
                <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                    {t('admin.beforeAfter.contentSection')}
                </h2>

                <Tabs defaultValue={defaultLocale}>
                    <TabsList>
                        {locales.map((locale) => (
                            <TabsTrigger key={locale} value={locale}>
                                {localeLabels[locale] ?? locale}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {locales.map((locale) => {
                        const fields = translations[locale] ?? {
                            title: '',
                            caption: '',
                        };
                        const titleError =
                            errors[`translations.${locale}.title`];
                        const captionError =
                            errors[`translations.${locale}.caption`];

                        return (
                            <TabsContent key={locale} value={locale}>
                                <AdminField>
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
                                </AdminField>

                                <AdminField>
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
                                </AdminField>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </section>

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing}>
                    {processing && <Spinner />}
                    {submitLabel}
                </Button>
            </div>
        </>
    );
}
