import { Form, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LessonImageController from '@/actions/App/Http/Controllers/Admin/LessonImageController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { localeLabels } from '@/lib/locale-labels';

export type LessonImageCaptionFields = {
    caption: string;
};

export type LessonImageRow = {
    id: number;
    sort_order: number;
    image_url: string | null;
    translations: Record<string, LessonImageCaptionFields>;
};

type Props = {
    lessonId: number;
    images: LessonImageRow[];
    locales: string[];
    emptyCaptions: Record<string, LessonImageCaptionFields>;
    nextSortOrder: number;
};

export function AdminLessonImageManager({
    lessonId,
    images,
    locales,
    emptyCaptions,
    nextSortOrder,
}: Props) {
    const { t } = useTranslation();

    const deleteImage = (id: number) => {
        if (!window.confirm(t('admin.lessons.imageDeleteConfirm'))) {
            return;
        }

        router.delete(LessonImageController.destroy.url(id));
    };

    return (
        <section className="space-y-6">
            <div>
                <h2 className="font-serif text-xl font-bold text-ink">
                    {t('admin.lessons.imagesSection')}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t('admin.lessons.imagesLead')}
                </p>
            </div>

            <Form
                {...LessonImageController.store.form(lessonId)}
                options={{ preserveScroll: true, forceFormData: true }}
                resetOnSuccess
                className="space-y-4 border border-border p-4 md:p-5"
            >
                {({ processing, errors }) => (
                    <>
                        <h3 className="text-sm font-semibold tracking-wide text-ink uppercase">
                            {t('admin.lessons.addImage')}
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="image">
                                    {t('admin.lessons.image')}
                                </Label>
                                <Input
                                    id="image"
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t('admin.lessons.imageHint')}
                                </p>
                                <InputError message={errors.image} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="image_sort_order">
                                    {t('admin.lessons.sortOrder')}
                                </Label>
                                <Input
                                    id="image_sort_order"
                                    type="number"
                                    name="sort_order"
                                    min={0}
                                    defaultValue={nextSortOrder}
                                />
                                <InputError message={errors.sort_order} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {locales.map((locale) => (
                                <div key={locale} className="grid gap-2">
                                    <Label htmlFor={`new-caption-${locale}`}>
                                        {t('admin.lessons.fieldCaption')} (
                                        {localeLabels[locale] ?? locale})
                                    </Label>
                                    <Textarea
                                        id={`new-caption-${locale}`}
                                        name={`translations[${locale}][caption]`}
                                        defaultValue={
                                            emptyCaptions[locale]?.caption ?? ''
                                        }
                                        rows={2}
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `translations.${locale}.caption`
                                            ]
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            {t('admin.lessons.addImage')}
                        </Button>
                    </>
                )}
            </Form>

            {images.map((image, index) => (
                <Form
                    key={image.id}
                    {...LessonImageController.update.form(image.id)}
                    options={{ preserveScroll: true, forceFormData: true }}
                    className="space-y-4 border border-border p-4 md:p-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex min-w-0 items-start gap-4">
                                    {image.image_url && (
                                        <img
                                            src={image.image_url}
                                            alt=""
                                            className="h-24 w-32 shrink-0 border border-border object-cover"
                                        />
                                    )}
                                    <h3 className="text-sm font-semibold tracking-wide text-ink uppercase">
                                        {t('admin.lessons.stepLabel', {
                                            n: index + 1,
                                        })}
                                    </h3>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={index === 0}
                                        onClick={() =>
                                            router.post(
                                                LessonImageController.moveUp.url(
                                                    image.id,
                                                ),
                                            )
                                        }
                                    >
                                        {t('admin.lessons.moveUp')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={index === images.length - 1}
                                        onClick={() =>
                                            router.post(
                                                LessonImageController.moveDown.url(
                                                    image.id,
                                                ),
                                            )
                                        }
                                    >
                                        {t('admin.lessons.moveDown')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteImage(image.id)}
                                    >
                                        {t('common.delete')}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor={`image-${image.id}`}>
                                        {t('admin.lessons.replaceImage')}
                                    </Label>
                                    <Input
                                        id={`image-${image.id}`}
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                    />
                                    <InputError message={errors.image} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor={`sort-${image.id}`}>
                                        {t('admin.lessons.sortOrder')}
                                    </Label>
                                    <Input
                                        id={`sort-${image.id}`}
                                        type="number"
                                        name="sort_order"
                                        min={0}
                                        defaultValue={image.sort_order}
                                    />
                                    <InputError message={errors.sort_order} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {locales.map((locale) => (
                                    <div key={locale} className="grid gap-2">
                                        <Label
                                            htmlFor={`caption-${image.id}-${locale}`}
                                        >
                                            {t('admin.lessons.fieldCaption')} (
                                            {localeLabels[locale] ?? locale})
                                        </Label>
                                        <Textarea
                                            id={`caption-${image.id}-${locale}`}
                                            name={`translations[${locale}][caption]`}
                                            defaultValue={
                                                image.translations[locale]
                                                    ?.caption ?? ''
                                            }
                                            rows={2}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `translations.${locale}.caption`
                                                ]
                                            }
                                        />
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="submit"
                                variant="outline"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                {t('admin.lessons.saveImage')}
                            </Button>
                        </>
                    )}
                </Form>
            ))}

            {images.length === 0 && (
                <p className="border border-border px-4 py-8 text-sm text-muted-foreground">
                    {t('admin.lessons.imagesEmpty')}
                </p>
            )}
        </section>
    );
}
