import { Icon } from '@/components/icon';
import { type NavItem } from '@/config/sidebar-menu';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<'div'> & {
    items: NavItem[];
}) {
    return (
        <div {...props} className={`flex flex-col gap-2 ${className || ''}`}>
            {items.map((item) => {
                const IconComponent = item.icon;
                return (
                    <a
                        key={item.title}
                        href={item.href}
                        className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        <span>{item.title}</span>
                    </a>
                );
            })}
        </div>
    );
}
