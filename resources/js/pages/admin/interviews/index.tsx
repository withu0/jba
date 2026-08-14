import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import {
    create as interviewsCreate,
    edit as interviewsEdit,
    index as interviewsIndex,
} from '@/routes/admin/interviews';

type PostRow = {
    id: number;
    is_published: boolean;
    published_at: string | null;
    title: string;
    featured_image_url: string | null;
};

type Props = {
    posts: {
        data: PostRow[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
};

export default function AdminInterviewsIndex({ posts }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.interviews.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.interviews.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.interviews.lead')}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={interviewsCreate.url()}>
                            {t('admin.posts.create')}
                        </Link>
                    </Button>
                </div>

                <div className="divide-y divide-border border border-border">
                    {posts.data.map((post) => (
                        <div
                            key={post.id}
                            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <div className="text-sm font-medium text-ink">
                                    {post.title}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {post.is_published
                                        ? t('admin.posts.statusPublished')
                                        : t('admin.posts.statusDraft')}
                                </p>
                            </div>
                            <Link
                                href={interviewsEdit.url(post.id)}
                                className="text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                            >
                                {t('admin.posts.edit')}
                            </Link>
                        </div>
                    ))}

                    {posts.data.length === 0 && (
                        <p className="px-4 py-8 text-sm text-muted-foreground">
                            {t('admin.interviews.empty')}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

AdminInterviewsIndex.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.interviews', href: interviewsIndex() },
    ],
};
