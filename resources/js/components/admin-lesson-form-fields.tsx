import { useTranslation } from 'react-i18next';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { localeLabels } from '@/lib/locale-labels';
import { cn } from '@/lib/utils';

export type LessonTranslationFields = {
    title: string;
    body: string;
};

export type LessonCategoryOption = {
    id: number;
    slug: string;
    name: string;
};

type Props = {
    locales: string[];
    translations: Record<string, LessonTranslationFields>;
    categories: LessonCategoryOption[];
    categoryId: number | null;
    isPublished?: boolean;
    sortOrder?: number;
    videoFileUrl?: string | null;
    videoUrl?: string | null;
    processing: boolean;
    errors: Record<string, string>;
    submitLabel: string;
};

const selectClasses =
    'border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm';

export function AdminLessonFormFields({
    locales,
    translations,
    categories,
    categoryId,
    isPublished = false,
    sortOrder = 0,
    videoFileUrl = null,
    videoUrl = null,
    processing,
    errors,
    submitLabel,
}: Props) {
    const { t } = useTranslation();

    return (
        <>
            <section className="space-y-4 border border-border p-4 md:p-5">
                <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                    {t('admin.lessons.metaSection')}
                </h2>

                <div className="grid gap-2">
                    <Label htmlFor="lesson_category_id">
                        {t('admin.lessons.category')}
                    </Label>
                    <select
                        id="lesson_category_id"
                        name="lesson_category_id"
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
                    <InputError message={errors.lesson_category_id} />
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
                        {t('admin.lessons.published')}
                    </Label>
                </div>
                <InputError message={errors.is_published} />

                <div className="grid gap-2">
                    <Label htmlFor="sort_order">
                        {t('admin.lessons.sortOrder')}
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
                        {t('admin.lessons.sortOrderHint')}
                    </p>
                    <InputError message={errors.sort_order} />
                </div>
            </section>

            <section className="space-y-4 border border-border p-4 md:p-5">
                <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                    {t('admin.lessons.videoSection')}
                </h2>

                {videoFileUrl && (
                    <div className="space-y-2">
                        <video
                            src={videoFileUrl}
                            controls
                            className="w-full max-w-lg border border-border"
                        />
                        <div className="flex items-center gap-3">
                            <input
                                type="hidden"
                                name="remove_video"
                                value="0"
                            />
                            <input
                                id="remove_video"
                                type="checkbox"
                                name="remove_video"
                                value="1"
                                className="size-4 rounded border-border"
                            />
                            <Label htmlFor="remove_video">
                                {t('admin.lessons.removeVideo')}
                            </Label>
                        </div>
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="video">{t('admin.lessons.video')}</Label>
                    <Input
                        id="video"
                        type="file"
                        name="video"
                        accept="video/*"
                    />
                    <p className="text-xs text-muted-foreground">
                        {t('admin.lessons.videoHint')}
                    </p>
                    <InputError message={errors.video} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="video_url">
                        {t('admin.lessons.videoUrl')}
                    </Label>
                    <Input
                        id="video_url"
                        type="url"
                        name="video_url"
                        defaultValue={videoUrl ?? ''}
                        placeholder="https://"
                    />
                    <p className="text-xs text-muted-foreground">
                        {t('admin.lessons.videoUrlHint')}
                    </p>
                    <InputError message={errors.video_url} />
                </div>
            </section>

            {locales.map((locale) => {
                const fields = translations[locale] ?? { title: '', body: '' };

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
                                {t('admin.lessons.fieldTitle')}
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
                            <Label htmlFor={`body-${locale}`}>
                                {t('admin.lessons.fieldBody')}
                            </Label>
                            <Textarea
                                id={`body-${locale}`}
                                name={`translations[${locale}][body]`}
                                defaultValue={fields.body}
                                rows={6}
                            />
                            <p className="text-xs text-muted-foreground">
                                {t('admin.lessons.bodyHint')}
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
