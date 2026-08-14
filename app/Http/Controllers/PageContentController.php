<?php

namespace App\Http\Controllers;

use App\Models\PageContent;
use App\Support\Seo;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class PageContentController extends Controller
{
    /**
     * Display a public CMS page for the current locale.
     */
    public function show(string $key): Response
    {
        if (! in_array($key, PageContent::KEYS, true)) {
            throw new NotFoundHttpException;
        }

        $page = PageContent::query()
            ->with('translations')
            ->where('key', $key)
            ->firstOrFail();

        $translation = $page->translationFor();

        if ($translation === null) {
            throw new NotFoundHttpException;
        }

        return Inertia::render('static-page', [
            'pageKey' => $page->key,
            'title' => $translation->title,
            'body' => $translation->body ?? '',
            'seo' => Seo::make(
                $translation->title,
                filled($translation->body)
                    ? $translation->body
                    : (string) __('seo.'.$page->key.'_description'),
            ),
        ]);
    }
}
