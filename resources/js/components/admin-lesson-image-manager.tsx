import { Form, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LessonImageController from '@/actions/App/Http/Controllers/Admin/LessonImageController';
import { FileDropzone } from '@/components/file-dropzone';
import { AdminField, AdminFieldGrid } from '@/components/admin-form-layout';
import { AdminSortableList } from '@/components/admin-sortable-list';
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

                        <AdminFieldGrid>
                            <AdminField>
                                <Label htmlFor="image">
                                    {t('admin.lessons.image')}
                                </Label>
                                <FileDropzone
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    required
                                    hint={t('admin.lessons.imageHint')}
                                />
                                <InputError message={errors.image} />
                            </AdminField>
                            <AdminField>
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
                            </AdminField>
                        </AdminFieldGrid>

                        <AdminFieldGrid columns={3}>
                            {locales.map((locale) => (
                                <AdminField key={locale}>
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
                                </AdminField>
                            ))}
                        </AdminFieldGrid>

                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            {t('admin.lessons.addImage')}
                        </Button>
                    </>
                )}
            </Form>

            {images.length > 0 ? (
                <AdminSortableList
                    items={images}
                    onReorder={(ids) =>
                        router.post(
                            LessonImageController.reorder.url(images[0].id),
                            { ids },
                            { preserveScroll: true },
                        )
                    }
                    renderItem={(image, index) => (
                        <Form
                            {...LessonImageController.update.form(image.id)}
                            options={{
                                preserveScroll: true,
                                forceFormData: true,
                            }}
                            className="space-y-4 p-4 md:p-5"
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

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                deleteImage(image.id)
                                            }
                                        >
                                            {t('common.delete')}
                                        </Button>
                                    </div>

                                    <AdminFieldGrid>
                                        <AdminField>
                                            <Label
                                                htmlFor={`image-${image.id}`}
                                            >
                                                {t(
                                                    'admin.lessons.replaceImage',
                                                )}
                                            </Label>
                                            <FileDropzone
                                                id={`image-${image.id}`}
                                                name="image"
                                                accept="image/*"
                                                existingUrl={image.image_url}
                                            />
                                            <InputError
                                                message={errors.image}
                                            />
                                        </AdminField>
                                        <AdminField>
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
                                            <InputError
                                                message={errors.sort_order}
                                            />
                                        </AdminField>
                                    </AdminFieldGrid>

                                    <AdminFieldGrid columns={3}>
                                        {locales.map((locale) => (
                                            <AdminField key={locale}>
                                                <Label
                                                    htmlFor={`caption-${image.id}-${locale}`}
                                                >
                                                    {t(
                                                        'admin.lessons.fieldCaption',
                                                    )}{' '}
                                                    (
                                                    {localeLabels[locale] ??
                                                        locale}
                                                    )
                                                </Label>
                                                <Textarea
                                                    id={`caption-${image.id}-${locale}`}
                                                    name={`translations[${locale}][caption]`}
                                                    defaultValue={
                                                        image.translations[
                                                            locale
                                                        ]?.caption ?? ''
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
                                            </AdminField>
                                        ))}
                                    </AdminFieldGrid>

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
                    )}
                />
            ) : (
                <p className="border border-border px-4 py-8 text-sm text-muted-foreground">
                    {t('admin.lessons.imagesEmpty')}
                </p>
            )}
        </section>
    );
}
