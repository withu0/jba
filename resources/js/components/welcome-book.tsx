import {
    forwardRef,
    useCallback,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useTranslation } from 'react-i18next';
import { resolveWelcomeBookPages } from '@/data/welcome-book';
import { cn } from '@/lib/utils';

type FlipBookHandle = {
    pageFlip: () => {
        flipNext: () => void;
        flipPrev: () => void;
        getCurrentPageIndex: () => number;
        getPageCount: () => number;
    };
};

type BookPageProps = {
    src: string;
    label: string;
};

const emptySubscribe = () => () => {};

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(function BookPage(
    { src, label },
    ref,
) {
    return (
        <div
            ref={ref}
            className="h-full w-full overflow-hidden bg-[#f4efe6]"
            style={{ overflow: 'hidden' }}
        >
            <img
                src={src}
                alt={label}
                draggable={false}
                className="pointer-events-none block h-full w-full max-h-full max-w-full object-cover"
            />
        </div>
    );
});

export function WelcomeBook({ className }: { className?: string }) {
    const { t, i18n } = useTranslation();
    const pages = useMemo(
        () => resolveWelcomeBookPages(i18n.language),
        [i18n.language],
    );
    const bookRef = useRef<FlipBookHandle | null>(null);
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );
    const [pageIndex, setPageIndex] = useState(0);
    const [activeLocale, setActiveLocale] = useState(i18n.language);

    if (activeLocale !== i18n.language) {
        setActiveLocale(i18n.language);
        setPageIndex(0);
    }

    const onFlip = useCallback((event: { data: number }) => {
        setPageIndex(event.data);
    }, []);

    const flipPrev = () => {
        bookRef.current?.pageFlip()?.flipPrev();
    };

    const flipNext = () => {
        bookRef.current?.pageFlip()?.flipNext();
    };

    const pageCount = pages.length;
    // Cover is not counted in the page indicator (cover + 10 pages → total 10).
    const contentTotal = Math.max(pageCount - 1, 0);
    const isOnCover = pageIndex === 0;

    // Spreads report the left-page index; show the rightmost content page number.
    const displayPage = isOnCover
        ? 0
        : pageIndex > 0 && pageIndex < pageCount - 1
          ? Math.min(pageIndex + 1, contentTotal)
          : Math.min(pageIndex, contentTotal);

    const rightmostIndex =
        pageIndex > 0 && pageIndex < pageCount - 1
            ? pageIndex + 1
            : pageIndex;

    const canGoPrev = pageIndex > 0;
    const canGoNext = rightmostIndex < pageCount - 1;

    return (
        <div
            className={cn(
                'flex w-full max-w-4xl flex-col items-center gap-6',
                className,
            )}
            aria-label={t('welcome.bookLabel')}
        >
            <div className="flex w-full justify-center overflow-hidden py-2">
                {mounted ? (
                    <HTMLFlipBook
                        key={i18n.language}
                        ref={bookRef as never}
                        className="welcome-flipbook shadow-2xl"
                        style={{ overflow: 'hidden' }}
                        width={420}
                        height={560}
                        size="stretch"
                        minWidth={280}
                        maxWidth={520}
                        minHeight={373}
                        maxHeight={693}
                        drawShadow
                        flippingTime={1000}
                        usePortrait
                        startZIndex={0}
                        autoSize
                        maxShadowOpacity={0.6}
                        showCover
                        mobileScrollSupport={false}
                        clickEventForward
                        useMouseEvents
                        swipeDistance={30}
                        showPageCorners
                        disableFlipByClick={false}
                        startPage={0}
                        onFlip={onFlip as never}
                    >
                        {pages.map((src, index) => (
                            <BookPage
                                key={`${i18n.language}-${src}`}
                                src={src}
                                label={
                                    index === 0
                                        ? t('welcome.coverLabel')
                                        : t('welcome.pageLabel', {
                                              page: index,
                                              total: contentTotal,
                                          })
                                }
                            />
                        ))}
                    </HTMLFlipBook>
                ) : (
                    <div
                        className="aspect-3/4 w-full max-w-105 animate-pulse rounded-md bg-muted"
                        aria-hidden
                    />
                )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={flipPrev}
                    disabled={!mounted || !canGoPrev}
                    className="rounded-md border border-foreground/25 bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {t('welcome.prevPage')}
                </button>
                <span className="min-w-16 text-center text-sm text-muted-foreground">
                    {isOnCover
                        ? t('welcome.coverLabel')
                        : `${displayPage} / ${contentTotal}`}
                </span>
                <button
                    type="button"
                    onClick={flipNext}
                    disabled={!mounted || !canGoNext}
                    className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {t('welcome.nextPage')}
                </button>
            </div>
        </div>
    );
}
