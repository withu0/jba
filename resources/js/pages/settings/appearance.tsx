import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('settings.appearanceSettings')} />

            <h1 className="sr-only">{t('settings.appearanceSettings')}</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('settings.appearanceSettings')}
                    description={t('settings.appearanceDescription')}
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'settings.appearanceSettings',
            href: editAppearance(),
        },
    ],
};
