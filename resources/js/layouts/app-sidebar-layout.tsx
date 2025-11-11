import { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { AppContent } from '@/components/app-content';
import { SidebarProvider, useSidebar } from '@/components/providers/sidebar-provider';
import { type BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

interface AppSidebarLayoutProps {
    children: ReactNode;
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

function SidebarLayoutContent({ children, title, breadcrumbs }: AppSidebarLayoutProps) {
    const { isCollapsed } = useSidebar();

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <AppSidebar />

                {/* Main Content dengan padding dinamis */}
                <div className={cn(
                    "flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
                    // Padding dinamis berdasarkan state sidebar
                    !isCollapsed && "lg:ml-[16rem]", // Sidebar terbuka (16rem = 256px)
                    isCollapsed && "lg:ml-[3rem]", // Sidebar tertutup (3rem = 48px)
                    "ml-0" // Mobile tanpa sidebar
                )}>
                    {/* Header */}
                    <AppHeader breadcrumbs={breadcrumbs} />
                    <AppContent variant="sidebar">
                        {children}
                    </AppContent>
                </div>
            </div>

            <Toaster />
        </>
    );
}

export default function AppSidebarLayout({ children, title, breadcrumbs }: AppSidebarLayoutProps) {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background">
                <SidebarLayoutContent title={title} breadcrumbs={breadcrumbs}>
                    {children}
                </SidebarLayoutContent>
            </div>
        </SidebarProvider>
    );
}
