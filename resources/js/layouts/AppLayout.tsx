import React, { ReactNode } from 'react';
import AuthenticatedLayout from './authenticated-layout';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, title, breadcrumbs }: AppLayoutProps) {
    return (
        <AuthenticatedLayout title={title} breadcrumbs={breadcrumbs}>
            {children}
        </AuthenticatedLayout>
    );
}
