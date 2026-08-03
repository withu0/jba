export type WelcomeBookLocale = 'en' | 'ja';

function mangaPageList(localeFolder: 'en' | 'jp'): string[] {
    const base = `/manga/${localeFolder}`;

    return [
        `${base}/cover.jpg`,
        `${base}/02.jpg`,
        `${base}/03.jpg`,
        `${base}/04.jpg`,
        `${base}/05.jpg`,
        `${base}/06.jpg`,
        `${base}/07.jpg`,
        `${base}/08.jpg`,
        `${base}/09.jpg`,
        `${base}/10.jpg`,
        `${base}/11.jpg`,
    ];
}

export const welcomeBookPages: Record<WelcomeBookLocale, string[]> = {
    en: mangaPageList('en'),
    ja: mangaPageList('jp'),
};

export function resolveWelcomeBookPages(locale?: string): string[] {
    if (locale === 'ja') {
        return welcomeBookPages.ja;
    }

    return welcomeBookPages.en;
}
