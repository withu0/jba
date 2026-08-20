import { ImageIcon, Upload, VideoIcon, X } from 'lucide-react';
import {
    useCallback,
    useId,
    useRef,
    useState
    
    
} from 'react';
import type {ChangeEvent, DragEvent} from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

type Props = {
    id?: string;
    name: string;
    accept?: string;
    required?: boolean;
    className?: string;
    hint?: string;
    /** Existing remote preview (edit screens). */
    existingUrl?: string | null;
    /** Prefer video chrome when accept includes video. */
    kind?: 'image' | 'video' | 'auto';
};

function isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
}

function isVideoFile(file: File): boolean {
    return file.type.startsWith('video/');
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileDropzone({
    id,
    name,
    accept,
    required = false,
    className,
    hint,
    existingUrl = null,
    kind = 'auto',
}: Props) {
    const { t } = useTranslation();
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const resolvedKind =
        kind !== 'auto'
            ? kind
            : accept?.includes('video')
              ? 'video'
              : 'image';

    const clearPreview = useCallback(() => {
        setPreviewUrl((current) => {
            if (current?.startsWith('blob:')) {
                URL.revokeObjectURL(current);
            }

            return null;
        });
    }, []);

    const assignFile = useCallback(
        (next: File | null) => {
            clearPreview();
            setFile(next);

            if (!next) {
                if (inputRef.current) {
                    inputRef.current.value = '';
                }

                return;
            }

            if (isImageFile(next) || isVideoFile(next)) {
                setPreviewUrl(URL.createObjectURL(next));
            }

            if (inputRef.current) {
                const transfer = new DataTransfer();
                transfer.items.add(next);
                inputRef.current.files = transfer.files;
            }
        },
        [clearPreview],
    );

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const next = event.target.files?.[0] ?? null;
        assignFile(next);
    };

    const onDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const next = event.dataTransfer.files?.[0] ?? null;

        if (next) {
            assignFile(next);
        }
    };

    const displayPreview = previewUrl ?? existingUrl;
    const showImagePreview =
        displayPreview &&
        (file ? isImageFile(file) : resolvedKind === 'image');
    const showVideoPreview =
        displayPreview &&
        (file ? isVideoFile(file) : resolvedKind === 'video');

    return (
        <div className={cn('space-y-2', className)}>
            <input
                ref={inputRef}
                id={inputId}
                type="file"
                name={name}
                accept={accept}
                required={required && !existingUrl}
                className="sr-only"
                onChange={onInputChange}
            />

            <label
                htmlFor={inputId}
                onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                }}
                onDrop={onDrop}
                className={cn(
                    'group relative flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-dashed border-border bg-muted/20 px-4 py-6 text-center transition-colors',
                    'hover:border-brand-blue/50 hover:bg-muted/40',
                    'focus-within:border-ring focus-within:ring-ring/40 focus-within:ring-[3px]',
                    isDragging && 'border-brand-blue bg-brand-blue/5',
                )}
            >
                {showImagePreview ? (
                    <img
                        src={displayPreview}
                        alt=""
                        className="max-h-40 w-full max-w-xs object-contain"
                    />
                ) : showVideoPreview ? (
                    <video
                        src={displayPreview}
                        controls
                        className="max-h-40 w-full max-w-md border border-border"
                        onClick={(event) => event.stopPropagation()}
                    />
                ) : (
                    <>
                        <span className="flex size-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-xs">
                            {resolvedKind === 'video' ? (
                                <VideoIcon className="size-5" />
                            ) : (
                                <ImageIcon className="size-5" />
                            )}
                        </span>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-ink">
                                <span className="inline-flex items-center gap-1.5 text-brand-blue">
                                    <Upload className="size-3.5" />
                                    {t('admin.fileDrop.browse')}
                                </span>{' '}
                                <span className="text-muted-foreground">
                                    {t('admin.fileDrop.orDrop')}
                                </span>
                            </p>
                            {hint && (
                                <p className="text-xs text-muted-foreground">
                                    {hint}
                                </p>
                            )}
                        </div>
                    </>
                )}

                {file && (
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 border-t border-border/70 bg-background/90 px-3 py-2 text-left backdrop-blur-sm">
                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-ink">
                                {file.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                                {formatBytes(file.size)}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-ink"
                            aria-label={t('admin.fileDrop.clear')}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                assignFile(null);
                            }}
                        >
                            <X className="size-3.5" />
                        </button>
                    </div>
                )}
            </label>

            {!file && existingUrl && hint && (
                <p className="text-xs text-muted-foreground">{hint}</p>
            )}
        </div>
    );
}
