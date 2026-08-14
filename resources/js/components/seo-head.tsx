import { Head, usePage } from '@inertiajs/react';

type SeoPayload = {
    title: string;
    description: string;
    image: string;
    url: string;
    type: string;
    siteName: string;
    locale: string;
    alternateLocales: string[];
    publishedAt: string | null;
    robots: string;
};

export function SeoHead() {
    const { seo, name } = usePage().props;
    const payload = seo as SeoPayload | undefined;
    const title = payload?.title || name;
    const description = payload?.description ?? '';
    const image = payload?.image ?? '';
    const url = payload?.url ?? '';
    const type = payload?.type ?? 'website';
    const siteName = payload?.siteName || name;
    const locale = payload?.locale ?? 'ja_JP';
    const alternates = payload?.alternateLocales ?? [];
    const robots = payload?.robots ?? 'index, follow';

    const jsonLd =
        type === 'article'
            ? {
                  '@context': 'https://schema.org',
                  '@type': 'Article',
                  headline: title,
                  description,
                  image,
                  url,
                  datePublished: payload?.publishedAt ?? undefined,
                  publisher: {
                      '@type': 'Organization',
                      name: siteName,
                  },
              }
            : {
                  '@context': 'https://schema.org',
                  '@type': 'WebSite',
                  name: siteName,
                  url,
                  description,
              };

    return (
        <Head title={title}>
            <meta head-key="robots" name="robots" content={robots} />
            <meta
                head-key="description"
                name="description"
                content={description}
            />
            <link head-key="canonical" rel="canonical" href={url} />
            <meta
                head-key="og:site_name"
                property="og:site_name"
                content={siteName}
            />
            <meta head-key="og:title" property="og:title" content={title} />
            <meta
                head-key="og:description"
                property="og:description"
                content={description}
            />
            <meta head-key="og:image" property="og:image" content={image} />
            <meta head-key="og:url" property="og:url" content={url} />
            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:locale" property="og:locale" content={locale} />
            {alternates.map((code) => (
                <meta
                    key={code}
                    head-key={`og:locale:alternate:${code}`}
                    property="og:locale:alternate"
                    content={code}
                />
            ))}
            <meta
                head-key="twitter:card"
                name="twitter:card"
                content="summary_large_image"
            />
            <meta
                head-key="twitter:title"
                name="twitter:title"
                content={title}
            />
            <meta
                head-key="twitter:description"
                name="twitter:description"
                content={description}
            />
            <meta
                head-key="twitter:image"
                name="twitter:image"
                content={image}
            />
            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Head>
    );
}
