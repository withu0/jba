<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;

class PageContentSeeder extends Seeder
{
    /**
     * Seed fixed CMS pages (about / counseling / contraindications) with ja/en/zh copy.
     */
    public function run(): void
    {
        /** @var array<string, array<string, array{title: string, body: string}>> $pages */
        $pages = require __DIR__.'/data/page_contents.php';

        foreach ($pages as $key => $locales) {
            $page = PageContent::query()->updateOrCreate(
                ['key' => $key],
                ['key' => $key],
            );

            foreach ($locales as $locale => $content) {
                $page->translations()->updateOrCreate(
                    ['locale' => $locale],
                    [
                        'title' => $content['title'],
                        'body' => $content['body'],
                    ],
                );
            }
        }
    }
}
