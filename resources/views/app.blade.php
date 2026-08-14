<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: #ffffff;
            }

            html.dark {
                background-color: #12181b;
            }
        </style>

        @php
            $seo = $page['props']['seo'] ?? [];
            $seoTitle = $seo['title'] ?? config('app.name', 'JBA');
            $seoDescription = $seo['description'] ?? '';
            $seoImage = $seo['image'] ?? asset('images/og-default.png');
            $seoUrl = $seo['url'] ?? url()->current();
            $seoType = $seo['type'] ?? 'website';
            $seoSiteName = $seo['siteName'] ?? 'JBA';
            $seoLocale = $seo['locale'] ?? 'ja_JP';
            $seoAlternates = $seo['alternateLocales'] ?? [];
            $seoRobots = $seo['robots'] ?? 'index, follow';
        @endphp

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <meta name="theme-color" content="#349CCA">
        <meta name="robots" content="{{ $seoRobots }}">
        <meta name="description" content="{{ $seoDescription }}">
        <link rel="canonical" href="{{ $seoUrl }}">
        <meta property="og:site_name" content="{{ $seoSiteName }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:image" content="{{ $seoImage }}">
        <meta property="og:url" content="{{ $seoUrl }}">
        <meta property="og:type" content="{{ $seoType }}">
        <meta property="og:locale" content="{{ $seoLocale }}">
        @foreach ($seoAlternates as $alternate)
            <meta property="og:locale:alternate" content="{{ $alternate }}">
        @endforeach
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImage }}">

        {{-- CJK Noto faces (unicode-range subsetting via Google CDN) --}}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&family=Noto+Sans+SC:wght@300;400;500&family=Noto+Serif+JP:wght@700&family=Noto+Serif+SC:wght@700&display=swap"
            rel="stylesheet"
        >

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $seoTitle }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
