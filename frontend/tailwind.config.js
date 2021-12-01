/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const breakpoints = require('./breakpoints');

fontFamily['sans'] = ['Poppins', 'system-ui'];

module.exports = {
    purge: ['./src/**/*.tsx', './src/**/*.ts', './public/index.html'],
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
            yellow: colors.yellow,
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
                '5xl': '5rem',
            },
            zIndex: {
                '-10': '-10',
                '-20': '-20',
                '-30': '-30',
                '-40': '-40',
                '-50': '-50',
            },
        },
    },
    variants: {
        extend: {
            ringColor: ['hover', 'active'],
            ringWidth: ['hover'],
            cursor: ['hover', 'focus', 'disabled'],
            margin: ['last'],
            textColor: ['active'],
            backgroundColor: ['active', 'checked'],
            opacity: ['disabled'],
            outline: ['focus-visible'],
        },
    },
    plugins: [],
};
