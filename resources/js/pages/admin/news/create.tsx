import { Form, Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import NewsController from '@/actions/App/Http/Controllers/Admin/NewsController';
import {
    AdminPostFormFields,
    type PostTranslationFields,
} from '@/components/admin-post-form-fields';
import { dashboard } from '@/routes/admin';
import { index as newsIndex } from '@/routes/admin/news';

type Props = {
    locales: string[];
    translations: Record<string, PostTranslationFields>;
};

export default function AdminNewsCreate({ locales, translations }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.news.createTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.news.createTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.news.formLead')}
                        </p>
                    </div>
                    <Link
                        href={newsIndex()}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {t('admin.posts.backToList')}
                    </Link>
                </div>

                <Form
                    {...NewsController.store.form()}
                    options={{ preserveScroll: true, forceFormData: true }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <AdminPostFormFields
                            locales={locales}
                            translations={translations}
                            processing={processing}
                            errors={errors}
                            submitLabel={t('admin.posts.create')}
                        />
                    )}
                </Form>
            </div>
        </>
    );
}

AdminNewsCreate.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.news', href: newsIndex() },
    ],
};
