import { Check, Facebook, Link2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

/** X has no lucide glyph, so draw the mark inline. */
function XMark({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden
            className={cn('fill-current', className)}
        >
            <path d="M18.9 2H22l-6.8 7.8L23 22h-6.4l-5-6.6L5.8 22H2.7l7.2-8.2L1.5 2H8l4.7 6.2L18.9 2zm-1.1 18h1.7L6.4 3.8H4.6L17.8 20z" />
        </svg>
    );
}

export function ShareRow({ title }: { title: string }) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const url = typeof window === 'undefined' ? '' : window.location.href;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    const buttonClass =
        'inline-flex size-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-brand-blue/40 hover:text-brand-blue';

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-tracking-label text-[0.6875rem] text-muted-foreground uppercase">
                {t('pages.posts.share')}
            </span>
            <div className="flex items-center gap-2">
                <a
                    href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('pages.posts.shareX')}
                    className={buttonClass}
                >
                    <XMark className="size-3.5" />
                </a>
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('pages.posts.shareFacebook')}
                    className={buttonClass}
                >
                    <Facebook className="size-4" />
                </a>
                <button
                    type="button"
                    onClick={copy}
                    aria-label={t('pages.posts.shareCopy')}
                    className={buttonClass}
                >
                    {copied ? (
                        <Check className="size-4 text-brand-blue" />
                    ) : (
                        <Link2 className="size-4" />
                    )}
                </button>
                {copied && (
                    <span role="status" className="text-xs text-brand-blue">
                        {t('pages.posts.copied')}
                    </span>
                )}
            </div>
        </div>
    );
}
