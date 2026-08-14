import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, Clock3 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArticleProse } from '@/components/article-prose';
import { SparkleDivider } from '@/components/sparkle-divider';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import {
    complete as lessonComplete,
    index as lessonsIndex,
} from '@/routes/lessons';

type LessonDetail = {
    id: number;
    title: string;
    body: string;
    video_src: string | null;
    category: {
        id: number;
        slug: string;
        name: string;
    };
    images: Array<{
        id: number;
        image_url: string | null;
        caption: string | null;
        sort_order: number;
    }>;
    view: {
        started_at: string | null;
        completed_at: string | null;
        started: boolean;
        completed: boolean;
    };
};

type Props = {
    lesson: LessonDetail;
};

export default function MemberLessonShow({ lesson }: Props) {
    const { t } = useTranslation();
    const [completed, setCompleted] = useState(lesson.view.completed);
    const completingRef = useRef(false);

    const markComplete = () => {
        if (completed || completingRef.current) {
            return;
        }

        completingRef.current = true;
        router.post(
            lessonComplete.url(lesson.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCompleted(true);
                },
                onFinish: () => {
                    completingRef.current = false;
                },
            },
        );
    };

    return (
        <>
            <Head title={lesson.title} />
            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-auto p-4 md:p-6">
                <div>
                    <p className="text-tracking-label text-xs text-brand-blue uppercase">
                        {lesson.category.name}
                    </p>
                    <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-balance text-ink md:text-4xl">
                        {lesson.title}
                    </h1>
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                        <span
                            className={
                                completed
                                    ? 'text-tracking-label inline-flex items-center gap-1.5 rounded-full bg-brand-gold/12 px-3 py-1 text-[0.625rem] text-brand-gold uppercase'
                                    : 'text-tracking-label inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3 py-1 text-[0.625rem] text-brand-blue uppercase'
                            }
                        >
                            {completed ? (
                                <Check aria-hidden className="size-3" />
                            ) : (
                                <Clock3 aria-hidden className="size-3" />
                            )}
                            {completed
                                ? t('lessons.statusCompleted')
                                : t('lessons.statusStarted')}
                        </span>
                        <Link
                            href={lessonsIndex()}
                            className="group inline-flex items-center gap-2 text-sm text-brand-blue"
                        >
                            <ArrowLeft
                                aria-hidden
                                className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
                            />
                            {t('lessons.backToList')}
                        </Link>
                    </div>
                </div>

                <section>
                    {lesson.video_src ? (
                        <div className="shadow-lift overflow-hidden rounded-md bg-black">
                            <video
                                key={lesson.video_src}
                                className="aspect-video w-full"
                                controls
                                playsInline
                                preload="metadata"
                                src={lesson.video_src}
                                onEnded={markComplete}
                            >
                                {t('lessons.videoUnsupported')}
                            </video>
                        </div>
                    ) : (
                        <p className="rounded-md border border-border bg-surface px-5 py-8 text-center text-sm text-muted-foreground">
                            {t('lessons.videoUnavailable')}
                        </p>
                    )}
                    {!completed && (
                        <div className="mt-5">
                            <Button
                                type="button"
                                size="lg"
                                onClick={markComplete}
                                className="rounded-md px-7"
                            >
                                <Check aria-hidden className="size-4" />
                                {t('lessons.markComplete')}
                            </Button>
                        </div>
                    )}
                </section>

                {lesson.body.trim() !== '' && (
                    <section>
                        <div className="flex items-center gap-5">
                            <h2 className="font-serif text-xl font-bold text-ink">
                                {t('lessons.textHeading')}
                            </h2>
                            <SparkleDivider className="flex-1" />
                        </div>
                        <ArticleProse
                            body={lesson.body}
                            className="mt-7 max-w-3xl"
                        />
                    </section>
                )}

                {lesson.images.length > 0 && (
                    <section>
                        <div className="flex items-center gap-5">
                            <h2 className="font-serif text-xl font-bold text-ink">
                                {t('lessons.galleryHeading')}
                            </h2>
                            <SparkleDivider className="flex-1" />
                        </div>
                        <ul className="mt-7 grid gap-6 sm:grid-cols-2">
                            {lesson.images.map((image, index) => (
                                <li key={image.id}>
                                    <figure>
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-surface">
                                            {image.image_url && (
                                                <img
                                                    src={image.image_url}
                                                    alt={
                                                        image.caption ??
                                                        t(
                                                            'lessons.stepImageAlt',
                                                            {
                                                                step: index + 1,
                                                            },
                                                        )
                                                    }
                                                    className="size-full object-cover"
                                                    loading="lazy"
                                                />
                                            )}
                                            <span className="text-tracking-label absolute top-3 left-3 rounded-sm bg-background/90 px-2 py-0.5 text-[0.625rem] text-brand-blue backdrop-blur-sm">
                                                {`${index + 1}`.padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                        </div>
                                        {image.caption && (
                                            <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                                {image.caption}
                                            </figcaption>
                                        )}
                                    </figure>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </>
    );
}

MemberLessonShow.layout = {
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
