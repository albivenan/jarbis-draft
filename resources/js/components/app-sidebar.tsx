import React from 'react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { NavFooter } from '@/components/nav-footer';
import { getMenuItems, type NavItem } from '@/config/sidebar-menu';
import { Link, usePage } from '@inertiajs/react';
import { useSidebar } from '@/components/providers/sidebar-provider';
import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const page = usePage();
    
    // Safely get sidebar context
    let isCollapsed = false;
    
    try {
        const sidebarContext = useSidebar();
        isCollapsed = sidebarContext.isCollapsed;
    } catch (error) {
        console.warn('AppSidebar: useSidebar hook failed, using default values:', error);
    }
    
    const rawRole = (page.props as any)?.auth?.user?.role ?? 'crew_besi';
    const role = typeof rawRole === 'string' ? rawRole.trim().toLowerCase() : 'crew_besi';

    // Role home mapping - Updated to match exact seeder role names
    const roleHomeMap: Record<string, string> = {
        'direktur': '/roles/direktur',
        'manajer_hrd': '/roles/manajer-hrd',
        'staf_hrd': '/roles/staf-hrd',
        'manajer_keuangan': '/roles/manajer-keuangan',
        'staf_keuangan': '/roles/staf-keuangan',
        'manajer_ppic': '/roles/manajer-ppic',
        'staf_ppic': '/roles/staf-ppic',
        'manajer_marketing': '/roles/manajer-marketing',
        'staf_marketing': '/roles/staf-marketing',
        'manajer_produksi_kayu': '/roles/manajer-produksi-kayu',
        'supervisor_kayu': '/roles/supervisor-kayu',
        'qc_kayu': '/roles/qc-kayu',
        'crew_kayu': '/roles/crew-kayu',
        'manajer_produksi_besi': '/roles/manajer-produksi-besi',
        'supervisor_besi': '/roles/supervisor-besi',
        'qc_besi': '/roles/qc-besi',
        'crew_besi': '/roles/crew-besi',
        'software_engineer': '/roles/software-engineer',
    };

    const roleHome = roleHomeMap[role] || '/login';
    const menuItems = getMenuItems(role);

    return (
        <div 
            className={cn(
                "fixed left-0 top-0 z-30 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Flexbox Container untuk sticky footer */}
            <div className="flex h-full flex-col">
                {/* Sidebar Header */}
                <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
                    <Link 
                        href={roleHome} 
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <AppLogo />
                        {!isCollapsed && (
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    PT Jarbis
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Manufacturing
                                </p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Sidebar Content - Flex-1 untuk mengisi ruang yang tersedia */}
                <div className="flex-1 overflow-y-auto">
                    <NavMain items={menuItems} isCollapsed={isCollapsed} />
                </div>

                {/* Sidebar Footer - Sticky di bawah */}
                <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    {!isCollapsed && (
                        <div className="p-3">
                            <NavFooter items={footerNavItems} />
                        </div>
                    )}
                    <div className="p-3">
                        <NavUser />
                    </div>
                </div>
            </div>
        </div>
    );
}