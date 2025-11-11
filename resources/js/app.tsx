import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
        
        // Try resolving as a direct file (e.g., 'User/Show' -> './Pages/User/Show.tsx')
        let path = `./Pages/${name.replace(/\./g, '/')}.tsx`;
        if (path in pages) {
            return pages[path];
        }

        // If not found, try resolving as a folder with an index.tsx (e.g., 'User' -> './Pages/User/index.tsx')
        path = `./Pages/${name.replace(/\./g, '/')}/index.tsx`;
        if (path in pages) {
            return pages[path];
        }
        
        throw new Error(`Page not found: ${name}`);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
