import { Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Contact,
    FileText,
    FolderTree,
    Images,
    LayoutGrid,
    Library,
    LogOut,
    MessagesSquare,
    Newspaper,
    Video,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLogo from '@/components/app-logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, logout } from '@/routes/admin';
import { index as adminBeforeAfter } from '@/routes/admin/before-after';
import { index as adminContacts } from '@/routes/admin/contacts';
import { index as adminInterviews } from '@/routes/admin/interviews';
import { index as adminLessonCategories } from '@/routes/admin/lesson-categories';
import { index as adminLessons } from '@/routes/admin/lessons';
import { index as adminManga } from '@/routes/admin/manga';
import { index as adminMangaCategories } from '@/routes/admin/manga-categories';
import { index as adminNews } from '@/routes/admin/news';
import { index as adminPages } from '@/routes/admin/pages';
import type { NavItem } from '@/types';

export function AdminSidebar() {
    const { t } = useTranslation();
    const { auth } = usePage().props;

    const mainNavItems: NavItem[] = [
        {
            title: t('admin.nav.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: t('admin.nav.lessons'),
            href: adminLessons(),
            icon: Video,
        },
        {
            title: t('admin.nav.lessonCategories'),
            href: adminLessonCategories(),
            icon: FolderTree,
        },
        {
            title: t('admin.nav.news'),
            href: adminNews(),
            icon: Newspaper,
        },
        {
            title: t('admin.nav.interviews'),
            href: adminInterviews(),
            icon: MessagesSquare,
        },
        {
            title: t('admin.nav.beforeAfter'),
            href: adminBeforeAfter(),
            icon: Images,
        },
        {
            title: t('admin.nav.manga'),
            href: adminManga(),
            icon: BookOpen,
        },
        {
            title: t('admin.nav.mangaCategories'),
            href: adminMangaCategories(),
            icon: Library,
        },
        {
            title: t('admin.nav.pages'),
            href: adminPages(),
            icon: FileText,
        },
        {
            title: t('admin.nav.contacts'),
            href: adminContacts(),
            icon: Contact,
        },
    ];

    const handleLogout = () => {
        router.flushAll();
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                                <div className="ml-1 grid flex-1 text-left text-sm group-data-[collapsible=icon]:hidden">
                                    <span className="truncate leading-tight font-semibold">
                                        {t('admin.shellTitle')}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        CMS
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label={t('admin.navLabel')} />
            </SidebarContent>

            <SidebarFooter>
                <div className="px-2 pb-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <LanguageSwitcher
                        variant="button"
                        className="w-full justify-start group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center"
                    />
                </div>
                {auth.admin && (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="mb-1 truncate px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                                {auth.admin.email}
                            </div>
                            <SidebarMenuButton
                                asChild
                                tooltip={t('nav.logOut')}
                            >
                                <Link
                                    href={logout()}
                                    method="post"
                                    as="button"
                                    onClick={handleLogout}
                                    data-test="admin-logout-button"
                                >
                                    <LogOut />
                                    <span>{t('nav.logOut')}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
