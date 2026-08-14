import { Link, usePage } from '@inertiajs/react';
import { Menu, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '@/components/brand-mark';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import {
    about,
    beforeAfter,
    contraindications,
    counseling,
    dashboard,
    home,
    login,
    register,
} from '@/routes';
import { index as interviews } from '@/routes/interviews';
import { index as manga } from '@/routes/manga';
import { index as news } from '@/routes/news';

type NavLink = {
    key: string;
    href: string;
};

const navLinks: NavLink[] = [
    { key: 'about', href: about.url() },
    { key: 'news', href: news.url() },
    { key: 'interviews', href: interviews.url() },
    { key: 'beforeAfter', href: beforeAfter.url() },
    { key: 'manga', href: manga.url() },
    { key: 'counseling', href: counseling.url() },
];

function NavAnchor({
    href,
    label,
    overlay,
    onNavigate,
}: {
    href: string;
    label: string;
    overlay: boolean;
    onNavigate?: () => void;
}) {
    const { isCurrentUrl } = useCurrentUrl();
    const active = isCurrentUrl(href);

    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={cn(
                'relative px-3 py-2 text-sm whitespace-nowrap transition-colors duration-300',
                'after:absolute after:right-3 after:bottom-1 after:left-3 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out',
                'hover:after:scale-x-100 focus-visible:outline-none focus-visible:after:scale-x-100',
                overlay
                    ? 'text-white/80 after:bg-white hover:text-white focus-visible:text-white'
                    : 'text-foreground/75 after:bg-ink hover:text-foreground focus-visible:text-foreground',
                active && 'font-medium after:scale-x-100',
                active && (overlay ? 'text-white' : 'text-foreground'),
            )}
        >
            {label}
        </Link>
    );
}

export function PublicHeader() {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const close = () => setOpen(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Every public page opens with a dark image hero, so the bar floats over it
    // until the reader scrolls past the fold.
    const overlay = !scrolled;

    return (
        <header
            className={cn(
                'fixed top-0 right-0 left-0 z-40 transition-all duration-500',
                overlay
                    ? 'border-b border-white/10 bg-transparent'
                    : 'shadow-soft border-b border-border bg-background/92 backdrop-blur-md',
            )}
        >
            <div
                className={cn(
                    'mx-auto flex max-w-7xl items-center gap-3 px-4 transition-all duration-500 md:px-6',
                    overlay ? 'py-5' : 'py-3',
                )}
            >
                <div className="lg:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={t('common.navigationMenu')}
                                className={cn(
                                    'size-9',
                                    overlay &&
                                        'text-white hover:bg-white/10 hover:text-white',
                                )}
                            >
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="flex w-80 flex-col gap-8 bg-background"
                        >
                            <SheetHeader className="text-left">
                                <SheetTitle className="sr-only">
                                    {t('common.navigationMenu')}
                                </SheetTitle>
                                <BrandMark compact />
                            </SheetHeader>
                            <nav className="flex flex-col divide-y divide-border border-y border-border">
                                {[
                                    { key: 'home', href: home.url() },
                                    ...navLinks,
                                    {
                                        key: 'contraindications',
                                        href: contraindications.url(),
                                    },
                                ].map((link) => (
                                    <Link
                                        key={link.key}
                                        href={link.href}
                                        onClick={close}
                                        className="py-3.5 font-serif text-base font-bold text-ink transition-colors hover:text-brand-blue"
                                    >
                                        {t(`nav.${link.key}`)}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-auto flex flex-col gap-2.5">
                                {auth.user ? (
                                    <Button asChild className="rounded-md">
                                        <Link
                                            href={dashboard()}
                                            onClick={close}
                                        >
                                            {t('nav.myPage')}
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="rounded-md"
                                        >
                                            <Link
                                                href={login()}
                                                onClick={close}
                                            >
                                                {t('nav.logIn')}
                                            </Link>
                                        </Button>
                                        <Button asChild className="rounded-md">
                                            <Link
                                                href={register()}
                                                onClick={close}
                                            >
                                                {t('nav.register')}
                                            </Link>
                                        </Button>
                                    </>
                                )}
                                <LanguageSwitcher
                                    variant="button"
                                    className="mt-1 justify-start"
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <BrandMark
                    className="shrink-0"
                    compact={!overlay}
                    variant={overlay ? 'white' : 'black'}
                />

                <nav className="ml-6 hidden min-w-0 flex-1 items-center gap-0.5 lg:flex">
                    {navLinks.map((link) => (
                        <NavAnchor
                            key={link.key}
                            href={link.href}
                            label={t(`nav.${link.key}`)}
                            overlay={overlay}
                        />
                    ))}
                </nav>

                <div className="ml-auto flex shrink-0 items-center gap-1.5">
                    <LanguageSwitcher
                        variant="icon"
                        className={cn(
                            'hidden size-9 lg:inline-flex',
                            overlay &&
                                'text-white hover:bg-white/10 hover:text-white',
                        )}
                    />

                    {auth.user ? (
                        <Button
                            asChild
                            size="sm"
                            variant={overlay ? 'outline' : 'default'}
                            className={cn(
                                'rounded-md',
                                overlay &&
                                    'border-white/50 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white',
                            )}
                        >
                            <Link href={dashboard()}>
                                <UserRound aria-hidden className="size-4" />
                                <span className="hidden sm:inline">
                                    {t('nav.myPage')}
                                </span>
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                size="sm"
                                variant="ghost"
                                className={cn(
                                    'hidden rounded-md sm:inline-flex',
                                    overlay &&
                                        'text-white hover:bg-white/10 hover:text-white',
                                )}
                            >
                                <Link href={login()}>{t('nav.logIn')}</Link>
                            </Button>
                            <Button
                                asChild
                                size="sm"
                                className={cn(
                                    'rounded-md',
                                    overlay &&
                                        'bg-white text-brand-blue hover:bg-white/90',
                                )}
                            >
                                <Link href={register()}>
                                    {t('nav.register')}
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
