module.exports = api => {
    // cache the config based on the previous value of NODE_ENV
    api.cache(() => process.env.NODE_ENV);

    const plugins = [
        [
            'babel-plugin-root-import',
            {
                rootPathPrefix: '@',
            },
        ],
    ];

    // change configuration if we are in a testing environment
    const isTest = api.env('test');
    if (isTest) {
        return {
            presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                '@babel/preset-react',
                '@babel/preset-typescript',
            ],
            plugins,
        };
    }

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        chrome: '73',
                        node: 'current',
                    },
                },
            ],
            '@babel/preset-react',
        ],
        plugins,
    };
};
