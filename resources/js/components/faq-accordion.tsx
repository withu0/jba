import { Plus } from 'lucide-react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export type FaqItem = {
    question: string;
    answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="divide-y divide-border border-y border-border">
            {items.map((item, index) => {
                const open = openIndex === index;

                return (
                    <Collapsible
                        key={item.question}
                        open={open}
                        onOpenChange={(next) =>
                            setOpenIndex(next ? index : null)
                        }
                    >
                        <CollapsibleTrigger className="group flex w-full items-start gap-5 py-6 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                            <span className="text-tracking-label mt-1 text-xs text-brand-blue">
                                {`${index + 1}`.padStart(2, '0')}
                            </span>
                            <span className="flex-1 font-serif text-base font-bold text-ink transition-colors group-hover:text-brand-blue sm:text-lg">
                                {item.question}
                            </span>
                            <Plus
                                aria-hidden
                                className={cn(
                                    'mt-1 size-4 shrink-0 text-brand-blue transition-transform duration-300',
                                    open && 'rotate-45',
                                )}
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-[collapsible-up_0.25s_ease-out] data-[state=open]:animate-[collapsible-down_0.25s_ease-out]">
                            <p className="pb-7 pl-11 text-sm leading-[1.9] whitespace-pre-line text-muted-foreground">
                                {item.answer}
                            </p>
                        </CollapsibleContent>
                    </Collapsible>
                );
            })}
        </div>
    );
}
