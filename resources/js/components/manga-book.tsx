import {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import HTMLFlipBook from 'react-pageflip';
import {
    ChevronLeft,
    ChevronRight,
    XIcon,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
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

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM_DESKTOP = 1.5;
const DEFAULT_ZOOM_MOBILE = 1.75;

const finePointerMql =
    typeof window === 'undefined'
        ? undefined
        : window.matchMedia('(pointer: fine)');

function finePointerSubscribe(callback: (event: MediaQueryListEvent) => void) {
    if (!finePointerMql) {
        return () => {};
    }

    finePointerMql.addEventListener('change', callback);

    return () => {
        finePointerMql.removeEventListener('change', callback);
    };
}

function getFinePointerSnapshot() {
    return finePointerMql?.matches ?? false;
}

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
                className="pointer-events-none block h-full max-h-full w-full max-w-full object-cover"
            />
        </div>
    );
});

function visiblePageIndexes(pageIndex: number, pageCount: number): number[] {
    if (pageIndex <= 0) {
        return [0];
    }

    if (pageIndex < pageCount - 1) {
        return [pageIndex, pageIndex + 1];
    }

    return [pageIndex];
}

type MangaBookProps = {
    pages: string[];
    className?: string;
};

export function MangaBook({ pages, className }: MangaBookProps) {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const hasFinePointer = useSyncExternalStore(
        finePointerSubscribe,
        getFinePointerSnapshot,
        () => false,
    );
    const bookRef = useRef<FlipBookHandle | null>(null);
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSignature, setPageSignature] = useState(() => pages.join('|'));
    const [zoomOpen, setZoomOpen] = useState(false);
    const [zoom, setZoom] = useState(DEFAULT_ZOOM_DESKTOP);
    const defaultZoom = isMobile ? DEFAULT_ZOOM_MOBILE : DEFAULT_ZOOM_DESKTOP;
    const nextSignature = pages.join('|');

    if (pageSignature !== nextSignature) {
        setPageSignature(nextSignature);
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
    const contentTotal = Math.max(pageCount - 1, 0);
    const isOnCover = pageIndex === 0;

    const displayPage = isOnCover
        ? 0
        : pageIndex > 0 && pageIndex < pageCount - 1
          ? Math.min(pageIndex + 1, contentTotal)
          : Math.min(pageIndex, contentTotal);

    const rightmostIndex =
        pageIndex > 0 && pageIndex < pageCount - 1 ? pageIndex + 1 : pageIndex;

    const canGoPrev = pageIndex > 0;
    const canGoNext = rightmostIndex < pageCount - 1;

    const zoomPages = useMemo(
        () => visiblePageIndexes(pageIndex, pageCount).map((i) => pages[i]),
        [pageIndex, pageCount, pages],
    );

    const zoomViewportRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<{
        pointerId: number;
        x: number;
        y: number;
        scrollLeft: number;
        scrollTop: number;
    } | null>(null);

    useEffect(() => {
        if (!zoomOpen) {
            setZoom(defaultZoom);
            dragRef.current = null;
        }
    }, [zoomOpen, defaultZoom]);

    const centerZoomView = useCallback(() => {
        const viewport = zoomViewportRef.current;

        if (!viewport) {
            return;
        }

        viewport.scrollLeft = Math.max(
            0,
            (viewport.scrollWidth - viewport.clientWidth) / 2,
        );
        viewport.scrollTop = Math.max(
            0,
            (viewport.scrollHeight - viewport.clientHeight) / 2,
        );
    }, []);

    useEffect(() => {
        if (!zoomOpen) {
            return;
        }

        const frame = window.requestAnimationFrame(() => {
            centerZoomView();
        });

        return () => window.cancelAnimationFrame(frame);
    }, [zoomOpen, zoom, zoomPages, centerZoomView]);

    const panToPointer = useCallback((clientX: number, clientY: number) => {
        const viewport = zoomViewportRef.current;

        if (!viewport) {
            return;
        }

        const maxScrollX = Math.max(
            0,
            viewport.scrollWidth - viewport.clientWidth,
        );
        const maxScrollY = Math.max(
            0,
            viewport.scrollHeight - viewport.clientHeight,
        );

        if (maxScrollX <= 0 && maxScrollY <= 0) {
            return;
        }

        const rect = viewport.getBoundingClientRect();
        const x =
            rect.width > 0
                ? Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
                : 0;
        const y =
            rect.height > 0
                ? Math.min(1, Math.max(0, (clientY - rect.top) / rect.height))
                : 0;

        viewport.scrollLeft = x * maxScrollX;
        viewport.scrollTop = y * maxScrollY;
    }, []);

    const onZoomPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (hasFinePointer || event.button !== 0) {
            return;
        }

        const viewport = zoomViewportRef.current;

        if (!viewport) {
            return;
        }

        dragRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            scrollLeft: viewport.scrollLeft,
            scrollTop: viewport.scrollTop,
        };
        viewport.setPointerCapture(event.pointerId);
    };

    const onZoomPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (hasFinePointer) {
            panToPointer(event.clientX, event.clientY);

            return;
        }

        const drag = dragRef.current;
        const viewport = zoomViewportRef.current;

        if (!drag || !viewport || drag.pointerId !== event.pointerId) {
            return;
        }

        event.preventDefault();
        viewport.scrollLeft = drag.scrollLeft - (event.clientX - drag.x);
        viewport.scrollTop = drag.scrollTop - (event.clientY - drag.y);
    };

    const onZoomPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (dragRef.current?.pointerId === event.pointerId) {
            dragRef.current = null;
        }
    };

    const zoomIn = () => {
        setZoom((value) =>
            Math.min(ZOOM_MAX, Number((value + ZOOM_STEP).toFixed(2))),
        );
    };

    const zoomOut = () => {
        setZoom((value) =>
            Math.max(ZOOM_MIN, Number((value - ZOOM_STEP).toFixed(2))),
        );
    };

    const controlButtonClass =
        'inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-40 sm:min-h-9 sm:min-w-0 sm:py-1.5';

    const readerButtonClass =
        'inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/12 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 sm:px-4';

    return (
        <div
            className={cn(
                'mx-auto flex w-full max-w-4xl flex-col items-center gap-6',
                className,
            )}
            aria-label={t('manga.bookLabel')}
        >
            <div className="flex w-full justify-center overflow-hidden py-2">
                {mounted ? (
                    <HTMLFlipBook
                        key={pageSignature}
                        ref={bookRef as never}
                        className="manga-flipbook shadow-2xl"
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
                                key={`${pageSignature}-${index}`}
                                src={src}
                                label={
                                    index === 0
                                        ? t('manga.coverLabel')
                                        : t('manga.pageLabel', {
                                              page: index,
                                              total: contentTotal,
                                          })
                                }
                            />
                        ))}
                    </HTMLFlipBook>
                ) : (
                    <div
                        className="aspect-3/4 w-full max-w-105 animate-pulse rounded-md bg-white/10"
                        aria-hidden
                    />
                )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-2 py-1.5 backdrop-blur-md">
                <button
                    type="button"
                    onClick={flipPrev}
                    disabled={!mounted || !canGoPrev}
                    className={readerButtonClass}
                >
                    <ChevronLeft className="size-4" aria-hidden />
                    <span className="hidden sm:inline">
                        {t('manga.prevPage')}
                    </span>
                </button>
                <span className="text-tracking-label min-w-20 text-center text-xs text-white/60">
                    {isOnCover
                        ? t('manga.coverLabel')
                        : `${displayPage} / ${contentTotal}`}
                </span>
                <button
                    type="button"
                    onClick={flipNext}
                    disabled={!mounted || !canGoNext}
                    className={readerButtonClass}
                >
                    <span className="hidden sm:inline">
                        {t('manga.nextPage')}
                    </span>
                    <ChevronRight className="size-4" aria-hidden />
                </button>
                <span aria-hidden className="mx-1 h-5 w-px bg-white/15" />
                <button
                    type="button"
                    onClick={() => setZoomOpen(true)}
                    disabled={!mounted}
                    className={readerButtonClass}
                >
                    <ZoomIn className="size-4" aria-hidden />
                    <span className="hidden sm:inline">
                        {t('manga.enlarge')}
                    </span>
                </button>
            </div>

            <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
                <DialogContent
                    aria-describedby={undefined}
                    className="fixed inset-0 top-0 left-0 z-50 flex h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-black p-0 shadow-none duration-200 sm:max-w-none [&_[data-slot=dialog-close]]:hidden"
                >
                    <DialogTitle className="sr-only">
                        {t('manga.enlargeTitle')}
                    </DialogTitle>

                    <div
                        ref={zoomViewportRef}
                        className={cn(
                            'zoom-pan-viewport absolute inset-0 overflow-auto overscroll-none',
                            hasFinePointer
                                ? 'cursor-crosshair'
                                : 'cursor-grab touch-none active:cursor-grabbing',
                        )}
                        onPointerDown={onZoomPointerDown}
                        onPointerMove={onZoomPointerMove}
                        onPointerUp={onZoomPointerUp}
                        onPointerCancel={onZoomPointerUp}
                    >
                        <div
                            className={cn(
                                'flex origin-top-left items-start justify-start gap-2',
                                !isMobile && zoomPages.length > 1
                                    ? 'flex-row'
                                    : 'flex-col',
                            )}
                            style={{
                                width: `${zoom * 100}%`,
                                minWidth: `${zoom * 100}%`,
                            }}
                        >
                            {zoomPages.map((src) => (
                                <img
                                    key={src}
                                    src={src}
                                    alt=""
                                    draggable={false}
                                    onLoad={centerZoomView}
                                    className="pointer-events-none block h-auto w-full max-w-none shrink-0 object-contain select-none"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pointer-events-none absolute inset-0 z-20">
                        <button
                            type="button"
                            onClick={() => setZoomOpen(false)}
                            className="pointer-events-auto absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] inline-flex size-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg hover:bg-white sm:size-11"
                            aria-label={t('manga.closeEnlarge')}
                        >
                            <XIcon className="size-6" />
                        </button>

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4">
                            <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full bg-black/60 px-2 py-1.5 text-white backdrop-blur-sm">
                                <button
                                    type="button"
                                    onClick={zoomOut}
                                    disabled={zoom <= ZOOM_MIN}
                                    className={controlButtonClass}
                                    aria-label={t('manga.zoomOut')}
                                >
                                    <ZoomOut
                                        className="size-5 sm:size-4"
                                        aria-hidden
                                    />
                                    <span className="hidden sm:inline">
                                        {t('manga.zoomOut')}
                                    </span>
                                </button>
                                <span className="min-w-12 px-1 text-center text-sm text-white/80">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <button
                                    type="button"
                                    onClick={zoomIn}
                                    disabled={zoom >= ZOOM_MAX}
                                    className={controlButtonClass}
                                    aria-label={t('manga.zoomIn')}
                                >
                                    <ZoomIn
                                        className="size-5 sm:size-4"
                                        aria-hidden
                                    />
                                    <span className="hidden sm:inline">
                                        {t('manga.zoomIn')}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setZoom(defaultZoom)}
                                    className={controlButtonClass}
                                >
                                    {t('manga.zoomReset')}
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
