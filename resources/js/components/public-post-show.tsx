import { Link } from '@inertiajs/react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ArticleProse } from '@/components/article-prose';
import { CtaBand } from '@/components/cta-band';
import { Reveal } from '@/components/reveal';
import { ShareRow } from '@/components/share-row';
import { SparkleDivider } from '@/components/sparkle-divider';
import { VerticalLabel } from '@/components/vertical-label';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

type Post = {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    body: string;
    published_at: string | null;
    featured_image_url: string | null;
};

type Props = {
    post: Post;
    indexUrl: string;
    backKey: string;
    /** `interview` frames the lead image as a portrait beside the intro. */
    variant?: 'news' | 'interview';
    navKey: string;
};

export function PublicPostShow({
    post,
    indexUrl,
    backKey,
    variant = 'news',
    navKey,
}: Props) {
    const { t, i18n } = useTranslation();
    const published = post.published_at
        ? formatDate(post.published_at, i18n.language)
        : '';

    return (
        <article>
            <header className="relative isolate overflow-hidden bg-ink">
                {post.featured_image_url ? (
                    <img
                        src={post.featured_image_url}
                        alt=""
                        fetchPriority="high"
                        className="absolute inset-0 size-full object-cover opacity-40"
                    />
                ) : (
                    <img
                        src="/images/hero-3.jpg"
                        alt=""
                        className="absolute inset-0 size-full object-cover opacity-45"
                    />
                )}
                <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-[#08202b]/92 via-[#0f4a63]/78 to-[#349cca]/40"
                />
                <div
                    aria-hidden
                    className="bg-noise absolute inset-0 opacity-55"
                />

                <div className="relative mx-auto max-w-3xl px-4 pt-32 pb-20 md:px-6 md:pt-40 md:pb-24">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-9 flex flex-wrap items-center gap-1.5 text-xs text-white/60"
                    >
                        <Link
                            href="/"
                            className="transition-colors hover:text-white"
                        >
                            {t('nav.home')}
                        </Link>
                        <ChevronRight
                            aria-hidden
                            className="size-3 opacity-50"
                        />
                        <Link
                            href={indexUrl}
                            className="transition-colors hover:text-white"
                        >
                            {t(navKey)}
                        </Link>
                    </nav>

                    {published && (
                        <time
                            dateTime={post.published_at ?? undefined}
                            className="text-tracking-label text-xs text-white/75"
                        >
                            {published}
                        </time>
                    )}
                    <h1 className="mt-5 font-serif text-3xl leading-[1.3] font-bold tracking-tight text-balance text-white sm:text-4xl md:text-[2.75rem]">
                        {post.title}
                    </h1>
                    {post.excerpt && (
                        <p className="mt-7 text-base leading-[1.9] text-white/80">
                            {post.excerpt}
                        </p>
                    )}
                </div>

                <VerticalLabel
                    tone="dark"
                    className="absolute top-1/2 right-7 -translate-y-1/2"
                >
                    {t(navKey)}
                </VerticalLabel>
            </header>

            <div className="bg-background py-16 md:py-24">
                <div className="mx-auto max-w-3xl px-4 md:px-6">
                    {post.featured_image_url && (
                        <Reveal>
                            <figure
                                className={cn(
                                    'shadow-soft mb-14 overflow-hidden rounded-md bg-surface',
                                    variant === 'interview'
                                        ? 'mx-auto max-w-md'
                                        : '',
                                )}
                            >
                                <img
                                    src={post.featured_image_url}
                                    alt={post.title}
                                    className={cn(
                                        'w-full object-cover',
                                        variant === 'interview'
                                            ? 'aspect-[4/5]'
                                            : 'aspect-[16/9]',
                                    )}
                                />
                            </figure>
                        </Reveal>
                    )}

                    <Reveal>
                        <ArticleProse body={post.body} dropCap />
                    </Reveal>

                    <SparkleDivider className="mt-16" />

                    <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                        <ShareRow title={post.title} />
                        <Link
                            href={indexUrl}
                            className="group inline-flex items-center gap-2.5 text-sm font-medium text-brand-blue"
                        >
                            <ArrowLeft
                                aria-hidden
                                className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
                            />
                            {t(backKey)}
                        </Link>
                    </div>
                </div>
            </div>

            <CtaBand />
        </article>
    );
}
