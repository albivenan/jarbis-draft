// resources/js/types/index.ts
import { type LucideIcon } from 'lucide-react';

export type NavItem = {
    title: string;
    href?: string;
    icon?: LucideIcon;
    children?: NavItem[];
    roles?: string[];
};

export type BreadcrumbItem = {
    title: string;
    href?: string;
};
