<?php

namespace App\Http\Controllers;

use App\Models\BeforeAfter;
use Inertia\Inertia;
use Inertia\Response;

class BeforeAfterController extends Controller
{
    public function index(): Response
    {
        $pairs = BeforeAfter::query()
            ->published()
            ->with('translations')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function (BeforeAfter $pair): array {
                $translation = $pair->translationFor();

                return [
                    'id' => $pair->id,
                    'title' => $translation?->title ?? '',
                    'caption' => $translation?->caption,
                    'before_image_url' => $pair->before_image_url,
                    'after_image_url' => $pair->after_image_url,
                ];
            });

        return Inertia::render('before-after', [
            'pairs' => $pairs,
        ]);
    }
}
