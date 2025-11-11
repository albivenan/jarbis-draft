import { Fragment } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    if (items.length === 0) return null;

    return (
        <nav className="flex items-center space-x-2 text-sm">
            {items.map((item, index) => (
                <Fragment key={index}>
                    {index > 0 && (
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                    )}
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
                        >
                            {item.title}
                        </Link>
                    ) : (
                        <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                            {item.title}
                        </span>
                    )}
                </Fragment>
            ))}
        </nav>
    );
}