import { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { AppSidebar } from '@/components/app-sidebar';
import { Topbar } from '@/components/topbar';
import { PageHeader } from '@/components/page-header';
import { SidebarProvider, useSidebar } from '@/components/providers/sidebar-provider';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import { type BreadcrumbItem } from '@/types';

interface AuthenticatedLayoutProps {
    children: ReactNode;
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

function AuthenticatedLayoutContent({ 
    children, 
    title, 
    breadcrumbs = [] 
}: AuthenticatedLayoutProps) {
    // Use flash messages hook to show notifications
    useFlashMessages();
    
    // Safely get sidebar context
    let isCollapsed = false;
    
    try {
        const sidebarContext = useSidebar();
        isCollapsed = sidebarContext.isCollapsed;
    } catch (error) {
        console.warn('AuthenticatedLayout: useSidebar hook failed, using default values:', error);
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title={title} />

            {/* Sidebar - Fixed Position */}
            <AppSidebar />

            {/* Content Wrapper - Flex-1 dengan flex flex-col */}
            <div 
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
                style={{
                    marginLeft: isCollapsed ? '4rem' : '16rem',
                }}
            >
                {/* Topbar */}
                <Topbar />

                {/* Page Header dengan Sidebar Toggle dan Breadcrumbs */}
                <PageHeader title={title} breadcrumbs={breadcrumbs} />

                {/* Main Content - Flex-1 dengan overflow */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}

export default function AuthenticatedLayout(props: AuthenticatedLayoutProps) {
    return (
        <SidebarProvider>
            <AuthenticatedLayoutContent {...props} />
        </SidebarProvider>
    );
}