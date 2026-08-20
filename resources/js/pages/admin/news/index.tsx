import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import {
    create as newsCreate,
    edit as newsEdit,
    index as newsIndex,
} from '@/routes/admin/news';

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

export default function AdminNewsIndex({ posts }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.news.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.news.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.news.lead')}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={newsCreate.url()}>
                            {t('admin.posts.create')}
                        </Link>
                    </Button>
                </div>

                <div className="overflow-x-auto border border-border">
                    <table className="min-w-160 w-full text-left text-sm">
                        <thead className="border-b border-border bg-surface text-xs tracking-wide text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.table.title')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.table.status')}
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    {t('admin.table.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {posts.data.map((post) => (
                                <tr key={post.id} className="bg-background">
                                    <td className="px-4 py-3 font-medium text-ink">
                                        {post.title}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {post.is_published
                                            ? t('admin.posts.statusPublished')
                                            : t('admin.posts.statusDraft')}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={newsEdit.url(post.id)}
                                            className="text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                                        >
                                            {t('admin.posts.edit')}
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {posts.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                                    >
                                        {t('admin.news.empty')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

AdminNewsIndex.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.news', href: newsIndex() },
    ],
};
