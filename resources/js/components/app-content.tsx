import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'sidebar', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset {...props}>
                <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out">
                    <div className="container mx-auto p-4 max-w-7xl">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        );
    }

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl transition-all duration-300 ease-in-out" {...props}>
            {children}
        </main>
    );
}
