<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class LocaleController extends Controller
{
    /**
     * Switch the application locale and persist it in a cookie.
     */
    public function __invoke(Request $request, string $locale): RedirectResponse
    {
        $supported = config('localization.supported', ['ja', 'en', 'zh']);

        abort_unless(in_array($locale, $supported, true), 404);

        $minutes = config('localization.cookie_lifetime_minutes', 60 * 24 * 365);
        $cookieName = config('localization.cookie', 'locale');

        Cookie::queue(Cookie::make($cookieName, $locale, $minutes));

        return back();
    }
}
