import React from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

interface ErrorPageProps {
    status: number;
    message: string;
}

const Error: React.FC<ErrorPageProps> = ({ status, message }) => {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status];

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status || 500];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Head title={title} />
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">{status}</h1>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">{message || description}</p>
                <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Error;
