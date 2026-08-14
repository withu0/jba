import type { Auth } from '@/types/auth';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            locale: string;
            availableLocales: string[];
            auth: Auth;
            sidebarOpen: boolean;
            seo: {
                title: string;
                description: string;
                image: string;
                url: string;
                type: string;
                siteName: string;
                locale: string;
                alternateLocales: string[];
                publishedAt: string | null;
                robots: string;
            };
            [key: string]: unknown;
        };
    }
}
