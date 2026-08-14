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

export default function InterviewsIndex({ posts }: Props) {
    return (
        <PublicPostList
            posts={posts}
            titleKey="interviews.title"
            leadKey="interviews.lead"
            emptyKey="interviews.empty"
            showBasePath="/interviews"
            navKey="nav.interviews"
            variant="interview"
            heroImage="/images/concept-a.jpg"
            verticalLabel="声 を き く"
        />
    );
}
