/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.ts',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                // Konsistensi ukuran font untuk sidebar dan komponen
                'sidebar-label': ['0.875rem', { lineHeight: '1.25rem' }], // text-sm
                'sidebar-sublabel': ['0.75rem', { lineHeight: '1rem' }], // text-xs
                'page-title': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }], // text-2xl font-bold
                'section-title': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }], // text-lg font-semibold
            },
            spacing: {
                'sidebar-width': '16rem', // w-64
                'sidebar-collapsed': '4rem', // w-16
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
            },
        },
    },

    plugins: [require('tailwindcss-animate')],
};