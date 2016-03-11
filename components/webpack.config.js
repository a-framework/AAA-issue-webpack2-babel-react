const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        a: './lib/component.js',
        vendor: ['react']
    },
    output: {
        path: './dist/',
        filename: '[name].js'
    },
    resolve: {
        alias: {
            'decorators': path.resolve(__dirname, '../utils/super-decorators/'),
            'react': require.resolve('react')
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: [
                        require.resolve('babel-preset-es2015-webpack'),
                        require.resolve('babel-preset-react')
                    ]
                }
            }
        ]            
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js'}),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false},
            sourceMap: false
        })
    ]
};
