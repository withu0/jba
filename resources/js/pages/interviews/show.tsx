import { PublicPostShow } from '@/components/public-post-show';

type Props = {
    post: {
        id: number;
        slug: string;
        title: string;
        excerpt: string | null;
        body: string;
        published_at: string | null;
        featured_image_url: string | null;
    };
    indexUrl: string;
};

export default function InterviewsShow({ post, indexUrl }: Props) {
    return (
        <PublicPostShow
            post={post}
            indexUrl={indexUrl}
            backKey="interviews.backToList"
            navKey="nav.interviews"
            variant="interview"
        />
    );
}
