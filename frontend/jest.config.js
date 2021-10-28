module.exports = {
    cacheDirectory: 'node_modules/.cache/jest',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.tsx', 'tests/**/*.ts'],
    // coverageThreshold: {
    //     global: {
    //         branches: 90,
    //         functions: 90,
    //         lines: 90,
    //         statements: 90,
    //     },
    // },
    testEnvironment: 'jest-environment-jsdom',
    testPathIgnorePatterns: ['node_modules'],
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/mocks/fileMock.js',
    },
};
