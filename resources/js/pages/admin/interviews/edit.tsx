import { Form, Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InterviewController from '@/actions/App/Http/Controllers/Admin/InterviewController';
import {
    AdminPostFormFields,
    type PostTranslationFields,
} from '@/components/admin-post-form-fields';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import { index as interviewsIndex } from '@/routes/admin/interviews';

type Props = {
    post: {
        id: number;
        is_published: boolean;
        published_at: string | null;
        featured_image_url: string | null;
        translations: Record<string, PostTranslationFields>;
    };
    locales: string[];
};

export default function AdminInterviewsEdit({ post, locales }: Props) {
    const { t } = useTranslation();

    const handleDelete = () => {
        if (!window.confirm(t('admin.posts.deleteConfirm'))) {
            return;
        }

        router.delete(InterviewController.destroy.url(post.id));
    };

    return (
        <>
            <Head title={t('admin.interviews.editTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.interviews.editTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.interviews.formLead')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={interviewsIndex()}
                            className="text-sm text-brand-blue underline-offset-4 hover:underline"
                        >
                            {t('admin.posts.backToList')}
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
                    {...InterviewController.update.form(post.id)}
                    options={{ preserveScroll: true, forceFormData: true }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <AdminPostFormFields
                            locales={locales}
                            translations={post.translations}
                            isPublished={post.is_published}
                            publishedAt={post.published_at ?? ''}
                            featuredImageUrl={post.featured_image_url}
                            processing={processing}
                            errors={errors}
                            submitLabel={t('admin.posts.save')}
                        />
                    )}
                </Form>
            </div>
        </>
    );
}

AdminInterviewsEdit.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.interviews', href: interviewsIndex() },
    ],
};
