import { Link } from '@inertiajs/react';
import { BookOpen, Clock3, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLogo from '@/components/app-logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import {
    index as lessonsIndex,
    history as lessonsHistory,
} from '@/routes/lessons';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { t } = useTranslation();

    const mainNavItems: NavItem[] = [
        {
            title: t('mypage.title'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: t('mypage.lessonsTitle'),
            href: lessonsIndex(),
            icon: BookOpen,
        },
        {
            title: t('mypage.historyTitle'),
            href: lessonsHistory(),
            icon: Clock3,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <div className="px-2 pb-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <LanguageSwitcher
                        variant="button"
                        className="w-full justify-start group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center"
                    />
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
