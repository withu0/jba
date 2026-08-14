import { Head, Link } from '@inertiajs/react';
import { Check, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/empty-state';
import { MemberHero } from '@/components/member-hero';
import { SparkleDivider } from '@/components/sparkle-divider';
import { dashboard } from '@/routes';
import { show as lessonShow } from '@/routes/lessons';

type LessonSummary = {
    id: number;
    title: string;
    thumbnail_url: string | null;
    category_name: string | null;
    started: boolean;
    completed: boolean;
};

type Category = {
    id: number;
    slug: string;
    name: string;
    lessons: LessonSummary[];
};

type Props = {
    categories: Category[];
};

function statusLabel(
    lesson: LessonSummary,
    t: (key: string) => string,
): string | null {
    if (lesson.completed) {
        return t('lessons.statusCompleted');
    }

    if (lesson.started) {
        return t('lessons.statusStarted');
    }

    return null;
}

export default function MemberLessonsIndex({ categories }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('lessons.title')} />
            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto p-4 md:p-6">
                <MemberHero
                    title={t('lessons.title')}
                    lead={t('lessons.lead')}
                    image="/images/hero-1.jpg"
                />

                {categories.length === 0 ? (
                    <EmptyState message={t('lessons.empty')} />
                ) : (
                    <div className="space-y-14">
                        {categories.map((category) => (
                            <section key={category.id}>
                                <div className="flex items-center gap-5">
                                    <h2 className="font-serif text-xl font-bold text-ink md:text-2xl">
                                        {category.name}
                                    </h2>
                                    <SparkleDivider className="flex-1" />
                                </div>

                                <ul className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                    {category.lessons.map((lesson) => {
                                        const status = statusLabel(lesson, t);

                                        return (
                                            <li key={lesson.id}>
                                                <Link
                                                    href={lessonShow(lesson.id)}
                                                    className="group hover:shadow-lift flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-brand-blue/40"
                                                >
                                                    <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                                                        {lesson.thumbnail_url ? (
                                                            <img
                                                                src={
                                                                    lesson.thumbnail_url
                                                                }
                                                                alt=""
                                                                className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="bg-brand-gradient-soft flex size-full items-center justify-center text-xs text-muted-foreground">
                                                                {t(
                                                                    'lessons.noThumbnail',
                                                                )}
                                                            </div>
                                                        )}
                                                        <span
                                                            aria-hidden
                                                            className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25"
                                                        >
                                                            <span className="shadow-lift flex size-12 scale-90 items-center justify-center rounded-full bg-white/95 text-brand-blue opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                                                                <Play className="size-4 translate-x-px" />
                                                            </span>
                                                        </span>
                                                        {lesson.completed && (
                                                            <span className="text-tracking-label absolute top-3 right-3 flex items-center gap-1 rounded-sm bg-brand-gold/90 px-2 py-0.5 text-[0.5625rem] text-white uppercase">
                                                                <Check className="size-2.5" />
                                                                {t(
                                                                    'lessons.statusCompleted',
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-1 flex-col gap-2 px-5 py-5">
                                                        <h3 className="font-serif font-bold text-ink transition-colors group-hover:text-brand-blue">
                                                            {lesson.title}
                                                        </h3>
                                                        {status &&
                                                            !lesson.completed && (
                                                                <span className="text-tracking-label text-[0.6875rem] text-brand-blue uppercase">
                                                                    {status}
                                                                </span>
                                                            )}
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

MemberLessonsIndex.layout = {
    breadcrumbs: [
        {
            title: 'mypage.title',
            href: dashboard(),
        },
        {
            title: 'lessons.title',
            href: '/lessons',
        },
    ],
};
