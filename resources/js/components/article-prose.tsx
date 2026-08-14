import { cn } from '@/lib/utils';

/** CMS bodies are plain text with blank lines between paragraphs. */
export function paragraphs(body: string | null | undefined): string[] {
    return (body ?? '')
        .trim()
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean);
}

type Props = {
    body: string | null | undefined;
    /** Renders an oversized serif initial on the first paragraph. */
    dropCap?: boolean;
    className?: string;
};

export function ArticleProse({ body, dropCap = false, className }: Props) {
    const blocks = paragraphs(body);

    if (blocks.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                'prose-jba text-base sm:text-[1.0625rem]',
                dropCap && 'prose-jba-lead',
                className,
            )}
        >
            {blocks.map((block, index) => (
                <p key={index} className="whitespace-pre-line">
                    {block}
                </p>
            ))}
        </div>
    );
}
