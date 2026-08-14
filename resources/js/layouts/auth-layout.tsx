import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';
import AuthLayoutTemplate from '@/layouts/auth/auth-brand-layout';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    const { t, i18n } = useTranslation();
    const resolvedTitle = i18n.exists(title) ? t(title) : title;
    const resolvedDescription = i18n.exists(description)
        ? t(description)
        : description;

    return (
        <div className="relative">
            <div className="absolute top-4 right-4 z-10">
                <LanguageSwitcher
                    variant="button"
                    className="lg:text-white lg:hover:bg-white/10 lg:hover:text-white"
                />
            </div>
            <AuthLayoutTemplate
                title={resolvedTitle}
                description={resolvedDescription}
            >
                {children}
            </AuthLayoutTemplate>
        </div>
    );
}
