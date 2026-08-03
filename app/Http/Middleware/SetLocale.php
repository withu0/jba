<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supported = config('localization.supported', ['ja', 'en', 'zh']);
        $default = config('localization.default', 'ja');
        $cookieName = config('localization.cookie', 'locale');

        $locale = $request->cookie($cookieName);

        if (! is_string($locale) || ! in_array($locale, $supported, true)) {
            $locale = $default;
        }

        App::setLocale($locale);

        return $next($request);
    }
}
