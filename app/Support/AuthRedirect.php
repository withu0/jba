<?php

namespace App\Support;

use Illuminate\Http\Request;

class AuthRedirect
{
    /**
     * Drop an intended URL that belongs to the other role.
     *
     * Both logins share one session key. A guest who opens an admin page
     * stores that URL, and the next member login would follow it.
     */
    public static function sanitizeIntendedUrl(Request $request, string $area): void
    {
        $intended = $request->session()->get('url.intended');

        if (! is_string($intended) || self::belongsToOtherArea($intended, $area)) {
            $request->session()->forget('url.intended');
        }
    }

    private static function belongsToOtherArea(string $url, string $area): bool
    {
        $path = parse_url($url, PHP_URL_PATH);
        $path = is_string($path) && $path !== '' ? $path : '/';
        $isAdmin = $path === '/admin' || str_starts_with($path, '/admin/');

        if ($area === 'admin') {
            return ! $isAdmin || $path === '/admin/login';
        }

        return $isAdmin;
    }
}
