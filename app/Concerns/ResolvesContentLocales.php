<?php

namespace App\Concerns;

trait ResolvesContentLocales
{
    /**
     * Locales every translatable record must provide, in display order.
     *
     * The config repository is untyped, so the value is narrowed here once
     * instead of at each call site.
     *
     * @return list<string>
     */
    protected function supportedLocales(): array
    {
        $configured = config('localization.supported');

        if (! is_array($configured)) {
            return ['ja', 'en', 'zh'];
        }

        return array_values(array_filter($configured, is_string(...)));
    }
}
