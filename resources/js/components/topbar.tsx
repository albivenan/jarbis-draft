import { usePage } from '@inertiajs/react';
import AppLogo from './app-logo';

export function Topbar() {
    const page = usePage();
    const user = (page.props as any)?.auth?.user;

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Right Side - Company Info */}
                <div className="flex items-center gap-3">
                    <AppLogo />
                    <div className="hidden sm:block">
                        <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            PT Jarbis Indonesia
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Manufacturing Excellence
                        </p>
                    </div>
                </div>

                {/* Right Side - User Info */}
                {user && (
                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user.role?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}