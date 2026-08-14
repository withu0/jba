import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

export type PostTranslationFields = {
    slug: string;
    title: string;
    excerpt: string;
    body: string;
};

type Props = {
    locales: string[];
    translations: Record<string, PostTranslationFields>;
    isPublished?: boolean;
    publishedAt?: string;
    featuredImageUrl?: string | null;
    processing: boolean;
    errors: Record<string, string>;
    submitLabel: string;
};

const localeLabels: Record<string, string> = {
    ja: '日本語',
    en: 'English',
    zh: '中文',
};

export function AdminPostFormFields({
    locales,
    translations,
    isPublished = false,
    publishedAt = '',
    featuredImageUrl = null,
    processing,
    errors,
    submitLabel,
}: Props) {
    const { t } = useTranslation();

    return (
        <>
            <section className="space-y-4 border border-border p-4 md:p-5">
                <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                    {t('admin.posts.publishSection')}
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
                        {t('admin.posts.published')}
                    </Label>
                </div>
                <InputError message={errors.is_published} />

                <div className="grid gap-2">
                    <Label htmlFor="published_at">
                        {t('admin.posts.publishedAt')}
                    </Label>
                    <Input
                        id="published_at"
                        type="datetime-local"
                        name="published_at"
                        defaultValue={publishedAt}
                        className="max-w-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                        {t('admin.posts.publishedAtHint')}
                    </p>
                    <InputError message={errors.published_at} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="featured_image">
                        {t('admin.posts.featuredImage')}
                    </Label>
                    {featuredImageUrl && (
                        <div className="mb-2 flex items-start gap-4">
                            <img
                                src={featuredImageUrl}
                                alt=""
                                className="h-24 w-36 object-cover"
                            />
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input
                                    type="checkbox"
                                    name="remove_featured_image"
                                    value="1"
                                    className="size-4 rounded border-border"
                                />
                                {t('admin.posts.removeImage')}
                            </label>
                        </div>
                    )}
                    <Input
                        id="featured_image"
                        type="file"
                        name="featured_image"
                        accept="image/*"
                        className="max-w-md"
                    />
                    <p className="text-xs text-muted-foreground">
                        {t('admin.posts.featuredImageHint')}
                    </p>
                    <InputError message={errors.featured_image} />
                </div>
            </section>

            {locales.map((locale) => {
                const fields = translations[locale] ?? {
                    slug: '',
                    title: '',
                    excerpt: '',
                    body: '',
                };

                return (
                    <section
                        key={locale}
                        className="space-y-4 border border-border p-4 md:p-5"
                    >
                        <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                            {localeLabels[locale] ?? locale}
                        </h2>

                        <div className="grid gap-2">
                            <Label htmlFor={`slug-${locale}`}>
                                {t('admin.posts.fieldSlug')}
                            </Label>
                            <Input
                                id={`slug-${locale}`}
                                name={`translations[${locale}][slug]`}
                                defaultValue={fields.slug}
                                required
                            />
                            <InputError
                                message={errors[`translations.${locale}.slug`]}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`title-${locale}`}>
                                {t('admin.posts.fieldTitle')}
                            </Label>
                            <Input
                                id={`title-${locale}`}
                                name={`translations[${locale}][title]`}
                                defaultValue={fields.title}
                                required
                            />
                            <InputError
                                message={errors[`translations.${locale}.title`]}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`excerpt-${locale}`}>
                                {t('admin.posts.fieldExcerpt')}
                            </Label>
                            <Textarea
                                id={`excerpt-${locale}`}
                                name={`translations[${locale}][excerpt]`}
                                defaultValue={fields.excerpt}
                                rows={3}
                            />
                            <InputError
                                message={
                                    errors[`translations.${locale}.excerpt`]
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`body-${locale}`}>
                                {t('admin.posts.fieldBody')}
                            </Label>
                            <Textarea
                                id={`body-${locale}`}
                                name={`translations[${locale}][body]`}
                                defaultValue={fields.body}
                                rows={10}
                                className="min-h-40"
                            />
                            <p className="text-xs text-muted-foreground">
                                {t('admin.posts.bodyHint')}
                            </p>
                            <InputError
                                message={errors[`translations.${locale}.body`]}
                            />
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
