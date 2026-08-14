import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PostTeaser } from '@/components/home/home-voices';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { formatDateStamp } from '@/lib/format';
import { index as news } from '@/routes/news';

export function HomeNews({ posts }: { posts: PostTeaser[] }) {
    const { t } = useTranslation();

    if (posts.length === 0) {
        return null;
    }

    return (
        <section className="bg-surface py-24 md:py-32">
            <div className="mx-auto grid max-w-7xl gap-14 px-4 md:px-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-20">
                <div className="lg:sticky lg:top-28 lg:self-start">
                    <SectionHeading
                        eyebrow={t('home.news.eyebrow')}
                        title={t('home.news.title')}
                        lead={t('home.news.lead')}
                    />
                    <Link
                        href={news()}
                        className="group mt-9 inline-flex items-center gap-2.5 text-sm font-medium text-brand-blue"
                    >
                        {t('home.news.cta')}
                        <ArrowRight
                            aria-hidden
                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                <ul className="divide-y divide-border border-t border-border">
                    {posts.map((post, index) => (
                        <Reveal as="li" key={post.id} delay={index * 90}>
                            <Link
                                href={`/news/${post.slug}`}
                                className="group flex items-center gap-5 py-6 sm:gap-7"
                            >
                                {post.featured_image_url ? (
                                    <div className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md bg-background sm:w-32">
                                        <img
                                            src={post.featured_image_url}
                                            alt=""
                                            loading="lazy"
                                            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        aria-hidden
                                        className="bg-brand-gradient-soft aspect-[4/3] w-24 shrink-0 rounded-md sm:w-32"
                                    />
                                )}
                                <div className="min-w-0 flex-1">
                                    {post.published_at && (
                                        <time
                                            dateTime={post.published_at}
                                            className="text-tracking-label text-[0.6875rem] text-muted-foreground"
                                        >
                                            {formatDateStamp(post.published_at)}
                                        </time>
                                    )}
                                    <h3 className="mt-2 font-serif text-base leading-snug font-bold text-ink transition-colors group-hover:text-brand-blue sm:text-lg">
                                        {post.title}
                                    </h3>
                                </div>
                                <ArrowRight
                                    aria-hidden
                                    className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-blue"
                                />
                            </Link>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}
