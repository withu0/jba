import { useTranslation } from 'react-i18next';
import { Sparkle } from '@/components/sparkle-divider';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export type LightboxPair = {
    title: string;
    caption: string | null;
    beforeUrl: string | null;
    afterUrl: string | null;
};

type Props = {
    pair: LightboxPair | null;
    onClose: () => void;
};

export function BeforeAfterLightbox({ pair, onClose }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog
            open={pair !== null}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent className="max-h-[92dvh] overflow-y-auto border-white/10 bg-ink/95 p-0 text-white sm:max-w-5xl [&>button]:text-white/70 [&>button]:hover:text-white">
                {pair && (
                    <div className="px-5 pt-10 pb-8 sm:px-8">
                        <DialogTitle className="font-serif text-xl font-bold sm:text-2xl">
                            {pair.title}
                        </DialogTitle>
                        {pair.caption && (
                            <p className="mt-3 text-sm leading-relaxed text-white/70">
                                {pair.caption}
                            </p>
                        )}

                        <div className="mt-7 grid gap-4 sm:grid-cols-2">
                            {(
                                [
                                    ['before', pair.beforeUrl],
                                    ['after', pair.afterUrl],
                                ] as const
                            ).map(([side, url]) => (
                                <figure key={side}>
                                    <figcaption className="text-tracking-label mb-3 flex items-center gap-2 text-[0.6875rem] text-white/60 uppercase">
                                        {side === 'after' && (
                                            <Sparkle className="size-2.5" />
                                        )}
                                        {t(
                                            side === 'before'
                                                ? 'beforeAfter.beforeLabel'
                                                : 'beforeAfter.afterLabel',
                                        )}
                                    </figcaption>
                                    {url ? (
                                        <img
                                            src={url}
                                            alt={t(
                                                side === 'before'
                                                    ? 'beforeAfter.beforeAlt'
                                                    : 'beforeAfter.afterAlt',
                                                { title: pair.title },
                                            )}
                                            className="w-full rounded-md object-contain"
                                        />
                                    ) : (
                                        <div className="aspect-[4/5] rounded-md border border-dashed border-white/20" />
                                    )}
                                </figure>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
