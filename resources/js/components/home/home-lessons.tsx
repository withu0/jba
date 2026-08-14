import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Lock, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';
import { index as lessons } from '@/routes/lessons';

export type LessonCategory = {
    id: number;
    slug: string;
    name: string;
    lessons_count: number;
};

export function HomeLessons({ categories }: { categories: LessonCategory[] }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const isMember = Boolean(auth.user);

    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="relative isolate overflow-hidden bg-surface py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <SectionHeading
                    eyebrow={t('home.lessons.eyebrow')}
                    title={t('home.lessons.title')}
                    lead={t('home.lessons.lead')}
                    align="center"
                    className="mx-auto max-w-3xl"
                />

                <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category, index) => (
                        <Reveal as="li" key={category.id} delay={index * 70}>
                            <Link
                                href={isMember ? lessons() : register()}
                                className="group hover:shadow-soft flex h-full items-center gap-5 rounded-md border border-border bg-background px-6 py-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand-blue/40"
                            >
                                <span className="text-tracking-label font-serif text-2xl font-bold text-brand-turquoise">
                                    {`0${index + 1}`}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block font-serif text-base font-bold text-ink transition-colors group-hover:text-brand-blue">
                                        {category.name}
                                    </span>
                                    <span className="mt-1.5 block text-xs text-muted-foreground">
                                        {t('home.lessons.count', {
                                            count: category.lessons_count,
                                        })}
                                    </span>
                                </span>
                                {isMember ? (
                                    <Play
                                        aria-hidden
                                        className="size-4 shrink-0 text-brand-blue transition-transform duration-300 group-hover:translate-x-0.5"
                                    />
                                ) : (
                                    <Lock
                                        aria-hidden
                                        className="size-3.5 shrink-0 text-muted-foreground"
                                    />
                                )}
                            </Link>
                        </Reveal>
                    ))}
                </ul>

                <div className="mt-14 flex flex-col items-center gap-5">
                    {isMember ? (
                        <Link
                            href={lessons()}
                            className="group inline-flex items-center gap-2.5 text-sm font-medium text-brand-blue"
                        >
                            {t('home.lessons.cta')}
                            <ArrowRight
                                aria-hidden
                                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>
                    ) : (
                        <>
                            <p className="text-sm text-muted-foreground">
                                {t('home.lessons.guestNote')}
                            </p>
                            <Button
                                asChild
                                size="lg"
                                className="rounded-md px-8"
                            >
                                <Link href={register()}>
                                    {t('nav.register')}
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
