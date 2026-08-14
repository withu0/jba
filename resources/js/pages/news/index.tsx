import { PublicPostList } from '@/components/public-post-list';

type Props = {
    posts: {
        data: Array<{
            id: number;
            slug: string;
            title: string;
            excerpt: string | null;
            published_at: string | null;
            featured_image_url: string | null;
        }>;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
};

export default function NewsIndex({ posts }: Props) {
    return (
        <PublicPostList
            posts={posts}
            titleKey="news.title"
            leadKey="news.lead"
            emptyKey="news.empty"
            showBasePath="/news"
            navKey="nav.news"
            heroImage="/images/hero-1.jpg"
            verticalLabel="お 知 ら せ"
        />
    );
}
