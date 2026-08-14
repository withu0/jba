<?php

namespace App\Support;

use Illuminate\Support\Str;

class Seo
{
    /**
     * @param  array{publishedAt?: string|null, robots?: string}  $extra
     * @return array{
     *     title: string,
     *     description: string,
     *     image: string,
     *     url: string,
     *     type: string,
     *     siteName: string,
     *     locale: string,
     *     alternateLocales: list<string>,
     *     publishedAt: string|null,
     *     robots: string
     * }
     */
    public static function make(
        ?string $title = null,
        ?string $description = null,
        ?string $image = null,
        string $type = 'website',
        ?string $url = null,
        array $extra = [],
    ): array {
        $siteName = (string) __('seo.site_name');
        $resolvedTitle = filled($title) ? $title : $siteName;
        $resolvedDescription = filled($description)
            ? self::excerpt($description)
            : (string) __('seo.default_description');

        $locale = app()->getLocale();
        $ogLocales = self::ogLocales();

        $alternates = [];

        foreach (config('localization.supported', ['ja', 'en', 'zh']) as $code) {
            if ($code !== $locale) {
                $alternates[] = $ogLocales[$code] ?? $code;
            }
        }

        return [
            'title' => $resolvedTitle,
            'description' => $resolvedDescription,
            'image' => self::absolute($image) ?? self::defaultImage(),
            'url' => $url ?? url()->current(),
            'type' => $type,
            'siteName' => $siteName,
            'locale' => $ogLocales[$locale] ?? $locale,
            'alternateLocales' => $alternates,
            'publishedAt' => $extra['publishedAt'] ?? null,
            'robots' => $extra['robots'] ?? 'index, follow',
        ];
    }

    /**
     * @return array{
     *     title: string,
     *     description: string,
     *     image: string,
     *     url: string,
     *     type: string,
     *     siteName: string,
     *     locale: string,
     *     alternateLocales: list<string>,
     *     publishedAt: string|null,
     *     robots: string
     * }
     */
    public static function forRoute(?string $name = null): array
    {
        $name ??= request()->route()?->getName();

        $public = match ($name) {
            'home' => self::make(__('seo.home_title'), __('seo.home_description')),
            'about' => self::make(__('seo.about_title'), __('seo.about_description')),
            'news.index' => self::make(__('seo.news_title'), __('seo.news_description')),
            'interviews.index' => self::make(__('seo.interviews_title'), __('seo.interviews_description')),
            'counseling', 'contact' => self::make(__('seo.counseling_title'), __('seo.counseling_description')),
            'before-after' => self::make(__('seo.before_after_title'), __('seo.before_after_description')),
            'contraindications' => self::make(__('seo.contraindications_title'), __('seo.contraindications_description')),
            'manga.index' => self::make(__('seo.manga_title'), __('seo.manga_description')),
            default => null,
        };

        if ($public !== null) {
            return $public;
        }

        if (is_string($name) && (str_starts_with($name, 'news.') || str_starts_with($name, 'interviews.'))) {
            return self::make();
        }

        return self::make(extra: ['robots' => 'noindex, nofollow']);
    }

    public static function excerpt(?string $text, int $limit = 160): string
    {
        $plain = trim((string) preg_replace('/\s+/u', ' ', strip_tags((string) $text)));

        return Str::limit($plain, $limit, '…');
    }

    public static function defaultImage(): string
    {
        return asset((string) config('seo.default_image', 'images/og-default.png'));
    }

    public static function absolute(?string $path): ?string
    {
        if (! filled($path)) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return url($path);
    }

    /**
     * @return array<string, string>
     */
    public static function ogLocales(): array
    {
        return [
            'ja' => 'ja_JP',
            'en' => 'en_US',
            'zh' => 'zh_CN',
        ];
    }
}
