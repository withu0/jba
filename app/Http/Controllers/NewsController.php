<?php

namespace App\Http\Controllers;

use App\Models\News;

class NewsController extends PublicPostController
{
    protected function modelClass(): string
    {
        return News::class;
    }

    protected function indexComponent(): string
    {
        return 'news/index';
    }

    protected function showComponent(): string
    {
        return 'news/show';
    }

    protected function indexRouteName(): string
    {
        return 'news.index';
    }
}
