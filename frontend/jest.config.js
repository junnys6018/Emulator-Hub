module.exports = {
    cacheDirectory: 'node_modules/.cache/jest',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.tsx', 'src/**/*.ts'],
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
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|wasm)$':
            '<rootDir>/tests/mocks/fileMock.js',
        '\\.css$': '<rootDir>/tests/mocks/styleMock.js',
        '\\.svg\\?react$': '<rootDir>/tests/mocks/svgr.js',
        '\\./emu$': '<rootDir>/tests/mocks/emuMock.js',
        '@/(.*)$': '<rootDir>/$1',
    },
    setupFiles: ['fake-indexeddb/auto', './tests/setupJest.js'],
};
