import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: [
            {
                find: 'ziggy-js',
                replacement: resolve(__dirname, 'vendor/tightenco/ziggy'),
            },
            {
                find: '@',
                replacement: resolve(__dirname, 'resources/js'),
            },
            {
                find: '@/components',
                replacement: resolve(__dirname, 'resources/js/components'),
            },
            {
                find: '@/layouts',
                replacement: resolve(__dirname, 'resources/js/layouts'),
            },
            {
                find: '@/types',
                replacement: resolve(__dirname, 'resources/js/types'),
            },
        ],
    },
});
