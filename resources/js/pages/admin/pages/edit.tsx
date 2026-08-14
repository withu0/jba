import { Form, Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PageContentController from '@/actions/App/Http/Controllers/Admin/PageContentController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes/admin';
import { index as pagesIndex } from '@/routes/admin/pages';

type TranslationFields = {
    title: string;
    body: string;
};

type Props = {
    page: {
        id: number;
        key: string;
        translations: Record<string, TranslationFields>;
    };
    locales: string[];
};

const localeLabels: Record<string, string> = {
    ja: '日本語',
    en: 'English',
    zh: '中文',
};

export default function AdminPagesEdit({ page, locales }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.pages.editTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t(`admin.pages.keys.${page.key}`)}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.pages.editLead')}
                        </p>
                    </div>
                    <Link
                        href={pagesIndex()}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {t('admin.pages.backToList')}
                    </Link>
                </div>

                <Form
                    {...PageContentController.update.form(page.id)}
                    options={{ preserveScroll: true }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <>
                            {locales.map((locale) => {
                                const fields = page.translations[locale] ?? {
                                    title: '',
                                    body: '',
                                };
                                const titleError =
                                    errors[`translations.${locale}.title`];
                                const bodyError =
                                    errors[`translations.${locale}.body`];

                                return (
                                    <section
                                        key={locale}
                                        className="space-y-4 border border-border p-4 md:p-5"
                                    >
                                        <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
                                            {localeLabels[locale] ?? locale}
                                        </h2>

                                        <div className="grid gap-2">
                                            <Label htmlFor={`title-${locale}`}>
                                                {t('admin.pages.fieldTitle')}
                                            </Label>
                                            <Input
                                                id={`title-${locale}`}
                                                name={`translations[${locale}][title]`}
                                                defaultValue={fields.title}
                                                required
                                            />
                                            <InputError message={titleError} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor={`body-${locale}`}>
                                                {t('admin.pages.fieldBody')}
                                            </Label>
                                            <Textarea
                                                id={`body-${locale}`}
                                                name={`translations[${locale}][body]`}
                                                defaultValue={fields.body}
                                                rows={10}
                                                className="min-h-40"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                {t('admin.pages.bodyHint')}
                                            </p>
                                            <InputError message={bodyError} />
                                        </div>
                                    </section>
                                );
                            })}

                            <div className="flex items-center gap-3">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    data-test="admin-page-save"
                                >
                                    {processing && <Spinner />}
                                    {t('admin.pages.save')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminPagesEdit.layout = {
    breadcrumbs: [
        {
            title: 'admin.nav.dashboard',
            href: dashboard(),
        },
        {
            title: 'admin.nav.pages',
            href: pagesIndex(),
        },
    ],
};
