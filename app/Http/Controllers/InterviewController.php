<?php

namespace App\Http\Controllers;

use App\Models\Interview;

class InterviewController extends PublicPostController
{
    protected function modelClass(): string
    {
        return Interview::class;
    }

    protected function indexComponent(): string
    {
        return 'interviews/index';
    }

    protected function showComponent(): string
    {
        return 'interviews/show';
    }

    protected function indexRouteName(): string
    {
        return 'interviews.index';
    }
}
