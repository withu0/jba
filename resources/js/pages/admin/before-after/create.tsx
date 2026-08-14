import { Form, Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import BeforeAfterController from '@/actions/App/Http/Controllers/Admin/BeforeAfterController';
import {
    AdminBeforeAfterFormFields,
    type BeforeAfterTranslationFields,
} from '@/components/admin-before-after-form-fields';
import { dashboard } from '@/routes/admin';
import { index as beforeAfterIndex } from '@/routes/admin/before-after';

type Props = {
    locales: string[];
    translations: Record<string, BeforeAfterTranslationFields>;
    nextSortOrder: number;
};

export default function AdminBeforeAfterCreate({
    locales,
    translations,
    nextSortOrder,
}: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.beforeAfter.createTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.beforeAfter.createTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.beforeAfter.formLead')}
                        </p>
                    </div>
                    <Link
                        href={beforeAfterIndex()}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {t('admin.beforeAfter.backToList')}
                    </Link>
                </div>

                <Form
                    {...BeforeAfterController.store.form()}
                    options={{ preserveScroll: true, forceFormData: true }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <AdminBeforeAfterFormFields
                            locales={locales}
                            translations={translations}
                            sortOrder={nextSortOrder}
                            processing={processing}
                            errors={errors}
                            submitLabel={t('admin.beforeAfter.create')}
                            requireImages
                        />
                    )}
                </Form>
            </div>
        </>
    );
}

AdminBeforeAfterCreate.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.beforeAfter', href: beforeAfterIndex() },
    ],
};
