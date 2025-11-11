import { useSidebar } from '@/components/providers/sidebar-provider';
import { Breadcrumb } from '@/components/breadcrumb';
import { type BreadcrumbItem } from '@/types';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface PageHeaderProps {
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export function PageHeader({ title, breadcrumbs = [] }: PageHeaderProps) {
    // Safely get sidebar context
    let isCollapsed = false;
    let toggleSidebar = () => {};
    
    try {
        const sidebarContext = useSidebar();
        isCollapsed = sidebarContext.isCollapsed;
        toggleSidebar = sidebarContext.toggleSidebar;
    } catch (error) {
        console.warn('PageHeader: useSidebar hook failed, using default values:', error);
    }

    return (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left Side - Sidebar Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        ) : (
                            <PanelLeftClose className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        )}
                    </button>
                    
                    {title && (
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {title}
                        </h1>
                    )}
                </div>

                {/* Right Side - Additional Actions (if needed) */}
                <div className="flex items-center gap-2">
                    {/* Space for future actions */}
                </div>
            </div>

            {/* Breadcrumbs - Below the main header */}
            {breadcrumbs.length > 0 && (
                <div className="px-6 pb-4">
                    <Breadcrumb items={breadcrumbs} />
                </div>
            )}
        </div>
    );
}