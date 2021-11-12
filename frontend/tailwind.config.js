/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const breakpoints = require('./breakpoints');

fontFamily['sans'] = ['Poppins', 'system-ui'];

module.exports = {
    purge: ['./src/**/*.tsx'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.trueGray,
            primary: colors.sky,
            green: colors.emerald,
            red: colors.red,
        },
        screens: breakpoints,
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
            spacing: {
                168: '42rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
        },
    },
    variants: {
        extend: {
            ringColor: ['hover', 'active'],
            ringWidth: ['hover'],
            cursor: ['hover', 'focus'],
            margin: ['last'],
            textColor: ['active'],
            backgroundColor: ['active'],
        },
    },
    plugins: [],
};
