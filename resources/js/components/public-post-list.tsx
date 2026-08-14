import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CtaBand } from '@/components/cta-band';
import { EmptyState } from '@/components/empty-state';
import { PageHero } from '@/components/page-hero';
import { PaginationNav } from '@/components/pagination-nav';
import type { PaginationLink } from '@/components/pagination-nav';
import { Reveal } from '@/components/reveal';
import { Sparkle } from '@/components/sparkle-divider';
import { formatDate, formatDateStamp } from '@/lib/format';
import { cn } from '@/lib/utils';

type PostListItem = {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    published_at: string | null;
    featured_image_url: string | null;
};

type PaginatedPosts = {
    data: PostListItem[];
    links: PaginationLink[];
};

type Props = {
    posts: PaginatedPosts;
    titleKey: string;
    leadKey: string;
    emptyKey: string;
    showBasePath: string;
    /** `interview` uses portrait cards and a quote motif. */
    variant?: 'news' | 'interview';
    heroImage?: string;
    verticalLabel?: string;
    navKey: string;
};

export function PublicPostList({
    posts,
    titleKey,
    leadKey,
    emptyKey,
    showBasePath,
    variant = 'news',
    heroImage = '/images/hero-3.jpg',
    verticalLabel,
    navKey,
}: Props) {
    const { t, i18n } = useTranslation();

    const onFirstPage =
        posts.links.find((link) => link.active)?.label.trim() === '1';
    const [featured, ...rest] =
        onFirstPage && posts.data.length > 2 ? posts.data : [];
    const grid = featured ? rest : posts.data;

    return (
        <>
            <PageHero
                title={t(titleKey)}
                lead={t(leadKey)}
                image={heroImage}
                verticalLabel={verticalLabel}
                crumbs={[{ label: t(navKey) }]}
            />

            <section className="bg-background py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    {posts.data.length === 0 ? (
                        <EmptyState message={t(emptyKey)} href="/" />
                    ) : (
                        <>
                            {featured && (
                                <Reveal>
                                    <Link
                                        href={`${showBasePath}/${featured.slug}`}
                                        className="group grid items-center gap-10 border-b border-border pb-16 lg:grid-cols-2 lg:gap-16"
                                    >
                                        <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-md bg-surface lg:order-none">
                                            {featured.featured_image_url ? (
                                                <img
                                                    src={
                                                        featured.featured_image_url
                                                    }
                                                    alt=""
                                                    className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="bg-brand-gradient-soft size-full" />
                                            )}
                                            <span className="text-tracking-label absolute top-4 left-4 flex items-center gap-1.5 rounded-sm bg-background/90 px-2.5 py-1 text-[0.625rem] text-brand-blue uppercase backdrop-blur-sm">
                                                <Sparkle className="size-2" />
                                                {t('pages.posts.featured')}
                                            </span>
                                        </div>

                                        <div>
                                            {featured.published_at && (
                                                <time
                                                    dateTime={
                                                        featured.published_at
                                                    }
                                                    className="text-tracking-label text-xs text-muted-foreground"
                                                >
                                                    {formatDate(
                                                        featured.published_at,
                                                        i18n.language,
                                                    )}
                                                </time>
                                            )}
                                            <h2 className="mt-4 font-serif text-2xl leading-[1.35] font-bold text-balance text-ink transition-colors group-hover:text-brand-blue sm:text-3xl md:text-[2rem]">
                                                {featured.title}
                                            </h2>
                                            {featured.excerpt && (
                                                <p className="mt-5 line-clamp-4 text-base leading-[1.9] text-muted-foreground">
                                                    {featured.excerpt}
                                                </p>
                                            )}
                                            <span className="mt-8 inline-flex items-center gap-2.5 text-sm font-medium text-brand-blue">
                                                {t('pages.posts.readMore')}
                                                <ArrowRight
                                                    aria-hidden
                                                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                                />
                                            </span>
                                        </div>
                                    </Link>
                                </Reveal>
                            )}

                            <ul
                                className={cn(
                                    'grid gap-x-6 gap-y-12',
                                    featured && 'mt-16',
                                    'sm:grid-cols-2 lg:grid-cols-3',
                                )}
                            >
                                {grid.map((post, index) => (
                                    <Reveal
                                        as="li"
                                        key={post.id}
                                        delay={(index % 3) * 90}
                                    >
                                        <Link
                                            href={`${showBasePath}/${post.slug}`}
                                            className="group flex h-full flex-col"
                                        >
                                            <div
                                                className={cn(
                                                    'relative overflow-hidden rounded-md bg-surface',
                                                    variant === 'interview'
                                                        ? 'aspect-[3/4]'
                                                        : 'aspect-[4/3]',
                                                )}
                                            >
                                                {post.featured_image_url ? (
                                                    <img
                                                        src={
                                                            post.featured_image_url
                                                        }
                                                        alt=""
                                                        loading="lazy"
                                                        className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="bg-brand-gradient-soft size-full" />
                                                )}
                                                {variant === 'interview' && (
                                                    <div
                                                        aria-hidden
                                                        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent"
                                                    />
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col pt-6">
                                                {post.published_at && (
                                                    <time
                                                        dateTime={
                                                            post.published_at
                                                        }
                                                        className="text-tracking-label text-[0.6875rem] text-muted-foreground"
                                                    >
                                                        {formatDateStamp(
                                                            post.published_at,
                                                        )}
                                                    </time>
                                                )}
                                                <h2 className="mt-2.5 font-serif text-lg leading-snug font-bold text-ink transition-colors group-hover:text-brand-blue">
                                                    {post.title}
                                                </h2>
                                                {post.excerpt && (
                                                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-[1.9] text-muted-foreground">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                                <span
                                                    aria-hidden
                                                    className="bg-brand-gradient mt-6 h-px w-10 transition-all duration-500 group-hover:w-20"
                                                />
                                            </div>
                                        </Link>
                                    </Reveal>
                                ))}
                            </ul>

                            <PaginationNav
                                links={posts.links}
                                className="mt-20"
                            />
                        </>
                    )}
                </div>
            </section>

            <CtaBand />
        </>
    );
}
