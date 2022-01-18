/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entrypoints = {};
glob.sync('./entrypoints/*.tsx').forEach(s => {
    entrypoints[s.split('/').slice(-1)[0].replace('.tsx', '')] = s;
});

module.exports = (env, options) => {
    const maxEntrypointSize = options.mode === 'production' ? 250000 : 500000;

    return {
        entry: entrypoints,
        mode: 'production',
        output: {
            path: path.resolve(__dirname, `../build/${options.mode}`),
            filename: '[name].[chunkhash].js',
            clean: true,
            publicPath: '/',
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                        },
                        {
                            loader: 'ts-loader',
                        },
                    ],
                },
                {
                    test: /\.(png|jpg|jpeg|gif|wasm)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
                {
                    test: /\.svg$/i,
                    oneOf: [
                        {
                            issuer: /\.[jt]sx?$/,
                            resourceQuery: /react/, // *.svg?react
                            use: ['@svgr/webpack'],
                        },
                        {
                            type: 'asset/resource',
                        },
                    ],
                },
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    use: ['source-map-loader'],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                favicon: 'public/assets/icon.svg',
                title: 'Emulator Hub',
                template: 'public/index.html',
            }),
        ],
        performance: {
            maxAssetSize: 10000000, // 10MB
            maxEntrypointSize: maxEntrypointSize,
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
    };
};
