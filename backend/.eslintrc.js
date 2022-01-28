module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin

        // Enables eslint-plugin-prettier and eslint-config-prettier.
        // This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
        'plugin:prettier/recommended',
    ],
    plugins: ['@typescript-eslint'],
};
