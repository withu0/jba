import { Form, Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import BeforeAfterController from '@/actions/App/Http/Controllers/Admin/BeforeAfterController';
import {
    AdminBeforeAfterFormFields,
    type BeforeAfterTranslationFields,
} from '@/components/admin-before-after-form-fields';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import { index as beforeAfterIndex } from '@/routes/admin/before-after';

type Props = {
    pair: {
        id: number;
        is_published: boolean;
        sort_order: number;
        before_image_url: string | null;
        after_image_url: string | null;
        translations: Record<string, BeforeAfterTranslationFields>;
    };
    locales: string[];
};

export default function AdminBeforeAfterEdit({ pair, locales }: Props) {
    const { t } = useTranslation();

    const handleDelete = () => {
        if (!window.confirm(t('admin.beforeAfter.deleteConfirm'))) {
            return;
        }

        router.delete(BeforeAfterController.destroy.url(pair.id));
    };

    return (
        <>
            <Head title={t('admin.beforeAfter.editTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.beforeAfter.editTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.beforeAfter.formLead')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={beforeAfterIndex()}
                            className="text-sm text-brand-blue underline-offset-4 hover:underline"
                        >
                            {t('admin.beforeAfter.backToList')}
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
                    {...BeforeAfterController.update.form(pair.id)}
                    options={{ preserveScroll: true, forceFormData: true }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <AdminBeforeAfterFormFields
                            locales={locales}
                            translations={pair.translations}
                            isPublished={pair.is_published}
                            sortOrder={pair.sort_order}
                            beforeImageUrl={pair.before_image_url}
                            afterImageUrl={pair.after_image_url}
                            processing={processing}
                            errors={errors}
                            submitLabel={t('admin.beforeAfter.save')}
                        />
                    )}
                </Form>
            </div>
        </>
    );
}

AdminBeforeAfterEdit.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.beforeAfter', href: beforeAfterIndex() },
    ],
};
