import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { SeoHead } from '@/components/seo-head';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
            <SeoHead />
            <PublicHeader />
            <main className="flex-1">{children}</main>
            <PublicFooter />
        </div>
    );
}
