import { CountUp } from '@/components/count-up';
import { Reveal } from '@/components/reveal';

export type Stat = {
    key: string;
    value: number;
    suffix?: string;
    label: string;
    caption: string;
};

export function StatStrip({ stats }: { stats: Stat[] }) {
    return (
        <Reveal className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 md:-mt-20 md:px-6">
            <dl className="shadow-lift grid grid-cols-2 gap-y-10 rounded-md border border-border bg-background/95 px-6 py-10 backdrop-blur-sm md:grid-cols-4 md:divide-x md:divide-border md:px-4">
                {stats.map((stat) => (
                    <div
                        key={stat.key}
                        className="flex flex-col items-center px-4 text-center"
                    >
                        <dt className="text-tracking-label text-[0.6875rem] text-muted-foreground uppercase">
                            {stat.label}
                        </dt>
                        <dd className="mt-3 font-serif text-4xl leading-none font-bold text-ink sm:text-[2.75rem]">
                            <CountUp to={stat.value} />
                            {stat.suffix && (
                                <span className="ml-0.5 text-2xl text-brand-blue">
                                    {stat.suffix}
                                </span>
                            )}
                        </dd>
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            {stat.caption}
                        </p>
                    </div>
                ))}
            </dl>
        </Reveal>
    );
}
