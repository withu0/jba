<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use App\Models\News;
use App\Support\Seo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

abstract class PublicPostController extends Controller
{
    abstract protected function modelClass(): string;

    abstract protected function indexComponent(): string;

    abstract protected function showComponent(): string;

    abstract protected function indexRouteName(): string;

    /**
     * Paginated public list.
     */
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        /** @var class-string<Model> $class */
        $class = $this->modelClass();

        $posts = $class::query()
            ->published()
            ->with('translations')
            ->orderByDesc('published_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Model $post): array => $this->toListItem($post, $locale));

        return Inertia::render($this->indexComponent(), [
            'posts' => $posts,
        ]);
    }

    /**
     * Public detail by slug or id.
     */
    public function show(string $key): Response
    {
        $post = $this->findPublished($key);
        $translation = $post->translationFor();

        if ($translation === null) {
            throw new NotFoundHttpException;
        }

        return Inertia::render($this->showComponent(), [
            'post' => [
                'id' => $post->id,
                'slug' => $translation->slug,
                'title' => $translation->title,
                'excerpt' => $translation->excerpt,
                'body' => $translation->body ?? '',
                'published_at' => $post->published_at?->toIso8601String(),
                'featured_image_url' => $post->featured_image_url,
            ],
            'indexUrl' => route($this->indexRouteName()),
            'seo' => Seo::make(
                $translation->title,
                $translation->excerpt ?: $translation->body,
                $post->featured_image_url,
                'article',
                extra: [
                    'publishedAt' => $post->published_at?->toIso8601String(),
                ],
            ),
        ]);
    }

    protected function findPublished(string $key): News|Interview
    {
        /** @var class-string<News|Interview> $class */
        $class = $this->modelClass();
        $locale = app()->getLocale();

        $base = fn (): Builder => $class::query()->published()->with('translations');

        if (ctype_digit($key)) {
            $byId = $base()->whereKey((int) $key)->first();
            if ($byId !== null) {
                return $byId;
            }
        }

        $byLocaleSlug = $base()
            ->whereHas('translations', fn (Builder $q) => $q->where('locale', $locale)->where('slug', $key))
            ->first();

        if ($byLocaleSlug !== null) {
            return $byLocaleSlug;
        }

        $byAnySlug = $base()
            ->whereHas('translations', fn (Builder $q) => $q->where('slug', $key))
            ->first();

        if ($byAnySlug === null) {
            throw new NotFoundHttpException;
        }

        return $byAnySlug;
    }

    /**
     * @return array{id: int, slug: string, title: string, excerpt: ?string, published_at: ?string, featured_image_url: ?string}
     */
    protected function toListItem(Model $post, string $locale): array
    {
        /** @var News|Interview $post */
        $translation = $post->translationFor($locale);

        return [
            'id' => $post->id,
            'slug' => $translation?->slug ?? (string) $post->id,
            'title' => $translation?->title ?? '',
            'excerpt' => $translation?->excerpt,
            'published_at' => $post->published_at?->toIso8601String(),
            'featured_image_url' => $post->featured_image_url,
        ];
    }
}
