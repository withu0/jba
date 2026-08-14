import { useTranslation } from 'react-i18next';
import { ArticleProse } from '@/components/article-prose';
import { EmptyState } from '@/components/empty-state';
import { AboutPage } from '@/components/pages/about-page';
import { ContraindicationsPage } from '@/components/pages/contraindications-page';
import { CounselingPage } from '@/components/pages/counseling-page';
import { PageHero } from '@/components/page-hero';

type Props = {
    pageKey: string;
    title: string;
    body: string;
};

export default function StaticPage({ pageKey, title, body }: Props) {
    const { t } = useTranslation();

    if (pageKey === 'about') {
        return <AboutPage title={title} body={body} />;
    }

    if (pageKey === 'counseling') {
        return <CounselingPage title={title} body={body} />;
    }

    if (pageKey === 'contraindications') {
        return <ContraindicationsPage title={title} body={body} />;
    }

    return (
        <>
            <PageHero title={title} crumbs={[{ label: title }]} />
            <section className="bg-background py-20 md:py-28">
                <div className="mx-auto max-w-3xl px-4 md:px-6">
                    {body.trim() === '' ? (
                        <EmptyState
                            message={t('placeholder.comingSoon')}
                            href="/"
                        />
                    ) : (
                        <ArticleProse body={body} />
                    )}
                </div>
            </section>
        </>
    );
}
