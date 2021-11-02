/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

fontFamily['sans'] = ['Poppins', 'system-ui'];

module.exports = {
    purge: ['./src/**/*.tsx'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            gray: colors.trueGray,
            primary: colors.sky,
            green: colors.emerald,
        },
        screens: {
            xs: '375px',
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1400px',
        },
        dropShadow: {
            DEFAULT: '1px 1px 2px rgba(0, 0, 0, 0.25)',
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
        extend: {
            gridAutoRows: theme => ({
                ...theme('spacing'),
            }),
            transitionProperty: {
                'max-height': 'max-height',
            },
        },
    },
    variants: {
        extend: {
            ringColor: ['hover'],
            ringWidth: ['hover'],
            cursor: ['hover', 'focus'],
            margin: ['last'],
        },
    },
    plugins: [],
};
