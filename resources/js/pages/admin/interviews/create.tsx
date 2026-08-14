import { Form, Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InterviewController from '@/actions/App/Http/Controllers/Admin/InterviewController';
import {
    AdminPostFormFields,
    type PostTranslationFields,
} from '@/components/admin-post-form-fields';
import { dashboard } from '@/routes/admin';
import { index as interviewsIndex } from '@/routes/admin/interviews';

type Props = {
    locales: string[];
    translations: Record<string, PostTranslationFields>;
};

export default function AdminInterviewsCreate({
    locales,
    translations,
}: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.interviews.createTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.interviews.createTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.interviews.formLead')}
                        </p>
                    </div>
                    <Link
                        href={interviewsIndex()}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {t('admin.posts.backToList')}
                    </Link>
                </div>

                <Form
                    {...InterviewController.store.form()}
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

AdminInterviewsCreate.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.interviews', href: interviewsIndex() },
    ],
};
