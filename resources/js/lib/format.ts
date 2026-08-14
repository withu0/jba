export function formatDate(
    value: string | null | undefined,
    locale: string,
): string {
    if (!value) {
        return '';
    }

    try {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(value));
    } catch {
        return value;
    }
}

/** Compact numeric stamp (2026.08.14) used on editorial cards. */
export function formatDateStamp(value: string | null | undefined): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${date.getFullYear()}.${month}.${day}`;
}
