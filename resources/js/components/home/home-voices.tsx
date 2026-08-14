import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { index as interviews } from '@/routes/interviews';

export type PostTeaser = {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    published_at: string | null;
    featured_image_url: string | null;
};

export function HomeVoices({ posts }: { posts: PostTeaser[] }) {
    const { t } = useTranslation();

    if (posts.length === 0) {
        return null;
    }

    return (
        <section className="bg-background py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <SectionHeading
                        eyebrow={t('home.voices.eyebrow')}
                        title={t('home.voices.title')}
                        lead={t('home.voices.lead')}
                        className="max-w-2xl"
                    />
                    <Link
                        href={interviews()}
                        className="group inline-flex shrink-0 items-center gap-2.5 text-sm font-medium text-brand-blue"
                    >
                        {t('home.voices.cta')}
                        <ArrowRight
                            aria-hidden
                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                <ul className="mt-16 grid gap-6 md:grid-cols-3">
                    {posts.map((post, index) => (
                        <Reveal as="li" key={post.id} delay={index * 110}>
                            <Link
                                href={`/interviews/${post.slug}`}
                                className="group hover:shadow-lift flex h-full flex-col rounded-md border border-border bg-surface p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-blue/40 hover:bg-background"
                            >
                                <span
                                    aria-hidden
                                    className="font-serif text-4xl leading-none text-brand-turquoise/60"
                                >
                                    “
                                </span>
                                <h3 className="mt-4 font-serif text-lg leading-snug font-bold text-ink transition-colors group-hover:text-brand-blue">
                                    {post.title}
                                </h3>
                                {post.excerpt && (
                                    <p className="mt-4 line-clamp-4 flex-1 text-sm leading-[1.9] text-muted-foreground">
                                        {post.excerpt}
                                    </p>
                                )}
                                <div className="mt-7 flex items-center gap-3.5 border-t border-border pt-5">
                                    {post.featured_image_url ? (
                                        <img
                                            src={post.featured_image_url}
                                            alt=""
                                            loading="lazy"
                                            className="size-10 shrink-0 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span
                                            aria-hidden
                                            className="bg-brand-gradient size-10 shrink-0 rounded-full opacity-25"
                                        />
                                    )}
                                    <span className="text-tracking-label text-[0.625rem] text-muted-foreground uppercase">
                                        {t('nav.interviews')}
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}
