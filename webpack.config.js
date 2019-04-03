const path = require('path');
const nodeExternals = require('webpack-node-externals');
require("@babel/register");
require("@babel/polyfill");

module.exports = {
    mode: "production",
    entry: ["@babel/polyfill", "./src/server.ts"],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'server.js',
    },
    target: 'node',
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false,   // if you don't put this is, __dirname
        __filename: false,  // and __filename return blank or /
    },
    externals: [nodeExternals()], // Need this to avoid error when working with Express
    optimization: {
        minimize: true
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            }
        ]
    }
}
