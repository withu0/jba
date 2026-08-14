import { useTranslation } from 'react-i18next';
import { CtaBand } from '@/components/cta-band';
import { HomeBeforeAfter } from '@/components/home/home-before-after';
import type { Pair } from '@/components/home/home-before-after';
import { HomeConcept } from '@/components/home/home-concept';
import { HomeFaq } from '@/components/home/home-faq';
import { HomeHero } from '@/components/home/home-hero';
import { HomeLessons } from '@/components/home/home-lessons';
import type { LessonCategory } from '@/components/home/home-lessons';
import { HomeManga } from '@/components/home/home-manga';
import type { FeaturedEpisode } from '@/components/home/home-manga';
import { HomeMessage } from '@/components/home/home-message';
import { HomeNews } from '@/components/home/home-news';
import { HomePillars } from '@/components/home/home-pillars';
import { HomePromises } from '@/components/home/home-promises';
import { HomeSignature } from '@/components/home/home-signature';
import { HomeVoices } from '@/components/home/home-voices';
import type { PostTeaser } from '@/components/home/home-voices';
import { StatStrip } from '@/components/stat-strip';
import type { Stat } from '@/components/stat-strip';

type Props = {
    news: PostTeaser[];
    interviews: PostTeaser[];
    pairs: Pair[];
    lessonCategories: LessonCategory[];
    mangaEpisode: FeaturedEpisode | null;
};

export default function Home({
    news,
    interviews,
    pairs,
    lessonCategories,
    mangaEpisode,
}: Props) {
    const { t } = useTranslation();

    const stats: Stat[] = [
        {
            key: 'countries',
            value: 35,
            label: t('home.stats.countries.label'),
            caption: t('home.stats.countries.caption'),
        },
        {
            key: 'muscles',
            value: 31,
            label: t('home.stats.muscles.label'),
            caption: t('home.stats.muscles.caption'),
        },
        {
            key: 'media',
            value: 130,
            suffix: '+',
            label: t('home.stats.media.label'),
            caption: t('home.stats.media.caption'),
        },
        {
            key: 'languages',
            value: 3,
            label: t('home.stats.languages.label'),
            caption: t('home.stats.languages.caption'),
        },
    ];

    return (
        <>
            <HomeHero />
            <StatStrip stats={stats} />
            <HomeConcept />
            <HomeMessage />
            <HomeSignature />
            <HomePillars />
            <HomePromises />
            <HomeManga episode={mangaEpisode} />
            <HomeBeforeAfter pairs={pairs} />
            <HomeLessons categories={lessonCategories} />
            <HomeVoices posts={interviews} />
            <HomeNews posts={news} />
            <HomeFaq />
            <CtaBand />
        </>
    );
}
