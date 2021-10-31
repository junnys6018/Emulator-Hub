/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');

fontFamily['sans'] = ['Poppins', 'system-ui'];

module.exports = {
    purge: ['./src/**/*.tsx'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1400px',
        },
        fontFamily: fontFamily,
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '18px',
                md: '24px',
                lg: '16px',
                xl: '30px',
                '2xl': '40px',
            },
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
