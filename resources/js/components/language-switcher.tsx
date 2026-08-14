import { router, usePage } from '@inertiajs/react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Locale } from '@/i18n';
import { localeLabels, supportedLocales } from '@/i18n';
import { switchMethod } from '@/routes/locale';

type Props = {
    className?: string;
    variant?: 'icon' | 'button';
};

export function LanguageSwitcher({ className, variant = 'icon' }: Props) {
    const { t } = useTranslation();
    const { locale } = usePage().props;
    const currentLocale = (locale as Locale) || 'ja';

    const switchLocale = (next: Locale) => {
        if (next === currentLocale) {
            return;
        }

        router.post(
            switchMethod.url({ locale: next }),
            {},
            {
                preserveScroll: true,
                preserveState: false,
            },
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {variant === 'button' ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className={className}
                        aria-label={t('common.language')}
                    >
                        <Languages className="mr-1.5 h-4 w-4" />
                        {localeLabels[currentLocale]}
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={className ?? 'h-9 w-9'}
                        aria-label={t('common.language')}
                    >
                        <Languages className="h-4 w-4" />
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {supportedLocales.map((code) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => switchLocale(code)}
                        className={
                            code === currentLocale
                                ? 'bg-accent font-medium'
                                : undefined
                        }
                    >
                        {localeLabels[code]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
