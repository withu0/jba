import { createInertiaApp } from '@inertiajs/react';
import { LocaleSync } from '@/components/locale-sync';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import '@/i18n';
import AdminLayout from '@/layouts/admin-layout';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const publicPages = new Set([
    'home',
    'manga/index',
    'manga/show',
    'placeholder',
    'static-page',
    'news/index',
    'news/show',
    'interviews/index',
    'interviews/show',
    'before-after',
]);

createInertiaApp({
    title: (title) => {
        if (!title || title === appName) {
            return appName;
        }

        return title.includes(appName) ? title : `${title} - ${appName}`;
    },
    layout: (name) => {
        switch (true) {
            case publicPages.has(name):
                return PublicLayout;
            case name === 'admin/login':
                return AuthLayout;
            case name.startsWith('admin/'):
                return AdminLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app, { page }) {
        return (
            <TooltipProvider delayDuration={0}>
                <LocaleSync initialLocale={page.props.locale} />
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#349CCA',
    },
});

// This will set light / dark mode on load...
initializeTheme();
