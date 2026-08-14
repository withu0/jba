import { Form } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ContactController from '@/actions/App/Http/Controllers/ContactController';
import InputError from '@/components/input-error';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

export function ContactForm() {
    const { t } = useTranslation();

    return (
        <section
            id="contact"
            className="shadow-soft scroll-mt-28 rounded-md border border-border bg-background p-7 sm:p-10"
        >
            <SectionHeading
                eyebrow={t('pages.counseling.formEyebrow')}
                title={t('contact.title')}
                lead={t('contact.lead')}
                as="h2"
            />

            <Form
                {...ContactController.store.form()}
                options={{ preserveScroll: true }}
                resetOnSuccess
                className="mt-10 space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                        >
                            <Label htmlFor="contact-website">
                                {t('contact.website')}
                            </Label>
                            <Input
                                id="contact-website"
                                name="website"
                                type="text"
                                tabIndex={-1}
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="grid gap-2.5">
                                <Label
                                    htmlFor="contact-name"
                                    className="text-tracking-label text-[0.6875rem] text-muted-foreground uppercase"
                                >
                                    {t('contact.name')}
                                </Label>
                                <Input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    maxLength={120}
                                    className="h-11 rounded-md border-border bg-surface"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2.5">
                                <Label
                                    htmlFor="contact-email"
                                    className="text-tracking-label text-[0.6875rem] text-muted-foreground uppercase"
                                >
                                    {t('contact.email')}
                                </Label>
                                <Input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    maxLength={255}
                                    className="h-11 rounded-md border-border bg-surface"
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>

                        <div className="grid gap-2.5">
                            <Label
                                htmlFor="contact-subject"
                                className="text-tracking-label text-[0.6875rem] text-muted-foreground uppercase"
                            >
                                {t('contact.subject')}
                                <span className="ml-1.5 normal-case">
                                    ({t('contact.optional')})
                                </span>
                            </Label>
                            <Input
                                id="contact-subject"
                                name="subject"
                                type="text"
                                maxLength={200}
                                className="h-11 rounded-md border-border bg-surface"
                            />
                            <InputError message={errors.subject} />
                        </div>

                        <div className="grid gap-2.5">
                            <Label
                                htmlFor="contact-body"
                                className="text-tracking-label text-[0.6875rem] text-muted-foreground uppercase"
                            >
                                {t('contact.message')}
                            </Label>
                            <Textarea
                                id="contact-body"
                                name="body"
                                required
                                rows={7}
                                maxLength={5000}
                                className="min-h-40 rounded-md border-border bg-surface leading-relaxed"
                            />
                            <InputError message={errors.body} />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            disabled={processing}
                            className="rounded-md px-8"
                        >
                            {processing ? (
                                <Spinner />
                            ) : (
                                <Send aria-hidden className="size-4" />
                            )}
                            {t('contact.submit')}
                        </Button>
                    </>
                )}
            </Form>
        </section>
    );
}
