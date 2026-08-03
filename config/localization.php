<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Supported Locales
    |--------------------------------------------------------------------------
    |
    | Japanese is the primary language. English and Chinese are also supported.
    |
    */

    'supported' => ['ja', 'en', 'zh'],

    'default' => env('APP_LOCALE', 'ja'),

    'cookie' => 'locale',

    'cookie_lifetime_minutes' => 60 * 24 * 365,

];
